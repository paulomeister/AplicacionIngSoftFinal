"use client";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "app/app/context/AuthContext";

export default function FormPassword() {
  const { notificacionDeExito, notificacionDeError } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [showPwdField, setPwdField] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showFields) {
      const response = await fetch(
        `http://localhost:8080/preguntaSeguridad/${username}`
      );
      setPregunta(await response.text());
      setShowFields(true);
    } else if (!showPwdField) {
      setPwdField(true);
    } else {
      // Realiza la petición a la API con los datos del formulario
      const response = await fetch("http://localhost:8080/recuperarPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          respuesta,
          nuevoPassword,
        }),
      });

      const data = await response.text();

      // Verifica si la solicitud fue exitosa
      if (response.ok) {
        notificacionDeExito("¡Contraseña recuperada exitosamente!");

        setTimeout(() => (window.location.href = "/login"), 4000);
      } else {
        notificacionDeError(`Error: ${data.message}`);
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-5 justify-center flex-col "
    >
      <Input
        type="text"
        placeholder="Ingresa tu username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={showFields}
      />

      {showFields && (
        <>
          <p>{pregunta}</p>
          <Input
            type="text"
            placeholder="Ingresa la respuesta de seguridad"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            required
          />
        </>
      )}

      {showPwdField && (
        <Input
          type="password"
          placeholder="Ingresa tu nueva contraseña"
          value={nuevoPassword}
          onChange={(e) => setNuevoPassword(e.target.value)}
          required
        />
      )}

      <Button color="primary" type="submit" className="p-4 w-96">
        {showPwdField ? "Recuperar contraseña" : "Siguiente"}
      </Button>
    </form>
  );
}
