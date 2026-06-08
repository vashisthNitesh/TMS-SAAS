from rest_framework import serializers
from .models import (
    Tenant, RoleTemplate, Role, User, Customer, Warehouse,
    Driver, Vehicle, Transporter,
    Order, OrderItem, Job, Trip, TripJob,
    TripMilestone, TripEvent, PodAttachment,
    Expense, Invoice,
    BusinessUnit, Branch, Department, TenantModule, TenantConfiguration,
    CustomFieldDefinition, CustomFieldValue, CustomWorkflow,
)


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    role_name = serializers.CharField(source='role.role_name', read_only=True)
    tenant_name = serializers.CharField(source='tenant.company_name', read_only=True)
    business_unit_name = serializers.CharField(source='business_unit.name', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'tenant', 'tenant_name', 'role', 'role_name', 'business_unit', 'business_unit_name', 'branch', 'branch_name', 'department', 'department_name', 'is_active', 'password')
        read_only_fields = ('id',)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class RoleTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleTemplate
        fields = '__all__'


class BusinessUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUnit
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class TenantModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantModule
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class TenantConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantConfiguration
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class CustomFieldDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomFieldDefinition
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class CustomFieldValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomFieldValue
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class CustomWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomWorkflow
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class TransporterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transporter
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ('id',)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'order_number')

    def create(self, validated_data):
        import uuid
        validated_data['order_number'] = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = (
            'customer', 'order_type', 'origin_address', 'origin_latitude',
            'origin_longitude', 'dest_address', 'dest_latitude', 'dest_longitude',
            'items',
        )

    def create(self, validated_data):
        import uuid
        items_data = validated_data.pop('items', [])
        validated_data['order_number'] = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        order = Order.objects.create(**validated_data)
        for item in items_data:
            OrderItem.objects.create(order=order, **item)
        return order


class JobSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('id', 'job_number')


class TripMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripMilestone
        fields = '__all__'
        read_only_fields = ('id',)


class TripEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripEvent
        fields = '__all__'
        read_only_fields = ('id', 'recorded_at')


class TripJobSerializer(serializers.ModelSerializer):
    job_number = serializers.CharField(source='job.job_number', read_only=True)

    class Meta:
        model = TripJob
        fields = '__all__'
        read_only_fields = ('id',)


class TripSerializer(serializers.ModelSerializer):
    milestones = TripMilestoneSerializer(many=True, read_only=True)
    trip_jobs = TripJobSerializer(many=True, read_only=True)
    vehicle_plate = serializers.CharField(source='vehicle.plate_number', read_only=True)
    driver_name = serializers.CharField(source='driver.full_name', read_only=True)
    transporter_name = serializers.CharField(source='transporter.name', read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'trip_number', 'created_at')

    def create(self, validated_data):
        import uuid
        validated_data['trip_number'] = f"TRIP-{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)


class AllocateJobSerializer(serializers.Serializer):
    serve_by = serializers.ChoiceField(choices=['internal', 'transporter', 'freelancer'])
    vehicle_id = serializers.UUIDField(required=False)
    driver_id = serializers.UUIDField(required=False)
    transporter_id = serializers.UUIDField(required=False)


class PodAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodAttachment
        fields = '__all__'
        read_only_fields = ('id', 'uploaded_at', 'ocr_status', 'verification_status')


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('id',)


class InvoiceSerializer(serializers.ModelSerializer):
    trip_number = serializers.CharField(source='trip.trip_number', read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ('id', 'invoice_number', 'issued_at')

    def create(self, validated_data):
        import uuid
        validated_data['invoice_number'] = f"INV-{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)


# Lightweight serializers for list views / control tower
class TripListSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.plate_number', read_only=True)
    driver_name = serializers.CharField(source='driver.full_name', read_only=True)
    transporter_name = serializers.CharField(source='transporter.name', read_only=True)
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = (
            'id', 'trip_number', 'status', 'vehicle_plate',
            'driver_name', 'transporter_name', 'planned_distance_km',
            'planned_duration_minutes', 'created_at', 'job_count',
        )

    def get_job_count(self, obj):
        return obj.trip_jobs.count()


class DashboardStatsSerializer(serializers.Serializer):
    total_orders = serializers.IntegerField()
    active_trips = serializers.IntegerField()
    pending_jobs = serializers.IntegerField()
    available_vehicles = serializers.IntegerField()
    delayed_trips = serializers.IntegerField()
    completed_today = serializers.IntegerField()
