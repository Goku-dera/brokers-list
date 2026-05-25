// src/redis/redis.service.ts

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private enabled = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit().catch(() => undefined);
    }
  }

  isAvailable(): boolean {
    return this.enabled;
  }

  private async connect(): Promise<void> {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    try {
      const client = new Redis({
        host,
        port,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
      });

      await client.ping();

      this.client = client;
      this.enabled = true;
      this.logger.log(`Redis connected (${host}:${port})`);
    } catch (error) {
      this.enabled = false;
      this.client = null;
      this.logger.warn(
        `Redis unavailable — using database only (${host}:${port})`,
      );
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.client) return null;

    try {
      const raw = await this.client.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      this.handleRedisError('get');
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!this.enabled || !this.client) return;

    try {
      const payload = JSON.stringify(value);
      const ttl =
        ttlSeconds ??
        this.configService.get<number>('REDIS_TTL_SECONDS', 3600);

      await this.client.set(key, payload, 'EX', ttl);
    } catch {
      this.handleRedisError('set');
    }
  }

  async deleteByPattern(pattern: string): Promise<void> {
    if (!this.enabled || !this.client) return;

    try {
      let cursor = '0';

      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch {
      this.handleRedisError('delete');
    }
  }

  private handleRedisError(op: string): void {
    this.logger.warn(`Redis ${op} failed — fallback to database`);
    this.enabled = false;
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
}
