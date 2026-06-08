from django.utils import timezone
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Tenant, RoleTemplate, Role, User, Customer, Warehouse,
    Driver, Vehicle, Transporter,
    Order, OrderItem, Job, Trip, TripJob,
    TripMilestone, TripEvent, PodAttachment,
    Expense, Invoice,
    BusinessUnit, Branch, Department, TenantModule, TenantConfiguration,
    CustomFieldDefinition, CustomFieldValue, CustomWorkflow,
)
from .serializers import (
    TenantSerializer, RoleTemplateSerializer, RoleSerializer, UserSerializer,
    CustomerSerializer, WarehouseSerializer, DriverSerializer,
    VehicleSerializer, TransporterSerializer,
    OrderSerializer, OrderCreateSerializer, OrderItemSerializer,
    JobSerializer, AllocateJobSerializer,
    TripSerializer, TripListSerializer, TripMilestoneSerializer,
    TripEventSerializer, PodAttachmentSerializer,
    ExpenseSerializer, InvoiceSerializer,
    DashboardStatsSerializer,
    BusinessUnitSerializer, BranchSerializer, DepartmentSerializer,
    TenantModuleSerializer, TenantConfigurationSerializer,
    CustomFieldDefinitionSerializer, CustomFieldValueSerializer, CustomWorkflowSerializer,
)
from .tasks import generate_jobs_for_order


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'onboard':
            return [AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def onboard(self, request):
        from django.db import transaction
        data = request.data
        
        company_name = data.get('company_name')
        subdomain = data.get('subdomain')
        if not company_name or not subdomain:
            return Response({'error': 'company_name and subdomain are required'}, status=400)
            
        try:
            with transaction.atomic():
                tenant = Tenant.objects.create(
                    company_name=company_name,
                    subdomain=subdomain,
                    timezone=data.get('timezone', 'UTC'),
                    currency=data.get('currency', 'USD'),
                    language=data.get('language', 'en'),
                    theme_primary=data.get('theme_primary', '#1a5b6e'),
                    theme_secondary=data.get('theme_secondary', '#6366f1'),
                )
                
                bu = BusinessUnit.objects.create(
                    tenant=tenant,
                    name=f"{company_name} HQ Business Unit",
                    code=f"HQ-BU",
                )
                
                branch = Branch.objects.create(
                    tenant=tenant,
                    business_unit=bu,
                    name=f"{company_name} Main Hub",
                    code="HQ-HUB",
                    branch_type="HUB",
                    address=data.get('address', '123 Enterprise Way'),
                    latitude=data.get('latitude', 0.0),
                    longitude=data.get('longitude', 0.0),
                )
                
                dept = Department.objects.create(
                    tenant=tenant,
                    name="Operations",
                    code="OPS",
                )
                
                default_modules = ['CRM', 'TRANSPORTATION', 'INVENTORY']
                for mod_key in default_modules:
                    TenantModule.objects.create(
                        tenant=tenant,
                        module_key=mod_key,
                        is_enabled=True,
                        config={}
                    )
                
                admin_role = Role.objects.create(
                    role_name="Admin",
                    permissions={"all": True}
                )
                
                username = data.get('admin_username')
                email = data.get('admin_email')
                password = data.get('admin_password')
                full_name = data.get('admin_full_name', 'Administrator')
                
                if not username or not password or not email:
                    raise Exception('admin_username, admin_email, and admin_password are required')
                    
                admin_user = User.objects.create(
                    username=username,
                    email=email,
                    tenant=tenant,
                    role=admin_role,
                    business_unit=bu,
                    branch=branch,
                    department=dept,
                    full_name=full_name,
                    is_staff=True
                )
                admin_user.set_password(password)
                admin_user.save()
                
            return Response({
                'status': 'onboarding_completed',
                'tenant_id': str(tenant.id),
                'admin_user_id': str(admin_user.id),
                'message': f"Organization {company_name} successfully onboarded."
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('tenant', 'role').all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant', 'role', 'is_active']
    search_fields = ['username', 'email', 'full_name']


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant']
    search_fields = ['name', 'customer_code', 'email']

    def get_queryset(self):
        qs = Customer.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class WarehouseViewSet(viewsets.ModelViewSet):
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant']
    search_fields = ['name', 'warehouse_code']

    def get_queryset(self):
        qs = Warehouse.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class DriverViewSet(viewsets.ModelViewSet):
    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant', 'is_active']
    search_fields = ['full_name', 'phone', 'license_number']

    def get_queryset(self):
        qs = Driver.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant', 'status', 'vehicle_type']
    search_fields = ['plate_number', 'vehicle_type']

    def get_queryset(self):
        qs = Vehicle.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs

    @action(detail=False, methods=['get'])
    def available(self, request):
        qs = self.get_queryset().filter(status='AVAILABLE')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class TransporterViewSet(viewsets.ModelViewSet):
    serializer_class = TransporterSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant']
    search_fields = ['name', 'contact_email']

    def get_queryset(self):
        qs = Transporter.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tenant', 'status', 'order_type', 'customer']
    search_fields = ['order_number']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Order.objects.select_related('customer', 'tenant').prefetch_related('items', 'jobs').all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        if self.request.user.tenant_id:
            order = serializer.save(tenant=self.request.user.tenant)
        else:
            order = serializer.save()
        # Trigger async job generation
        generate_jobs_for_order.delay(str(order.id))

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ('DELIVERED', 'COMPLETED'):
            return Response({'error': 'Cannot cancel a completed order.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'CANCELLED'
        order.save()
        return Response({'status': 'cancelled'})

    @action(detail=True, methods=['post'])
    def split(self, request, pk=None):
        import uuid
        order = self.get_object()
        new_order = Order.objects.create(
            tenant=order.tenant,
            customer=order.customer,
            order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
            order_type=order.order_type,
            origin_address=order.origin_address,
            origin_latitude=order.origin_latitude,
            origin_longitude=order.origin_longitude,
            dest_address=order.dest_address,
            dest_latitude=order.dest_latitude,
            dest_longitude=order.dest_longitude,
            status='PENDING',
        )
        generate_jobs_for_order.delay(str(new_order.id))
        return Response(OrderSerializer(new_order).data, status=status.HTTP_201_CREATED)


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant', 'status', 'order']
    search_fields = ['job_number']

    def get_queryset(self):
        qs = Job.objects.select_related('order', 'tenant').all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs

    @action(detail=True, methods=['post'])
    def allocate(self, request, pk=None):
        job = self.get_object()
        if job.status != 'PENDING':
            return Response({'error': 'Job is not in PENDING state.'}, status=status.HTTP_400_BAD_REQUEST)

        ser = AllocateJobSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        vehicle = driver = transporter = None

        if data['serve_by'] in ('internal', 'freelancer'):
            try:
                vehicle = Vehicle.objects.get(id=data.get('vehicle_id'))
                driver = Driver.objects.get(id=data.get('driver_id'))
            except (Vehicle.DoesNotExist, Driver.DoesNotExist):
                return Response({'error': 'Vehicle or Driver not found.'}, status=status.HTTP_400_BAD_REQUEST)
        elif data['serve_by'] == 'transporter':
            try:
                transporter = Transporter.objects.get(id=data.get('transporter_id'))
            except Transporter.DoesNotExist:
                return Response({'error': 'Transporter not found.'}, status=status.HTTP_400_BAD_REQUEST)

        import uuid
        trip = Trip.objects.create(
            tenant=job.tenant,
            trip_number=f"TRIP-{uuid.uuid4().hex[:8].upper()}",
            vehicle=vehicle,
            driver=driver,
            transporter=transporter,
            status='ALLOCATED',
        )
        TripJob.objects.create(trip=trip, job=job)

        job.status = 'ALLOCATED'
        job.save()

        if vehicle:
            vehicle.status = 'ASSIGNED'
            vehicle.save()

        return Response(TripSerializer(trip).data, status=status.HTTP_201_CREATED)


class TripViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tenant', 'status', 'vehicle', 'driver', 'transporter']
    search_fields = ['trip_number']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Trip.objects.select_related(
            'vehicle', 'driver', 'transporter', 'tenant'
        ).prefetch_related('milestones', 'trip_jobs', 'events').all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return TripListSerializer
        return TripSerializer

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        trip = self.get_object()
        if trip.status not in ('ALLOCATED', 'PLANNED'):
            return Response({'error': 'Trip cannot be started from current state.'}, status=400)
        trip.status = 'IN_TRANSIT'
        trip.save()
        TripEvent.objects.create(trip=trip, event_type='TRIP_STARTED', metadata={'actor': str(request.user.id)})
        return Response(TripSerializer(trip).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        trip = self.get_object()
        trip.status = 'COMPLETED'
        trip.save()
        if trip.vehicle:
            trip.vehicle.status = 'AVAILABLE'
            trip.vehicle.save()
        TripEvent.objects.create(trip=trip, event_type='TRIP_COMPLETED', metadata={'actor': str(request.user.id)})
        # Update linked jobs and orders
        for tj in trip.trip_jobs.select_related('job__order').all():
            tj.job.status = 'COMPLETED'
            tj.job.save()
            tj.job.order.status = 'DELIVERED'
            tj.job.order.save()
        return Response(TripSerializer(trip).data)

    @action(detail=True, methods=['post'])
    def milestones(self, request, pk=None):
        trip = self.get_object()
        request.data['trip'] = trip.id
        ser = TripMilestoneSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        milestone = ser.save()
        TripEvent.objects.create(
            trip=trip,
            event_type='MILESTONE_UPDATED',
            metadata={'milestone': milestone.milestone_name},
        )
        return Response(ser.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def pod(self, request, pk=None):
        trip = self.get_object()
        request.data['trip'] = trip.id
        ser = PodAttachmentSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        TripEvent.objects.create(trip=trip, event_type='POD_UPLOADED', metadata={})
        return Response(ser.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def reallocate(self, request, pk=None):
        trip = self.get_object()
        vehicle_id = request.data.get('vehicle_id')
        driver_id = request.data.get('driver_id')
        if vehicle_id:
            try:
                trip.vehicle = Vehicle.objects.get(id=vehicle_id)
            except Vehicle.DoesNotExist:
                return Response({'error': 'Vehicle not found.'}, status=400)
        if driver_id:
            try:
                trip.driver = Driver.objects.get(id=driver_id)
            except Driver.DoesNotExist:
                return Response({'error': 'Driver not found.'}, status=400)
        trip.save()
        TripEvent.objects.create(trip=trip, event_type='TRIP_REALLOCATED', metadata=request.data)
        return Response(TripSerializer(trip).data)


class PodAttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = PodAttachmentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['trip', 'verification_status']

    def get_queryset(self):
        return PodAttachment.objects.all()


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['trip', 'status', 'expense_type']

    def get_queryset(self):
        return Expense.objects.all()


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant', 'status']
    search_fields = ['invoice_number']

    def get_queryset(self):
        qs = Invoice.objects.select_related('trip', 'tenant').all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs

    @action(detail=False, methods=['post'])
    def generate(self, request):
        trip_id = request.data.get('trip_id')
        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            return Response({'error': 'Trip not found.'}, status=400)

        expense_total = sum(
            e.amount for e in trip.expenses.filter(status='PENDING')
        )
        base_cost = (trip.planned_distance_km or 0) * 10  # $10/km placeholder
        net_payable = base_cost + expense_total

        import uuid
        invoice = Invoice.objects.create(
            tenant=trip.tenant,
            trip=trip,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            base_freight_cost=base_cost,
            expense_total=expense_total,
            penalty_total=0,
            net_payable=net_payable,
            status='UNPAID',
        )
        TripEvent.objects.create(trip=trip, event_type='INVOICE_GENERATED', metadata={'invoice': invoice.invoice_number})
        return Response(InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        tenant = request.user.tenant
        today = timezone.now().date()

        def qs_filter(model):
            qs = model.objects.all()
            if tenant:
                qs = qs.filter(tenant=tenant)
            return qs

        data = {
            'total_orders': qs_filter(Order).count(),
            'active_trips': qs_filter(Trip).filter(status='IN_TRANSIT').count(),
            'pending_jobs': qs_filter(Job).filter(status='PENDING').count(),
            'available_vehicles': qs_filter(Vehicle).filter(status='AVAILABLE').count(),
            'delayed_trips': 0,  # Placeholder — would compare ETA vs current time
            'completed_today': qs_filter(Trip).filter(
                status='COMPLETED',
                created_at__date=today,
            ).count(),
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def live_trips(self, request):
        tenant = request.user.tenant
        qs = Trip.objects.select_related('vehicle', 'driver', 'transporter').filter(status='IN_TRANSIT')
        if tenant:
            qs = qs.filter(tenant=tenant)
        return Response(TripListSerializer(qs, many=True).data)


class ControlTowerViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        tenant = request.user.tenant
        qs = Trip.objects.select_related('vehicle', 'driver', 'transporter').exclude(status='COMPLETED')
        if tenant:
            qs = qs.filter(tenant=tenant)
        return Response(TripListSerializer(qs, many=True).data)


class RoleTemplateViewSet(viewsets.ModelViewSet):
    queryset = RoleTemplate.objects.all()
    serializer_class = RoleTemplateSerializer
    permission_classes = [IsAuthenticated]


class BusinessUnitViewSet(viewsets.ModelViewSet):
    serializer_class = BusinessUnitSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant']
    search_fields = ['name', 'code']

    def get_queryset(self):
        qs = BusinessUnit.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class BranchViewSet(viewsets.ModelViewSet):
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant', 'business_unit', 'branch_type']
    search_fields = ['name', 'code']

    def get_queryset(self):
        qs = Branch.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tenant']
    search_fields = ['name', 'code']

    def get_queryset(self):
        qs = Department.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class TenantModuleViewSet(viewsets.ModelViewSet):
    serializer_class = TenantModuleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tenant', 'module_key', 'is_enabled']

    def get_queryset(self):
        qs = TenantModule.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class TenantConfigurationViewSet(viewsets.ModelViewSet):
    serializer_class = TenantConfigurationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tenant', 'config_key']

    def get_queryset(self):
        qs = TenantConfiguration.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class CustomFieldDefinitionViewSet(viewsets.ModelViewSet):
    serializer_class = CustomFieldDefinitionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tenant', 'target_model']

    def get_queryset(self):
        qs = CustomFieldDefinition.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs


class CustomFieldValueViewSet(viewsets.ModelViewSet):
    serializer_class = CustomFieldValueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = CustomFieldValue.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(definition__tenant=self.request.user.tenant)
        return qs


class CustomWorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = CustomWorkflowSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tenant', 'target_model']

    def get_queryset(self):
        qs = CustomWorkflow.objects.all()
        if self.request.user.tenant_id:
            return qs.filter(tenant=self.request.user.tenant)
        return qs
