import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const VerificationForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [code, setCode] = useState('')
  const router = useRouter()

  async function handleVerification(e: React.FormEvent){
    e.preventDefault()
    if (!isLoaded && !signUp) return null

    try {
      const signInAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/after-sign-up')
      } else {
        // If the status is not complete. User may need to complete further steps.
        alert('Verification not complete. Please check your code and try again.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='mt-20 flex items-center justify-center'>
      <form onSubmit={handleVerification}>
        <Card className='w-full sm:w-96'>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-y-4'>
            <div>
              <Label htmlFor='code'>Enter your verification code</Label>
              <Input 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                id='code'
                name='code'
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className='grid w-full gap-y-4'>
              <Button type='submit' disabled={!isLoaded}>
                Verify
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default VerificationForm