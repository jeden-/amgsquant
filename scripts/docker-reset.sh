#!/bin/bash
echo "⚠️  WARNING: This will delete all data!"
read -p "Are you sure? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️  Removing containers and volumes..."
    docker-compose -f docker-compose.dev.yml down -v
    echo "✅ All data removed!"
fi
