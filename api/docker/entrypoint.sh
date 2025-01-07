#!/bin/bash

# Start Flask server via Gunicorn
if [[ "${DEBUG}" == "true" ]]; then
    echo "Starting Flask server in debug mode"
    exec flask run --host=0.0.0.0 --port=${PORT:-5001} --debug
else
    echo "Starting Flask server in production mode"
    exec gunicorn \
        --bind 0.0.0.0:${PORT:-5001} \
        --workers ${WORKERS:-4} \
        --worker-class ${WORKER_CLASS:-gevent} \
        --worker-connections ${SERVER_WORKER_CONNECTIONS:-60} \
        --timeout ${TIMEOUT:-100} \
        app:app
fi