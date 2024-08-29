'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null)

  const handleAction = async (action: 'login' | 'signup', formData: FormData) => {
    setMessage(null)
    try {
      if (action === 'login') {
        await login(formData)
      } else {
        await signup(formData)
        setMessage('Check your email for a confirmation link.')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login or Sign Up</CardTitle>
          <CardDescription>Enter your email and password to continue</CardDescription>
        </CardHeader>
        <form>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-between w-full">
              <Button onClick={(e) => {
                e.preventDefault()
                handleAction('login', new FormData(e.currentTarget.form!))
              }}>Log in</Button>
              <Button onClick={(e) => {
                e.preventDefault()
                handleAction('signup', new FormData(e.currentTarget.form!))
              }} variant="outline">Sign up</Button>
            </div>
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}