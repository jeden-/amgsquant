#!/bin/bash
echo "🚀 Starting AMGSquant Print System infrastructure..."
docker-compose -f docker-compose.dev.yml up -d
echo "⏳ Waiting for services to be ready..."
sleep 10
echo "✅ Infrastructure is ready!"
echo ""
echo "📊 Access points:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - RabbitMQ Management: http://localhost:15672 (printuser/printpass)"
echo "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin123)"
echo "  - Adminer: http://localhost:8080"
