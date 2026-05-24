// src/brokers/brokers.service.ts

import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Broker } from './entities/broker.entity';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { QueryBrokersDto } from './dto/query-brokers.dto';
import { RedisService } from '../redis/redis.service';

const BROKERS_CACHE_PREFIX = 'brokers:list:';

@Injectable()
export class BrokersService {
  private readonly logger = new Logger(BrokersService.name);

  constructor(
    @InjectRepository(Broker)
    private brokersRepository: Repository<Broker>,
    private readonly redisService: RedisService,
  ) {}

  // --------------------------------
  // GET /api/brokers — cache → DB fallback
  // --------------------------------
  async findAll(query: QueryBrokersDto = {}): Promise<Broker[]> {
    const cacheKey = this.buildCacheKey(query);

    const cached = await this.redisService.getJson<Broker[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit: ${cacheKey}`);
      return cached;
    }

    const brokers = await this.findAllFromDb(query);
    await this.redisService.setJson(cacheKey, brokers);

    return brokers;
  }

  // --------------------------------
  // GET /api/brokers/:slug — ไม่ใช้ cache
  // --------------------------------
  async findBySlug(slug: string): Promise<Broker> {
    const broker = await this.brokersRepository.findOne({
      where: { slug },
    });

    if (!broker) {
      throw new NotFoundException(`Broker "${slug}" not found`);
    }

    return broker;
  }

  // --------------------------------
  // POST /api/brokers
  // --------------------------------
  async create(createBrokerDto: CreateBrokerDto): Promise<Broker> {
    const existing = await this.brokersRepository.findOne({
      where: { slug: createBrokerDto.slug },
    });

    if (existing) {
      throw new ConflictException('Slug already exists');
    }

    const broker = this.brokersRepository.create(createBrokerDto);
    const saved = await this.brokersRepository.save(broker);
    await this.refreshBrokersCache();
    return saved;
  }

  // --------------------------------
  // PUT /api/brokers/:slug
  // --------------------------------
  async update(slug: string, updateBrokerDto: UpdateBrokerDto): Promise<Broker> {
    const broker = await this.findBySlug(slug);

    if (updateBrokerDto.slug !== broker.slug) {
      const slugTaken = await this.brokersRepository.findOne({
        where: { slug: updateBrokerDto.slug },
      });

      if (slugTaken) {
        throw new ConflictException('Slug already exists');
      }
    }

    Object.assign(broker, updateBrokerDto);
    const saved = await this.brokersRepository.save(broker);
    await this.refreshBrokersCache();
    return saved;
  }

  // --------------------------------
  // DELETE /api/brokers/:slug
  // --------------------------------
  async remove(slug: string): Promise<void> {
    const broker = await this.findBySlug(slug);
    await this.brokersRepository.remove(broker);
    await this.refreshBrokersCache();
  }

  private buildCacheKey(query: QueryBrokersDto): string {
    const search = query.search?.trim() ?? '';
    const type = query.type ?? '';
    return `${BROKERS_CACHE_PREFIX}search:${search}:type:${type}`;
  }

  private async findAllFromDb(query: QueryBrokersDto): Promise<Broker[]> {
    const qb = this.brokersRepository.createQueryBuilder('broker');

    if (query.type) {
      qb.andWhere('broker.broker_type = :type', { type: query.type });
    }

    const search = query.search?.trim();
    if (search) {
      qb.andWhere(
        '(broker.name ILIKE :term OR broker.description ILIKE :term OR broker.slug ILIKE :term)',
        { term: `%${search}%` },
      );
    }

    qb.orderBy('broker.created_at', 'DESC');

    return qb.getMany();
  }

  /** ลบ cache ทั้งหมดของรายการ brokers แล้ว warm cache รายการหลัก (ไม่มี filter) */
  private async refreshBrokersCache(): Promise<void> {
    await this.redisService.deleteByPattern(`${BROKERS_CACHE_PREFIX}*`);

    if (!this.redisService.isAvailable()) return;

    const allBrokers = await this.findAllFromDb({});
    const defaultKey = this.buildCacheKey({});
    await this.redisService.setJson(defaultKey, allBrokers);
    this.logger.debug(`Cache refreshed: ${defaultKey}`);
  }
}
