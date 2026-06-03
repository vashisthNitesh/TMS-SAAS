import json
from channels.generic.websocket import AsyncWebsocketConsumer


class OperationsFeedConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'operations_feed'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass

    async def operations_event(self, event):
        await self.send(text_data=json.dumps(event['data']))


class TripTrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        trip_id = self.scope['url_route']['kwargs']['trip_id']
        self.group_name = f'trip_{trip_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.group_name,
            {'type': 'trip_update', 'data': data},
        )

    async def trip_update(self, event):
        await self.send(text_data=json.dumps(event['data']))
