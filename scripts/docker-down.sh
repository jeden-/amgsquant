#!/bin/bash
echo "🛑 Stopping AMGSquant Print System infrastructure..."
docker-compose -f docker-compose.dev.yml down
echo "✅ Infrastructure stopped!"
