import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { AuthContext } from "app/app/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";

export function ChangeSecurityQuestion ({username}) {
  const { clientKey, notificacionDeExito, notificacionDeError, cerrarSesion } = useContext(AuthContext);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [error, setError] = useState({pregunta: false, respuesta: false});

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


  function handleChange(e) {
    const value = e.target.value;
    setNewAnswer(value);
    console.log(newQuestion, newAnswer);
  }

  useEffect(()=> {
    if(!newQuestion) {
      setError((error) => ({ ...error, pregunta: true }));
    } else {
      setError((error) => ({ ...error, pregunta: false }));
    }
    if(!newAnswer) {
      setError((error) => ({ ...error, respuesta: true }));
    } else {
      setError((error) => ({ ...error, respuesta: false }));
    }
  }, [newAnswer, newQuestion])

  async function handleSubmit(e) {
    e.preventDefault();
    // Validar pregunta y respuesta al enviar
    if (!newQuestion) {
      setError((error) => ({ ...error, pregunta: true }));
      notificacionDeError("Seleccione una pregunta de seguridad")
    } else {
      setError((error) => ({ ...error, pregunta: false }));
    }

    if (!newAnswer) {
      setError((error) => ({ ...error, respuesta: true }));
    } else {
      setError((error) => ({ ...error, respuesta: false }));
    }

    // Si hay errores, no proceder con el submit
    if (!newQuestion || !newAnswer) return;
    try {
      const response = await fetch(
        `http://localhost:8080/preguntaSeguridad/change/${username}`,
        {
          method: "PUT",
          headers: {
            "Authorization": clientKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pregunta: newQuestion,
            respuesta: newAnswer
          })
        }
      );

      if (!response.ok) {
        throw new Error("Error al cambiar la pregunta y respuesta de seguridad");
      }

      const data = await response.json();
      notificacionDeExito(
        "Pregunta y respuesta de seguridad actualizadas"
      );
      setNewAnswer("");
      setNewQuestion("");
      setTimeout(() => {
        window.location.href = `/users/${username}`;
      }, 5000);
    } catch (exc) {
      notificacionDeError("Se ha presentado un error al momento de cambiar la pregunta y respuesta de seguridad");
    }
  }

  return (
    <div className="card shadow p-4" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Cambiar Pregunta de Seguridad</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="newQuestion" className="form-label">
            Nueva pregunta de seguridad
          </label>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-full justify-start h-14"
                startContent={<FaLock className="text-default-400" />}
              >
                {newQuestion || "Selecciona una pregunta de seguridad"}
              </Button>
              </DropdownTrigger>
                <DropdownMenu
                  aria-label="Preguntas de seguridad"
                  onAction={(key) => setNewQuestion(key)}
                >
                  {securityQuestions.map((question) => (
                    <DropdownItem key={question}>
                      {question}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              
          <label htmlFor="newAnswer" className="form-label">
            Nueva respuesta de seguridad
          </label>
          <input
            type="text"
            id="newAnswer"
            className={`form-control ${
              error.respuesta ? "is-invalid" : "is-valid"
            }`}
            placeholder="Ingrese su nueva respuesta de seguridad"
            onChange={handleChange}
            value={newAnswer}
            required
          />
          {error.respuesta && (
            <div className="invalid-feedback">
              El campo de respuesta no puede estar vacio.
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Cambiar pregunta y respuesta de seguridad
        </button>
      </form>
    </div>
  );
}

