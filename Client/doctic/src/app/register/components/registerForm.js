"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { FaUserAlt, FaLock, FaEnvelope, FaCamera } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash  } from "react-icons/fa";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { Card, CardBody } from "@nextui-org/card";
import { Tooltip } from "@nextui-org/tooltip";
import { Progress } from "@nextui-org/progress";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSecondStep, setIsSecondStep] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const securityQuestions = [
    "¿Cuál fue tu primera mascota?",
    "¿Cuál es el nombre de tu mejor amigo de la infancia?",
    "¿Cuál es el nombre de tu escuela primaria?",
    "¿Cuál es tu ciudad natal?",
    "¿Cuál es tu libro favorito?",
    "¿Cuál es tu película favorita?",
    "¿Cuál es el nombre de tu madre?",
    "¿Cómo se llamaba tu primer maestro?"
  ];

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (!emailValue) {
      setEmailError("El correo electrónico es requerido");
    } else if (!validateEmail(emailValue)) {
      setEmailError("Por favor ingresa un correo electrónico válido");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    if (!passwordValue) {
      setPasswordError("La contraseña es requerida");
    } else if (passwordValue.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
    } else if (!/\d/.test(passwordValue)) {
      setPasswordError("La contraseña debe incluir al menos un número");
    } else if (!/[A-Z]/.test(passwordValue)) {
      setPasswordError("La contraseña debe incluir al menos una mayúscula");
    } else {
      setPasswordError("");
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !firstName || !lastName) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }
    if (emailError || passwordError) {
      toast.error("Por favor corrige los errores antes de continuar");
      return;
    }
    setIsSecondStep(true);
    toast.success("¡Primer paso completado!");
  };

  const getProgressValue = () => {
    let progress = 0;
    const fields = [username, email, password, firstName, lastName];
    const fieldsCompleted = fields.filter(field => field).length;
    progress = (fieldsCompleted / fields.length) * 100;
    return progress;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!securityQuestion || !securityAnswer) {
      toast.error("Por favor completa la pregunta y respuesta de seguridad");
      return;
    }

    const registrationData = {
      username,
      email,
      perfil: {
        nombre: firstName,
        apellido: lastName,
        fotoPerfil: "",
      },
      password,
      preguntaSeguridad: { pregunta: securityQuestion, respuesta: securityAnswer },
    };

    try {
      const formData = new FormData();
      formData.append('credentials', JSON.stringify(registrationData));

      let response;

      if (profileImage) {
        // Caso con imagen
        formData.append('image', profileImage);
        response = await axios.post(
          "http://localhost:8080/registrarseConImagen",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
      } else {
        // Caso sin imagen
        response = await axios.post(
          "http://localhost:8080/registrarse",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      toast.success("¡Registro completado con éxito!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data || "Error al registrar");
      } else {
        toast.error("Error de conexión. Por favor intenta más tarde");
      }
      console.error("Error al enviar la solicitud:", error);
    }



  }

  return (
    <section className="w-1/2 min-h-screen ml-auto">
      <ToastContainer position="top-right" theme="colored" />
      <div className="flex flex-col justify-center items-center h-full px-8 py-12">
        <Card className="w-full max-w-md">
          <CardBody className="gap-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Crear una cuenta</h2>
              <p className="text-default-500 mb-4">
                {isSecondStep ? "Configura tu seguridad" : "Información personal"}
              </p>
              <Progress
                value={getProgressValue()}
                className="mb-4"
                color="primary"
                size="sm"
              />
            </div>
            

            {!isSecondStep ? (
              
              <form onSubmit={handleNextStep} className="space-y-6">
                {/* Username */}
                <Tooltip content="Elige un nombre de usuario único" placement="left">
                  <Input
                    
                    placeholder="Nombre de Usuario"
                    label="Nombre de Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    startContent={<FaUserAlt className="text-default-400 pointer-events-none flex-shrink-0" />}
                    size="lg"
                    variant="bordered"
                    isRequired
                  />
                </Tooltip>
                
                {/* Correo */}
                <Tooltip content="Escribe una dirección de correo electronico valida" placement="left">
                  
                  <Input
                  
                    placeholder="Correo Electrónico"
                    label="Correo Electrónico"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    startContent={<FaEnvelope className="text-default-400 pointer-events-none flex-shrink-0" />}
                    size="lg"
                    variant="bordered"
                    errorMessage={emailError}
                    isInvalid={!!emailError}
                    isRequired
                  />
                </Tooltip>
                {/* Nombre */}
                <div className="flex gap-4">
                  <Input
                    placeholder="Nombre"
                    label="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    startContent={<FaUserAlt className="text-default-400 pointer-events-none flex-shrink-0" />}
                    size="lg"
                    variant="bordered"
                    isRequired
                  />
                  {/* Apellido */}
                  <Input
                    placeholder="Apellido"
                    label="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    startContent={<FaUserAlt className="text-default-400 pointer-events-none flex-shrink-0" />}
                    size="lg"
                    variant="bordered"
                    isRequired
                  />
                </div>
                {/* Contraseña */}
                <Tooltip content="Mínimo 8 caracteres, una mayúscula y un número" placement="left">
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder="Contraseña"
                    label="Contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    startContent={<FaLock className="text-default-400 pointer-events-none flex-shrink-0" />}
                    endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                    {isVisible ? (
                      <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>}
                    size="lg"
                    variant="bordered"
                    errorMessage={passwordError}
                    isInvalid={!!passwordError}
                    isRequired
                  />
                </Tooltip>

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                >
                  Siguiente
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pregunta Seguridad */}
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      className="w-full justify-start h-14"
                      startContent={<FaLock className="text-default-400" />}
                    >
                      {securityQuestion || "Selecciona una pregunta de seguridad"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Preguntas de seguridad"
                    onAction={(key) => setSecurityQuestion(key)}
                  >
                    {securityQuestions.map((question) => (
                      <DropdownItem key={question}>
                        {question}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Input
                  placeholder="Respuesta de seguridad"
                  label="Respuesta"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  size="lg"
                  variant="bordered"
                  isRequired
                />
                {/* Foto Perfil */}
                <div className="space-y-2">
                  <label className="block text-lg font-semibold">Foto de Perfil</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5242880) { // 5MB
                            toast.error("La imagen no debe superar los 5MB");
                            return;
                          }
                          setProfileImage(file);
                          toast.info("Imagen seleccionada: " + file.name);
                        }
                      }}
                      className="hidden"
                      id="profile-image"
                    />
                    <Button
                      as="label"
                      htmlFor="profile-image"
                      className="cursor-pointer"
                      startContent={<FaCamera />}
                      variant="bordered"
                    >
                      Seleccionar Imagen
                    </Button>
                    {profileImage && (
                      <span className="text-sm text-default-600 truncate max-w-[200px]">
                        {profileImage.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsSecondStep(false)}
                    variant="bordered"
                    size="lg"
                    className="w-full"
                  >
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    className="w-full"
                  >
                    Registrarse
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>

        <Divider className="my-8" />

        <p className="text-center text-default-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </section>
  );
}
