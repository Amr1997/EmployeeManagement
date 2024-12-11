from django.db import models, transaction
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError, APIException
from .models import Company, Department, Employee, User
from .serializers import (
    CompanySerializer,
    DepartmentSerializer,
    EmployeeSerializer,
    UserSerializer,
)
from .permissions import IsManager , IsAdminManagerOrReadOwnData
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsManager]

    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            return Response({"detail": exc.detail}, status=status.HTTP_400_BAD_REQUEST)
        return super().handle_exception(exc)


class CompanyViewSet(ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsManager]

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                company = serializer.save()
                company.update_department_count()
                company.update_employee_count()
        except Exception as exc:
            raise APIException(f"Failed to create company: {str(exc)}")

    def perform_update(self, serializer):
        try:
            with transaction.atomic():
                company = serializer.save()
                company.update_department_count()
                company.update_employee_count()
        except Exception as exc:
            raise APIException(f"Failed to update company: {str(exc)}")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            with transaction.atomic():
                instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as exc:
            raise APIException(f"Failed to delete company: {str(exc)}")


class DepartmentViewSet(ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsManager]

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                department = serializer.save()
                department.company.update_department_count()
        except Exception as exc:
            raise APIException(f"Failed to create department: {str(exc)}")

    def perform_update(self, serializer):
        try:
            with transaction.atomic():
                department = serializer.save()
                department.company.update_department_count()
        except Exception as exc:
            raise APIException(f"Failed to update department: {str(exc)}")

    def perform_destroy(self, instance):
        try:
            with transaction.atomic():
                company = instance.company
                instance.delete()
                company.update_department_count()
        except Exception as exc:
            raise APIException(f"Failed to delete department: {str(exc)}")


class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAdminManagerOrReadOwnData]

    def get_queryset(self):
        """
        Restrict the queryset based on user role.
        - Employees see only their own data.
        - Admins and Managers see all data.
        """
        if self.request.user.role == 'Employee':
            return self.queryset.filter(user=self.request.user)
        return self.queryset

    def perform_create(self, serializer):
        """
        Handles creation of Employee and associated User object within a transaction.
        """
        try:
            with transaction.atomic():
                user_data = serializer.validated_data.pop('user')
                user_serializer = UserSerializer(data=user_data)
                user_serializer.is_valid(raise_exception=True)
                user = user_serializer.save()

                employee = serializer.save(user=user)
                employee.company.update_employee_count()
                employee.department.update_employee_count()
        except ValidationError as exc:
            raise ValidationError({"detail": exc.detail})
        except Exception as exc:
            raise APIException(f"Failed to create employee: {str(exc)}")

    def perform_update(self, serializer):
        """
        Handles updates to Employee and its associated User object.
        """
        try:
            with transaction.atomic():
                # Extract user data if provided
                user_data = serializer.validated_data.pop('user', None)
                employee = serializer.save()  # Update the Employee fields

                if user_data:
                    # Update the associated User object
                    user_serializer = UserSerializer(employee.user, data=user_data, partial=True)
                    user_serializer.is_valid(raise_exception=True)
                    user_serializer.save()

                # Handle department updates if changed
                old_department = self.get_object().department
                new_department = employee.department
                if old_department != new_department:
                    old_department.update_employee_count()
                    new_department.update_employee_count()

                # Update company employee count
                employee.company.update_employee_count()

        except ValidationError as exc:
            raise ValidationError({"detail": exc.detail})
        except Exception as exc:
            raise APIException(f"Failed to update employee: {str(exc)}")

    def perform_destroy(self, instance):
        """
        Handles deletion of Employee and updates counts accordingly.
        """
        try:
            with transaction.atomic():
                company = instance.company
                department = instance.department
                instance.user.delete()
                instance.delete()
                company.update_employee_count()
                department.update_employee_count()
        except Exception as exc:
            raise APIException(f"Failed to delete employee: {str(exc)}")


class DashboardAnalyticsView(APIView):
    permission_classes = [IsManager]

    def get(self, request):
        try:
            total_companies = Company.objects.count()
            total_departments = Department.objects.count()
            total_employees = Employee.objects.count()
            status_breakdown = Employee.objects.values('status').annotate(count=models.Count('status'))

            return Response({
                'total_companies': total_companies,
                'total_departments': total_departments,
                'total_employees': total_employees,
                'employee_status_breakdown': status_breakdown,
            }, status=status.HTTP_200_OK)
        except Exception as exc:
            raise APIException(f"Failed to fetch dashboard analytics: {str(exc)}")
