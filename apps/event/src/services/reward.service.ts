import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from '../schemas/reward.schema';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { UpdateRewardDto } from '../dto/update-reward.dto';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async create(dto: CreateRewardDto) {
    const created = new this.rewardModel(dto);
    return created.save();
  }

  async findByEvent(eventId: string) {
    return this.rewardModel.find({ eventId }).exec();
  }

  async update(eventId: string, rewardId: string, dto: UpdateRewardDto) {
    const reward = await this.rewardModel
      .findOneAndUpdate({ _id: rewardId, eventId }, { $set: dto }, { new: true })
      .exec();

    if (!reward) {
      throw new NotFoundException('해당 보상을 찾을 수 없거나 이벤트에 속하지 않습니다.');
    }

    return reward;
  }

  async delete(eventId: string, rewardId: string) {
    const result = await this.rewardModel
      .findOneAndDelete({ _id: rewardId, eventId })
      .exec();

    if (!result) {
      throw new NotFoundException('해당 보상을 찾을 수 없거나 이벤트에 속하지 않습니다.');
    }

    return { success: true };
  }
}
