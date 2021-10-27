set -e

mongo <<EOF
use $MONGO_INITDB_DATABASE

db.createUser({
  user: '$MONGO_BACKEND_USER',
  pwd: '$MONGO_BACKEND_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$MONGO_INITDB_DATABASE'
  }]
})
EOF