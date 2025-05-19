import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateEventDto) {
    const created = new this.eventModel(dto);
    return created.save();
  }

  async update(id: string, dto: UpdateEventDto) {
    const updated = await this.eventModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }
    return updated;
  }

  async toggleActive(id: string) {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }
    event.isActive = !event.isActive;
    return event.save();
  }

  async findAll() {
    return this.eventModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }
    return event;
  }

  async validateEventExists(id: string) {
    const exists = await this.eventModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }
  }
}
