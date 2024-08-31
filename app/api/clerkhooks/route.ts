import { createWebhooksHandler } from '@brianmmdev/clerk-webhooks-handler'
import { clerkClient } from '@clerk/nextjs/server'
import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const handler = createWebhooksHandler({
  onUserCreated: async (user) => {
    try {
      const { cardToken, priceId } = user.unsafe_metadata
      if (!cardToken || !priceId) {
        return
      }

      const pm = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: cardToken as string,
        },
      })

      const customer = await stripe.customers.create({
        email: user?.email_addresses[0].email_address,
        payment_method: pm.id
      })

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        default_payment_method: pm.id,
        trial_period_days: 7,
        items: [
          {
            price: priceId as string,
          }
        ]
      })

      await clerkClient.users.updateUser(user.id, {
        publicMetadata: {
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
        }
      })
    } catch (error) {
      console.error('Error handling user creation:', error)
    }
  },
})

export const POST = handler.POST