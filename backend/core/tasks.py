import uuid
from celery import shared_task


@shared_task(bind=True, max_retries=3)
def generate_jobs_for_order(self, order_id: str):
    from .models import Order, Job

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return

    if order.jobs.exists():
        return

    total_weight = sum(item.weight_kg for item in order.items.all())
    total_volume = sum(item.volume_cbm for item in order.items.all())

    Job.objects.create(
        tenant=order.tenant,
        order=order,
        job_number=f"JOB-{uuid.uuid4().hex[:8].upper()}",
        weight_kg=total_weight or 0,
        volume_cbm=total_volume or 0,
        status='PENDING',
    )

    order.status = 'SCHEDULED'
    order.save()


@shared_task(bind=True, max_retries=3)
def generate_invoice_for_trip(self, trip_id: str):
    import uuid
    from .models import Trip, Invoice, TripEvent

    try:
        trip = Trip.objects.get(id=trip_id)
    except Trip.DoesNotExist:
        return

    if trip.invoices.exists():
        return

    expense_total = sum(e.amount for e in trip.expenses.filter(status='PENDING'))
    base_cost = float(trip.planned_distance_km or 0) * 10
    net_payable = base_cost + float(expense_total)

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

    TripEvent.objects.create(
        trip=trip,
        event_type='INVOICE_GENERATED',
        metadata={'invoice_number': invoice.invoice_number},
    )
