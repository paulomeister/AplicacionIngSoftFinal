'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import {Button, ButtonGroup} from "@nextui-org/button";

export default function LoginPage() {
  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle login logic here
    console.log('Login submitted')
  }

  return (
    <div className="container flex flex-col md:flex-row w-full">
    
      {/* Login Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">Inicia sesión en tu cuenta</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" placeholder="Enter your email" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input id="password" type="password" placeholder="Enter your password" required />
              </div>
              <Button type="submit" color='primary' className="w-full">
                Log In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="text-primary hover:underline">
                Sign up
              </a>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Image Side */}
      <div className="flex-1 bg-muted hidden md:block">
        <div className="h-full w-full bg-cover bg-center" style={{backgroundImage: "url('/public/Hergo_icons_large.png')"}} aria-hidden="true" />
      </div>
    </div>
  )
}