"use client";

import Landing from "./components/landing";
import RegisterForm from "./components/registerForm";

export default function RegistrationPage() {
  return (
    <main className="min-h-screen w-full flex">
      {/* Sección Izquierda - Landing */}
      <Landing />

      {/* Sección Derecha - Formulario */}
      <RegisterForm />
    </main>
  );
}
