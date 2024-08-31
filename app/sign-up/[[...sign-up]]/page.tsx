'use client'

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import VerificationForm from './VerificationForm'
import SignUpForm from './SignUpForm'


const page = () => {
  const [verifying, setVerifying] = useState(false)
  const options = {
    appearance: {
      theme: 'stripe'
    }
  }

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

  if (verifying) {
    return <VerificationForm />
  }

  return (
    <div className='mt-20 flex items-center justify-center'>
      {/* @ts-ignore */}
      <Elements options={options} stripe={stripePromise}>
        <SignUpForm setVerifying={setVerifying} />
      </Elements>
    </div>
  )
}

export default page