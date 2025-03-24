import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@Controller("subscriptions")
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get("user")
  findByUser(@Req() req: Request) {
    const userId = req.user["sub"];
    return this.subscriptionsService.findByUserId(userId);
  }

  @Get("user/active")
  findActiveByUser(@Req() req: Request) {
    const userId = req.user["sub"];
    return this.subscriptionsService.findActiveByUserId(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.subscriptionsService.remove(id);
  }

  @Post(":id/extend")
  extendSubscription(@Param("id") id: string, @Body("days") days: number) {
    return this.subscriptionsService.extendSubscription(id, days);
  }

  @Post(":id/cancel")
  cancelSubscription(@Param("id") id: string) {
    return this.subscriptionsService.cancelSubscription(id);
  }
}
