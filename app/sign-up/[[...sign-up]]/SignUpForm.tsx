'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useSignUp } from '@clerk/nextjs'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
  setVerifying: (val: boolean) => void
}

const SignUpForm = ({ setVerifying }: Props) => {
  const { isLoaded, signUp } = useSignUp()
  const stripe = useStripe()
  const elements = useElements()
  const [priceId, setPriceId] = useState('')
  const [email, setEmail] = useState('')

  async function onSubmit() {
    if (!isLoaded && !signUp) return null

    try {
      if (!elements || !stripe) {
        return
      }

      let cardToken = ''
      const cardEl = elements?.getElement('card')
      if (cardEl) {
        const res = await stripe?.createToken(cardEl)
        cardToken = res?.token?.id || ''
      }

      await signUp.create({
        emailAddress: email,
        unsafeMetadata: {
          cardToken,
          priceId,
        }
      })

      await signUp.prepareEmailAddressVerification()

      setVerifying(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle>Create your account!</CardTitle>
          <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-y-4'>
          <div>
            <Label htmlFor='emailAddress'>
              Email address
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              id='emailAddress'
              name='emailAddress'
              required
            />
          </div>
          <div>
            <Label>Select tier</Label>
            <RadioGroup
              defaultValue='option-one'
              className='mt-2'
              value={priceId}
              onValueChange={(e) => setPriceId(e)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_1PtnowHt8UXMeRVTBaGdhk6w" id="option-one" />
                <Label htmlFor="option-one">Pro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_1PtnpSHt8UXMeRVTcY3NDTDP" id="option-two" />
                <Label htmlFor="option-two">Enterprise</Label>
              </div>
            </RadioGroup>
          </div>
          <Label>Payment details</Label>
          <div className='rounded border p-2'>
            <CardElement />
          </div>
        </CardContent>
        <CardFooter>
          <div className='grid w-full gap-y-4'>
            <Button type='submit' disabled={!isLoaded}>
              Sign up for trial
            </Button>
            <Button variant='link' size='sm' asChild>
              <Link href='/sign-in'>
                Already have an account? Sign in
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

export default SignUpForm