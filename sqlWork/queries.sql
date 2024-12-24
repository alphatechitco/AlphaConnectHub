CREATE TABLE devices (
  device_id uuid primary key,
  device_name varchar not null,
  serial_number varchar unique not null,
  mac_address varchar unique not null,
  ip_address varchar unique,
  latitude double precision,
  longitude double precision,
  status varchar not null (check status in ('active', 'inactive', 'disconnected', 'maintenance')),
  last_active timestamp not null,
  device_type VARCHAR not null (check device_type in ('sensor', 'actuator', 'gateway')),
  created_at timestamp default current_timestamp
);

CREATE TABLE device_ip_history (
  id serial primary key,
  device_id uuid references devices(device_id),
  old_ip_address varchar not null,
  new_ip_address varchar not null,
  changed_at timestamp default current_timestamp
);
d