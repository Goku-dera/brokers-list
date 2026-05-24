// src/brokers/dto/update-broker.dto.ts
// PUT ส่งข้อมูลครบทุกฟิลด์ — ใช้กฎ validation เดียวกับ create

import { CreateBrokerDto } from './create-broker.dto';

export class UpdateBrokerDto extends CreateBrokerDto {}
