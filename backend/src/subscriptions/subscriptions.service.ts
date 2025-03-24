import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan, MoreThan } from "typeorm";
import { UserSubscription } from "./entities/user-subscription.entity";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(UserSubscription)
    private subscriptionsRepository: Repository<UserSubscription>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<UserSubscription> {
    const subscription = this.subscriptionsRepository.create(
      createSubscriptionDto,
    );
    return this.subscriptionsRepository.save(subscription);
  }

  async findAll(): Promise<UserSubscription[]> {
    return this.subscriptionsRepository.find();
  }

  async findOne(id: string): Promise<UserSubscription> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async findByUserId(userId: string): Promise<UserSubscription[]> {
    return this.subscriptionsRepository.find({ where: { userId } });
  }

  async findActiveByUserId(userId: string): Promise<UserSubscription[]> {
    const now = new Date();
    return this.subscriptionsRepository.find({
      where: {
        userId,
        isActive: true,
        endDate: MoreThan(now),
      },
      relations: ["module"],
    });
  }

  async findExpiringSoon(daysThreshold: number): Promise<UserSubscription[]> {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);

    return this.subscriptionsRepository.find({
      where: {
        isActive: true,
        endDate: LessThan(thresholdDate),
        endDate: MoreThan(now),
      },
      relations: ["user", "module"],
    });
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<UserSubscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateSubscriptionDto);
    return this.subscriptionsRepository.save(subscription);
  }

  async remove(id: string): Promise<void> {
    const result = await this.subscriptionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
  }

  async extendSubscription(
    id: string,
    days: number,
  ): Promise<UserSubscription> {
    const subscription = await this.findOne(id);
    const newEndDate = new Date(subscription.endDate);
    newEndDate.setDate(newEndDate.getDate() + days);

    subscription.endDate = newEndDate;
    return this.subscriptionsRepository.save(subscription);
  }

  async cancelSubscription(id: string): Promise<UserSubscription> {
    const subscription = await this.findOne(id);
    subscription.isActive = false;
    return this.subscriptionsRepository.save(subscription);
  }
}
