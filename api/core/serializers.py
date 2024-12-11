from rest_framework import serializers
from djoser.serializers import (
    UserCreateSerializer as BaseUserCreateSerializer,
    UserSerializer as BaseUserSerializer,
)
from .models import Company, Department, Employee, User

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add additional fields to the response
        user = self.user
        data["role"] = user.role
        data["employee_id"] = getattr(user.employee, "id", None)

        return data


class UserCreateSerializer(BaseUserCreateSerializer):
    """
    Serializer for creating a user with additional fields like role.
    """
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'role', 'password')
        ref_name = 'CustomUserCreateSerializer'


class UserSerializer(BaseUserSerializer):
    """
    Serializer for user details with role information.
    """
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'role')
        ref_name = 'CustomUserSerializer'


class DepartmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Department model, includes employee count.
    """
    num_employees = serializers.IntegerField(read_only=True)

    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ('num_employees',)


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Employee model with status validation.
    """
    user = UserSerializer()
    status = serializers.ChoiceField(choices=Employee.STATUS_CHOICES)
    days_employed = serializers.IntegerField(read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ('days_employed',)

    def validate(self, data):
        # Ensure the department belongs to the specified company
        if data['department'].company != data['company']:
            raise serializers.ValidationError(
                {"department": "Department must belong to the specified company."}
            )
        # Validate the hired_on date
        if data['status'] != 'Hired' and data.get('hired_on'):
            raise serializers.ValidationError(
                {"hired_on": "Hired date can only be set when the status is 'Hired'."}
            )
        return data


class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for Company model, includes related departments and employees.
    """
    departments = DepartmentSerializer(many=True, read_only=True)
    employees = EmployeeSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('num_departments', 'num_employees')
