'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { RegisterRequest } from '@/types'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { ModernCard, CardContent, CardHeader, CardTitle } from '@/components/ui/ModernCard'

export function RegisterForm() {
  const { register: registerUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>()

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    try {
      setLoading(true)
      setError(null)
      const { confirmPassword: _, ...registerData } = data
      await registerUser(registerData)
      setSuccess(true)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <ModernCard className="w-full max-w-md mx-auto" glow gradient>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-400">Registration Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-300 mb-4">
            Your account has been created successfully. You can now sign in.
          </p>
          <a href="/login" className="w-full cursor-pointer">
            <ModernButton className="w-full" glow gradient>Go to Sign In</ModernButton>
          </a>
        </CardContent>
      </ModernCard>
    )
  }

  return (
    <ModernCard className="w-full max-w-md mx-auto" glow gradient>
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ModernInput
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={errors.firstName?.message}
              placeholder="John"
              glow
            />

            <ModernInput
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              error={errors.lastName?.message}
              placeholder="Doe"
              glow
            />
          </div>

          <ModernInput
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
            placeholder="john.doe@example.com"
            glow
          />

          <ModernInput
            label="Username"
            {...register('username', { required: 'Username is required' })}
            error={errors.username?.message}
            placeholder="johndoe"
            glow
          />

          <ModernInput
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={errors.password?.message}
            placeholder="Enter your password"
            glow
          />

          <ModernInput
            label="Confirm Password"
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
            })}
            error={errors.confirmPassword?.message}
            placeholder="Confirm your password"
            glow
          />

          <ModernButton
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
            glow
            gradient
          >
            Create Account
          </ModernButton>
        </form>

        <p className="mt-4 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
            Sign in
          </a>
        </p>
      </CardContent>
    </ModernCard>
  )
}
