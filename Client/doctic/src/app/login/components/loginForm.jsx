'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(username, password);

    var payload = {
      username: username,
      password: password
  };

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      // Handle login logic here
      console.log('Login submitted: ', result);
      
    } catch(err) {
      console.log('Login failed: ', err);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">Inicia sesión en tu cuenta</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email">Username</label>
                <Input id="email" type="text"  value={username} placeholder="Ingresa tu username"  onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Contraseña</label>
                <Input id="password" type="password"  value={password} placeholder="Ingresa tu contraseña" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" color='primary' className="w-full">
                Iniciar Sesión
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <a href="#" className="text-primary hover:underline">
                Crear cuenta
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
  )
}