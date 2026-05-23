#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."

# รอจนกว่า postgres จะพร้อม
until npx typeorm-ts-node-commonjs migration:show -d dist/data-source.js > /dev/null 2>&1; do
  echo "⏳ Postgres not ready yet... retrying in 2s"
  sleep 2
done

echo "✅ PostgreSQL is ready!"
echo "🚀 Running migrations..."

npm run migration:run:prod

echo "✅ Migrations done!"
echo "🟢 Starting NestJS..."

exec node dist/main