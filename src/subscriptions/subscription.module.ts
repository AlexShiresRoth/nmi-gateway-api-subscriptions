import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionService],
})
export class SubscriptionsModule {}
