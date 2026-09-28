import { SignupForm } from '@/components/signup-form'
import React from 'react'

const SignUpPage = () => {
  return (
   <div className="flex min-h-dvh flex-col items-center justify-center  p-6 bg-(--bg-primary) md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm  />
      </div>
    </div>
  )
}

export default SignUpPage