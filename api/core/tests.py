from rest_framework.test import APITestCase
from rest_framework import status
from .models import Company, Department, Employee
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpass')

    def test_login_success(self):
        response = self.client.post('/auth/jwt/create/', {'email': 'testuser@example.com', 'password': 'testpass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_failure(self):
        response = self.client.post('/auth/jwt/create/', {'email': 'testuser@example.com', 'password': 'wrongpass'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class BasePermissionTest(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(email='admin@example.com', password='adminpass', role='Admin')
        self.manager_user = User.objects.create_user(email='manager@example.com', password='managerpass', role='Manager')

    def authenticate_user(self, email, password):
        response = self.client.post('/auth/jwt/create/', {'email': email, 'password': password})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")


class CompanyTests(BasePermissionTest):
    def setUp(self):
        super().setUp()
        self.company = Company.objects.create(name='Test Company')

    def test_list_companies_as_admin(self):
        self.authenticate_user('admin@example.com', 'adminpass')
        response = self.client.get('/companies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_companies_as_manager(self):
        self.authenticate_user('manager@example.com', 'managerpass')
        response = self.client.get('/companies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_company_as_admin(self):
        self.authenticate_user('admin@example.com', 'adminpass')
        response = self.client.post('/companies/', {'name': 'New Company'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class DepartmentTests(BasePermissionTest):
    def setUp(self):
        super().setUp()
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(name='Test Department', company=self.company)

    def test_create_department_as_admin(self):
        self.authenticate_user('admin@example.com', 'adminpass')
        response = self.client.post('/departments/', {'name': 'New Department', 'company': self.company.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_department_as_manager(self):
        self.authenticate_user('manager@example.com', 'managerpass')
        response = self.client.post('/departments/', {'name': 'New Department', 'company': self.company.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class EmployeeTests(BasePermissionTest):
    def setUp(self):
        super().setUp()
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(name='Test Department', company=self.company)

    def test_create_employee_with_user(self):
        self.authenticate_user('admin@example.com', 'adminpass')
        payload = {
            "user": {
                "email": "johndoe@example.com",
                "role": "Employee",
                "password": "securepassword123"
            },
            "name": "John Doe",
            "company": self.company.id,
            "department": self.department.id,
            "status": "Application Received",
            "mobile": "1234567890",
            "address": "123 Main St",
            "designation": "Software Engineer"
        }
        response = self.client.post('/employees/', data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Employee.objects.filter(name="John Doe").exists())
        self.assertTrue(User.objects.filter(email="johndoe@example.com").exists())

    def test_create_employee_with_invalid_user_data(self):
        self.authenticate_user('admin@example.com', 'adminpass')
        payload = {
            "user": {
                "email": "invalid-email",
                "role": "Employee",
                "password": "short"
            },
            "name": "John Doe",
            "company": self.company.id,
            "department": self.department.id,
            "status": "Application Received",
            "mobile": "1234567890",
            "address": "123 Main St",
            "designation": "Software Engineer"
        }
        response = self.client.post('/employees/', data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("user", response.data)

    def test_update_employee_and_user(self):
        self.authenticate_user('admin@example.com', 'adminpass')
        user = User.objects.create_user(email='johndoe@example.com', password='securepassword123')
        employee = Employee.objects.create(
            user=user,
            name="John Doe",
            company=self.company,
            department=self.department,
            status='Application Received',
            mobile='1234567890',
            address='123 Main St',
            designation='Software Engineer'
        )

        payload = {
            "user": {
                "email": "updatedemail@example.com"
            },
            "mobile": "9876543210",
            "designation": "Senior Software Engineer"
        }
        response = self.client.patch(f'/employees/{employee.id}/', data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        employee.refresh_from_db()
        user.refresh_from_db()
        self.assertEqual(employee.mobile, "9876543210")
        self.assertEqual(employee.designation, "Senior Software Engineer")
        self.assertEqual(user.email, "updatedemail@example.com")

    def test_delete_employee(self):
        self.authenticate_user('admin@example.com', 'adminpass')
        user = User.objects.create_user(email='johndoe@example.com', password='securepassword123')
        employee = Employee.objects.create(
            user=user,
            name="John Doe",
            company=self.company,
            department=self.department,
            status='Application Received',
            mobile='1234567890',
            address='123 Main St',
            designation='Software Engineer'
        )

        response = self.client.delete(f'/employees/{employee.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Employee.objects.filter(id=employee.id).exists())
        self.assertFalse(User.objects.filter(id=user.id).exists())


class DashboardTests(BasePermissionTest):
    def setUp(self):
        super().setUp()
        self.company = Company.objects.create(name='Company A')
        self.department = Department.objects.create(name='IT', company=self.company)
        Employee.objects.create(
            name='Employee A',
            status='Hired',
            email='employeeA@example.com',
            company=self.company,
            department=self.department
        )

    def test_dashboard_summary_as_admin(self):
        self.authenticate_user('admin@example.com', 'adminpass')
        response = self.client.get('/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_companies', response.data)
        self.assertIn('total_employees', response.data)
