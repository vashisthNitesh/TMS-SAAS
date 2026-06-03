import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tame_backend.settings')

app = Celery('tame')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
