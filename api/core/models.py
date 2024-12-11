from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django_fsm import FSMField, transition
from django.utils.timezone import now


class UserManager(BaseUserManager):
    """
    Custom manager for User model where email is the unique identifier for login.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'Admin')       
        # Create the superuser
        user = self.create_user(email, password, **extra_fields)

        # Automatically create an Employee object for the superuser
        if not Company.objects.exists():
            company = Company.objects.create(name="Default Company")
        else:
            company = Company.objects.first()     
        # Create a default department if none exists
        if not company.departments.exists():
            department = Department.objects.create(company=company, name="Default Department")
        else:
            department = company.departments.first()   
            Employee.objects.create(
                company=company,
                department=department,
                user=user,
                name=user.email,
                email=user.email,
                mobile="0000000000",
                address="Default Address",
                designation="Administrator"
            )
        return user


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
        ('Employee', 'Employee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Employee')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    num_departments = models.IntegerField(default=0, editable=False)
    num_employees = models.IntegerField(default=0, editable=False)

    def update_department_count(self):
        self.num_departments = self.departments.count()
        self.save()

    def update_employee_count(self):
        self.num_employees = self.employees.count()
        self.save()

    def __str__(self):
        return self.name


class Department(models.Model):
    company = models.ForeignKey(
        Company,
        related_name='departments',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    num_employees = models.IntegerField(default=0, editable=False)

    def update_employee_count(self):
        self.num_employees = self.employees.count()
        self.save()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update the department count in the company
        self.company.update_department_count()

    def delete(self, *args, **kwargs):
        company = self.company
        super().delete(*args, **kwargs)
        # Update the department count in the company
        company.update_department_count()

    def __str__(self):
        return f"{self.name} ({self.company.name})"


class Employee(models.Model):
    STATUS_CHOICES = (
        ('Application Received', 'Application Received'),
        ('Interview Scheduled', 'Interview Scheduled'),
        ('Hired', 'Hired'),
        ('Not Accepted', 'Not Accepted'),
    )
    company = models.ForeignKey(
        Company,
        related_name='employees',
        on_delete=models.CASCADE
    )
    department = models.ForeignKey(
        Department,
        related_name='employees',
        on_delete=models.CASCADE
    )
    status = FSMField(
        choices=STATUS_CHOICES,
        default='Application Received'
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15)
    address = models.TextField()
    designation = models.CharField(max_length=100)
    hired_on = models.DateField(null=True, blank=True)

    @property
    def days_employed(self):
        """
        Calculate days employed only if the employee is hired.
        """
        if self.hired_on and self.status == 'Hired':
            return (now().date() - self.hired_on).days
        return None

    def save(self, *args, **kwargs):
        """
        Ensure 'hired_on' is set only if the status is 'Hired'.
        """
        if self.status != 'Hired':
            self.hired_on = None  # Clear the hired_on field if not hired
        super().save(*args, **kwargs)

    @transition(field=status, source='Application Received', target='Interview Scheduled')
    def schedule_interview(self):
        pass

    @transition(field=status, source='Interview Scheduled', target='Hired')
    def hire(self):
        """
        Automatically set the hired_on date when hiring.
        """
        self.hired_on = now().date()

    @transition(field=status, source='*', target='Not Accepted')
    def reject(self):
        """
        Clear the hired_on date when rejecting the employee.
        """
        self.hired_on = None

    def __str__(self):
        return f"{self.name} - {self.designation} ({self.company.name})"
