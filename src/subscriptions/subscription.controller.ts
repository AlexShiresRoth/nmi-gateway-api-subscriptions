import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  @Get()
  findAll(): string {
    return this.subscriptionService.findAll();
  }
  @Get('key')
  retrieveKey(@Req() request: Request): string {
    return this.subscriptionService.retrieveSecureKey(request);
  }

  @Post('purchase')
  async receivePurchaseEvent(@Req() request: Request) {
    return this.subscriptionService.handlePurchaseOfSubscriptionItem(request);
  }
}
