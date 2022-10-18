#!/bin/bash

mongo <<EOF
var config = {
    "_id": "$MONGO_REPLICA_NAME",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "mongo:27017",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "mongo2:27017",
            "priority": 0
        },
    ]
};
rs.initiate(config, { force: true });
rs.status();
EOF

sleep 30

mongo <<EOF
   use admin;
   admin = db.getSiblingDB("admin");
   admin.createUser(
     {
	    user: '$MONGO_BACKEND_USER',
        pwd: '$MONGO_BACKEND_PASSWORD',
        roles: [ { role: "root", db: "admin" } ]
     });
  db.getSiblingDB("admin").auth('$MONGO_BACKEND_USER', '$MONGO_BACKEND_PASSWORD');
  rs.status();
EOF