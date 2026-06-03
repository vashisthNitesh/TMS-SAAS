from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Tenant, Role, User, Customer, Warehouse,
    Driver, Vehicle, Transporter,
    Order, OrderItem, Job, Trip, TripJob,
    TripMilestone, TripEvent, PodAttachment,
    Expense, Invoice,
)


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'subdomain', 'created_at')
    search_fields = ('company_name', 'subdomain')


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('role_name',)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'full_name', 'tenant', 'role', 'is_staff')
    list_filter = ('tenant', 'role', 'is_staff')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('TAME Info', {'fields': ('tenant', 'role', 'full_name')}),
    )


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'customer_code', 'tenant', 'email', 'phone')
    search_fields = ('name', 'customer_code')
    list_filter = ('tenant',)


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'warehouse_code', 'tenant', 'address')
    search_fields = ('name', 'warehouse_code')
    list_filter = ('tenant',)


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'license_number', 'license_expiry', 'is_active', 'tenant')
    search_fields = ('full_name', 'phone', 'license_number')
    list_filter = ('tenant', 'is_active')


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('plate_number', 'vehicle_type', 'payload_capacity_kg', 'status', 'tenant')
    search_fields = ('plate_number',)
    list_filter = ('tenant', 'status', 'vehicle_type')


@admin.register(Transporter)
class TransporterAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'rating', 'tenant')
    search_fields = ('name',)
    list_filter = ('tenant',)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'order_type', 'status', 'tenant', 'created_at')
    search_fields = ('order_number',)
    list_filter = ('tenant', 'status', 'order_type')
    inlines = [OrderItemInline]


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('job_number', 'order', 'weight_kg', 'volume_cbm', 'status', 'tenant')
    search_fields = ('job_number',)
    list_filter = ('tenant', 'status')


class TripJobInline(admin.TabularInline):
    model = TripJob
    extra = 0


class TripMilestoneInline(admin.TabularInline):
    model = TripMilestone
    extra = 0


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('trip_number', 'vehicle', 'driver', 'transporter', 'status', 'tenant', 'created_at')
    search_fields = ('trip_number',)
    list_filter = ('tenant', 'status')
    inlines = [TripJobInline, TripMilestoneInline]


@admin.register(PodAttachment)
class PodAdmin(admin.ModelAdmin):
    list_display = ('trip', 'ocr_status', 'verification_status', 'uploaded_at')
    list_filter = ('verification_status', 'ocr_status')


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('trip', 'expense_type', 'amount', 'status')
    list_filter = ('status', 'expense_type')


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'trip', 'net_payable', 'status', 'issued_at')
    list_filter = ('tenant', 'status')
    search_fields = ('invoice_number',)
