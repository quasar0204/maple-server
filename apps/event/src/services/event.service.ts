import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async create(dto: CreateEventDto) {
    const created = new this.eventModel(dto);
    return created.save();
  }

  async findAll() {
    return this.eventModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    return this.eventModel.findById(id).exec();
  }
}