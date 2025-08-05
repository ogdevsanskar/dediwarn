// MongoDB initialization script
db = db.getSiblingDB('disaster_management');

// Create collections
db.createCollection('disasters');
db.createCollection('alerts');
db.createCollection('users');
db.createCollection('emergency_contacts');

// Create indexes
db.disasters.createIndex({ "location": "2dsphere" });
db.disasters.createIndex({ "timestamp": -1 });
db.disasters.createIndex({ "severity": 1 });

db.alerts.createIndex({ "timestamp": -1 });
db.alerts.createIndex({ "type": 1 });

// Insert initial data
db.disasters.insertMany([
  {
    type: 'earthquake',
    severity: 'medium',
    location: {
      type: 'Point',
      coordinates: [77.2190, 28.6239]
    },
    title: 'Magnitude 4.2 Earthquake',
    description: 'Moderate earthquake detected in NCR region',
    timestamp: new Date(),
    active: true
  },
  {
    type: 'flood',
    severity: 'high',
    location: {
      type: 'Point',
      coordinates: [77.1990, 28.6039]
    },
    title: 'Flash Flood Warning',
    description: 'Heavy rainfall causing waterlogging',
    timestamp: new Date(),
    active: true
  }
]);

db.emergency_contacts.insertMany([
  {
    name: 'National Emergency Response',
    phone: '112',
    type: 'emergency',
    location: 'National'
  },
  {
    name: 'Disaster Management Authority',
    phone: '1070',
    type: 'disaster',
    location: 'Delhi'
  }
]);

print('MongoDB initialized with disaster management data');