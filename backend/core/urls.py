from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TenantViewSet, RoleViewSet, UserViewSet,
    CustomerViewSet, WarehouseViewSet, DriverViewSet,
    VehicleViewSet, TransporterViewSet,
    OrderViewSet, JobViewSet, TripViewSet,
    PodAttachmentViewSet, ExpenseViewSet, InvoiceViewSet,
    DashboardViewSet, ControlTowerViewSet,
)

router = DefaultRouter()
router.register('tenants', TenantViewSet, basename='tenant')
router.register('roles', RoleViewSet, basename='role')
router.register('users', UserViewSet, basename='user')
router.register('customers', CustomerViewSet, basename='customer')
router.register('warehouses', WarehouseViewSet, basename='warehouse')
router.register('drivers', DriverViewSet, basename='driver')
router.register('vehicles', VehicleViewSet, basename='vehicle')
router.register('transporters', TransporterViewSet, basename='transporter')
router.register('orders', OrderViewSet, basename='order')
router.register('jobs', JobViewSet, basename='job')
router.register('trips', TripViewSet, basename='trip')
router.register('pods', PodAttachmentViewSet, basename='pod')
router.register('expenses', ExpenseViewSet, basename='expense')
router.register('invoices', InvoiceViewSet, basename='invoice')
router.register('dashboard', DashboardViewSet, basename='dashboard')
router.register('control-tower', ControlTowerViewSet, basename='control-tower')

urlpatterns = [
    path('', include(router.urls)),
]
