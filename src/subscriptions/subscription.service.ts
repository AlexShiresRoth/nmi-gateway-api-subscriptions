import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';
import { AUTH_CODE, SECURITY_KEY } from 'src/constants/keys.constants';

@Injectable()
export class SubscriptionService {
  findAll(): string {
    return 'this is a string!';
  }
  retrieveSecureKey(request: Request): string {
    if (request.body.auth_code !== AUTH_CODE) {
      throw new Error('No authorization');
    }
    return SECURITY_KEY;
  }

  async handlePurchaseOfSubscriptionItem(request: Request) {
    try {
      const { event_body } = request.body;

      const { merchant_defined_fields } = event_body;

      if (!merchant_defined_fields)
        return 'Not a subscription/Or missing identity';

      const newArr: string[] = Object.values(merchant_defined_fields);

      //helper function to check if subscription exists
      const fuzzyMatchAString = (str: string): boolean => {
        const reg = new RegExp(/coinclub|sub/, 'gi');
        const param = str.split(' ').join('').toLowerCase();
        return param.match(reg) ? true : false;
      };

      //check provided merchant defined fields for sub  marking
      const subscriptionExists = newArr
        .map((field_value: string) =>
          fuzzyMatchAString(field_value) ? field_value : null,
        )
        .filter(Boolean);

      if (subscriptionExists.length === 0) {
        console.log('purchase does not contain a subscription');
        return 'Purchase does not contain subscription';
      }

      //retrieve key needed for api
      request.body.auth_code = AUTH_CODE;
      const security_key = this.retrieveSecureKey(request);
      console.log('security key', security_key);
      const formattedData = {
        recurring: 'add_subscription',
        plan_id: 'PGCoinCLB29',
        orderid: event_body.order_id,
        source_transaction_id: event_body.transaction_id,
      };

      const api_url = `https://seamlesschex.transactiongateway.com/api/transact.php?security_key=${security_key}&recurring=${formattedData.recurring}&plan_id=${formattedData.plan_id}&orderid=${formattedData.orderid}&source_transaction_id=${formattedData.source_transaction_id}`;

      const req = await axios({
        url: api_url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log(req.data);
      console.log('sub in details', newArr);

      return req.data;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
