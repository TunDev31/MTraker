import { SignInForm } from '@/components/signin-form'
import React from 'react'

const SignInPage = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center  p-6 bg-(--bg-primary) md:p-10">
          <div className="w-full max-w-sm md:max-w-4xl">
            <SignInForm  />
          </div>
        </div>
  )
}

export default SignInPage