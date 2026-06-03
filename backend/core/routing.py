from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/operations/$', consumers.OperationsFeedConsumer.as_asgi()),
    re_path(r'ws/trips/(?P<trip_id>[^/]+)/$', consumers.TripTrackingConsumer.as_asgi()),
]
