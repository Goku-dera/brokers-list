// src/brokers/brokers.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { QueryBrokersDto } from './dto/query-brokers.dto';
import { JwtAuthGuard } from '../auth/jwt.guard'; // ✅ Protected Route

@Controller('api/brokers')
export class BrokersController {
  constructor(private readonly brokersService: BrokersService) {}

  // ✅ Public — ใครก็ดูได้
  // GET /api/brokers
  @Get()
  async findAll(@Query() query: QueryBrokersDto) {
    const brokers = await this.brokersService.findAll(query);
    return {
      statusCode: 200,
      message: 'Brokers fetched successfully',
      data: brokers,
    };
  }

  // ✅ Public — ใครก็ดูได้
  // GET /api/brokers/:slug
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const broker = await this.brokersService.findBySlug(slug);
    return {
      statusCode: 200,
      message: 'Broker fetched successfully',
      data: broker,
    };
  }

  // 🔐 Protected — ต้อง Login
  // POST /api/brokers
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBrokerDto: CreateBrokerDto) {
    const broker = await this.brokersService.create(createBrokerDto);
    return {
      statusCode: 201,
      message: 'Broker created successfully',
      data: broker,
    };
  }

  // 🔐 Protected — ต้อง Login
  // PUT /api/brokers/:slug
  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('slug') slug: string,
    @Body() updateBrokerDto: UpdateBrokerDto,
  ) {
    const broker = await this.brokersService.update(slug, updateBrokerDto);
    return {
      statusCode: 200,
      message: 'Broker updated successfully',
      data: broker,
    };
  }

  // 🔐 Protected — ต้อง Login
  // DELETE /api/brokers/:slug
  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('slug') slug: string) {
    await this.brokersService.remove(slug);
    return {
      statusCode: 200,
      message: 'Broker deleted successfully',
    };
  }
}