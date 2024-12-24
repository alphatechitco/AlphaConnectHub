from faker import Faker
import random
import uuid

fake = Faker()

# Generate 10 mock devices
for _ in range(2):
    print({
        "device_id": str(uuid.uuid4()),
        "device_name": fake.word().capitalize() + " Device",
        "serial_number": fake.unique.bothify(text="SN-#####"),
        "mac_address": fake.mac_address(),
        "ip_address": fake.ipv4_private(),
        "latitude": random.uniform(-90, 90),
        "longitude": random.uniform(-180, 180),
        "status": random.choice(["active", "inactive", "disconnected", "maintenance"]),
        "last_active": fake.date_time_this_year(),
        "device_type": random.choice(["sensor", "actuator", "gateway"]),
        "created_at": fake.date_time_this_year(),
    })
