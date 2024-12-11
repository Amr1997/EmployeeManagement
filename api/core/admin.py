from django.contrib import admin
from .models import User, Company, Department, Employee


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'role', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser')
    search_fields = ('email', 'role')
    ordering = ('email',)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'num_departments', 'num_employees')
    search_fields = ('name',)
    readonly_fields = ('num_departments', 'num_employees')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'num_employees')
    list_filter = ('company',)
    search_fields = ('name', 'company__name')
    readonly_fields = ('num_employees',)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'email', 'status', 'company', 'department', 'hired_on', 'days_employed')
    list_filter = ('status', 'company', 'department')
    search_fields = ('name', 'email', 'company__name', 'department__name', 'designation')
    readonly_fields = ('days_employed', 'hired_on')
    fieldsets = (
        (None, {
            'fields': ('name', 'email', 'mobile', 'address', 'designation', 'user')  # Add 'user' field here
        }),
        ('Company Details', {
            'fields': ('company', 'department')
        }),
        ('Status & Workflow', {
            'fields': ('status', 'hired_on', 'days_employed'),
        }),
    )

    def save_model(self, request, obj, form, change):
        # If the Employee does not already have a user, create one
        if not obj.user:
            user = User.objects.create_user(
                email=obj.email,
                username=obj.email,  # Using email as the username
                password='default_password',  # Consider setting a default or generated password
                role='Employee',  # Default role for new users
            )
            obj.user = user  # Link the user to the employee

        super().save_model(request, obj, form, change)
