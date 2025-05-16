
import { createSafeAction } from "@/lib/create-safe-action";
import {  ReturnType } from "./types";
import { stripeRedirect } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth, useUser } from '@clerk/clerk-react'
import  getAbsoluteUrl  from "@/lib/utils";
import { stripeClient } from "@/lib/stripe";

export const useStripeRedirect = () => {


  const { apiRequest } = useApiRequest();
  const { userId, orgId } = useAuth();
  const {user} =  useUser();
  // define handler inside a hook
  const handler = useMemo(() => {
    return async (): Promise<ReturnType> => {
      if (!userId || !orgId || !user) {
        return {
          error: "Unauthorized.",
        };
      }
      //console.log(data);
      const settingsUrl = getAbsoluteUrl(`/organization/${orgId}`);
      let url = "";
      try {
        const orgSubscription = await apiRequest(`/api/board/orgsubscription/${orgId}/`, null, "GET");

        console.log(orgSubscription);
        if (orgSubscription && orgSubscription.stripe_customer_id) {
          console.log('test2')
          const stripeSession = await stripeClient.billingPortal.sessions.create({
            customer: orgSubscription.stripe_customer_id,
            return_url: settingsUrl,
          });
          console.log(stripeSession);
          url = stripeSession.url;
        } else {
          console.log('test')
          const stripeSession = await stripeClient.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
              {
                price_data: {
                  currency: "USD",
                  product_data: {
                    name: "Taskflow Pro",
                    description: "Unlimited boards for your organization",
                  },
                  unit_amount: 10000,
                  recurring: {
                    interval: "month",
                  },
                },
                quantity: 1,
              },
            ],
            metadata: {
              orgId,
            },
          });
          url = stripeSession.url || "";
        }
        return { data: url };
      } catch (error) {
        return {
          error: "Something went wrong!.",
        };
      }
    };
  }, [apiRequest, userId, orgId]);


  return createSafeAction(stripeRedirect, handler);
};

