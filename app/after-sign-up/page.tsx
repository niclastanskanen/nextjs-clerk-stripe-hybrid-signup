'use client'

import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const AfterSignUp = () => {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    async function init() {
      while (!user?.publicMetadata?.stripeSubscriptionId) {
        await sleep(2000)
        await user?.reload()
      }

      router.push('/dashboard')
    }
    init()
  }, [])

  return (
    <div className='mt-20 flex items-center justify-center'>
      <Loader2 className='animate-spin h-8 w-8' />
    </div>
  )
}

export default AfterSignUp