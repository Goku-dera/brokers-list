FROM node:20-alpine

# ติดตั้ง client สำหรับเช็คสถานะ DB
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ตรวจสอบว่า docker-entrypoint.sh มีสิทธิ์ execute
RUN chmod +x docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]