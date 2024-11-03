// components/RegistroForm.js
"use client";

import { useState } from "react";
import styles from "./RegistroForm.module.css";

export default function RegistroForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    nombre: "",
    apellido: "",
    password: "",
    pregunta: "",
    respuesta: "",
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFotoPerfil(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const objetoDatos = {
      username: formData.username,
      email: formData.email,
      perfil: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        fotoPerfil: "",
      },
      password: formData.password,
      preguntaSeguridad: {
        pregunta: formData.pregunta,
        respuesta: formData.respuesta,
      },
    };

    const envioFormData = new FormData();
    envioFormData.append("credentials", JSON.stringify(objetoDatos));

    let url;
    if (fotoPerfil) {
      envioFormData.append("image", fotoPerfil);
      url = "http://localhost:8080/registrarseConImagen";
    } else {
      url = "http://localhost:8080/registrarse";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: envioFormData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registro exitoso:", data);
        alert("Registro exitoso");
      } else {
        console.log(response);
        alert("Error en el registro");
      }
    } catch (error) {
      console.log(error);
      alert("Error en la petición");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label>
        Nombre:
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label>
        Apellido:
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label>
        Pregunta de Seguridad:
        <input
          type="text"
          name="pregunta"
          value={formData.pregunta}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label>
        Respuesta de Seguridad:
        <input
          type="text"
          name="respuesta"
          value={formData.respuesta}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </label>

      <label>
        Foto de Perfil (solo .png):
        <input
          type="file"
          name="fotoPerfil"
          accept="image/png"
          onChange={handleImageChange}
          className={styles.input}
        />
      </label>

      <button type="submit" className={styles.button}>
        Registrar
      </button>
    </form>
  );
}
