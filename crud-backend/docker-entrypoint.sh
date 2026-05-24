#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."

# ใช้คำสั่ง pg_isready แทนการรัน typeorm เพื่อเช็คฐานข้อมูล (เร็วกว่าและแม่นยำกว่า)
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
  echo "⏳ Postgres is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"
echo "🚀 Running migrations..."


npm run migration:run:prod

echo "✅ Migrations done!"
echo "🟢 Starting NestJS..."

exec node dist/main.js