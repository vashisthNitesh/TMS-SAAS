import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# ----------------------------------------------------
# 1. Configuration & Master Models
# ----------------------------------------------------

class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=255)
    subdomain = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name


class Role(models.Model):
    role_name = models.CharField(max_length=100)
    permissions = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.role_name


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    full_name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.email or self.username


class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='customers')
    customer_code = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'customer_code')

    def __str__(self):
        return f"{self.name} ({self.customer_code})"


class Warehouse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='warehouses')
    warehouse_code = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    geofence_radius_meters = models.IntegerField(default=150)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'warehouse_code')

    def __str__(self):
        return f"{self.name} ({self.warehouse_code})"


class Driver(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='drivers')
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    license_number = models.CharField(max_length=100)
    license_expiry = models.DateField()
    is_active = models.BooleanField(default=True)
    device_udid = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'license_number')

    def __str__(self):
        return self.full_name


class Vehicle(models.Model):
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('ASSIGNED', 'Assigned'),
        ('MAINTENANCE', 'Maintenance'),
        ('IN_TRANSIT', 'In Transit'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='vehicles')
    plate_number = models.CharField(max_length=50)
    vehicle_type = models.CharField(max_length=100)
    payload_capacity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    cbm_capacity = models.DecimalField(max_digits=10, decimal_places=2)
    telematics_device_id = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='AVAILABLE')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'plate_number')

    def __str__(self):
        return self.plate_number


class Transporter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='transporters')
    name = models.CharField(max_length=255)
    contact_email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ----------------------------------------------------
# 2. Transaction Models (Execution & Invoicing)
# ----------------------------------------------------

class Order(models.Model):
    ORDER_TYPE_CHOICES = (
        ('FTL', 'Full Truck Load'),
        ('LTL', 'Less Than Truck Load'),
    )
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SCHEDULED', 'Scheduled'),
        ('ALLOCATED', 'Allocated'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='orders')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=100)
    order_type = models.CharField(max_length=50, choices=ORDER_TYPE_CHOICES, default='FTL')
    origin_address = models.TextField()
    origin_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    origin_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    dest_address = models.TextField()
    dest_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    dest_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'order_number')

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    sku = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    quantity = models.IntegerField(default=1)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    volume_cbm = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.sku} x {self.quantity}"


class Job(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SCHEDULED', 'Scheduled'),
        ('ALLOCATED', 'Allocated'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='jobs')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='jobs')
    job_number = models.CharField(max_length=100)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    volume_cbm = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')

    class Meta:
        unique_together = ('tenant', 'job_number')

    def __str__(self):
        return self.job_number


class Trip(models.Model):
    STATUS_CHOICES = (
        ('PLANNED', 'Planned'),
        ('ALLOCATED', 'Allocated'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('COMPLETED', 'Completed'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='trips')
    trip_number = models.CharField(max_length=100)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='trips')
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='trips')
    transporter = models.ForeignKey(Transporter, on_delete=models.SET_NULL, null=True, blank=True, related_name='trips')
    planned_distance_km = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    planned_duration_minutes = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PLANNED')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'trip_number')

    def __str__(self):
        return self.trip_number


class TripJob(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='trip_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='trip_jobs')
    sequence_number = models.IntegerField(default=1)

    class Meta:
        unique_together = ('trip', 'job')


class TripMilestone(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='milestones')
    milestone_name = models.CharField(max_length=100)
    expected_time = models.DateTimeField(null=True, blank=True)
    actual_time = models.DateTimeField(null=True, blank=True)
    geofence_status = models.CharField(max_length=50, default='PENDING')

    def __str__(self):
        return f"{self.trip.trip_number} - {self.milestone_name}"


class TripEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.trip.trip_number} - {self.event_type}"


class PodAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='pods')
    file_url = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    ocr_status = models.CharField(max_length=50, default='PENDING')
    verification_status = models.CharField(max_length=50, default='PENDING')


class Expense(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expense_type = models.CharField(max_length=100)
    receipt_url = models.TextField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_expenses')
    status = models.CharField(max_length=50, default='PENDING')


class Invoice(models.Model):
    STATUS_CHOICES = (
        ('UNPAID', 'Unpaid'),
        ('PAID', 'Paid'),
        ('DISPUTED', 'Disputed'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='invoices')
    trip = models.ForeignKey(Trip, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    invoice_number = models.CharField(max_length=100)
    base_freight_cost = models.DecimalField(max_digits=12, decimal_places=2)
    expense_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    penalty_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    net_payable = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='UNPAID')
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'invoice_number')

    def __str__(self):
        return self.invoice_number
