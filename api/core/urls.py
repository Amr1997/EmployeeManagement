from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet,
    DepartmentViewSet,
    EmployeeViewSet,
    DashboardAnalyticsView,
    CustomTokenObtainPairView
)

router = DefaultRouter()
router.register('companies', CompanyViewSet)
router.register('departments', DepartmentViewSet)
router.register('employees', EmployeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardAnalyticsView.as_view(), name='dashboard'),
    path('jwt/create/', CustomTokenObtainPairView.as_view(), name='jwt-create'),
]
