import { useContext } from "react";
import { AuthContext } from "app/app/context/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";
import { FaEdit, FaEye, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";

export function DocumentListItem({ doc, handleEdit, handleDelete }) {
  const [show, setShow] = useState(false);
  const { user } = useContext(AuthContext); // Obtiene el usuario logueado

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  // Verifica si el usuario actual es uno de los autores
  const isAuthor = doc.autores.some((autor) => autor.usuarioId === user?._id);

  // Filtra la visibilidad: solo muestra privados si el usuario es el autor
  if (doc.visibilidad === "privado" && !isAuthor) {
    return null;
  }

  return (
    <li key={doc._id} className="p-6 bg-white rounded shadow-md border">
      <Link href={`/document/${doc._id}`} className="hover:underline hover:text-blue-600 no-underline">
        <h2 className="text-2xl font-semibold mb-2">{doc.titulo}</h2>
      </Link>
      <p className="text-lg text-gray-700 mb-1">
        <span className="font-semibold">Autores:</span>{" "}
        {doc.autores.map((autor, index) => (
          <span key={autor.username}>
            <Link href={`/users/${autor.username}`} className="hover:underline hover:text-blue-600 no-underline">
              {autor.nombre}
            </Link>
            {index < doc.autores.length - 1 && ", "}
          </span>
        ))}
      </p>

      <p className="text-base text-gray-600 mb-2 font-semibold">
        {doc.categoria.map((cat) => cat.nombre).join(", ")}
      </p>

      {/* Etiqueta de Visibilidad */}
      <p className={`text-sm font-semibold ${doc.visibilidad === "publico" ? "text-green-600" : "text-red-600"}`}>
        {doc.visibilidad === "publico" ? "Público" : "Privado"}
      </p>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt />
            <span>
              {new Date(doc.fechaSubida).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href={`/document/${doc._id}`} className="flex items-center gap-2 text-blue-600 hover:underline no-underline">
            <FaEye /> Ver
          </Link>

          {/* Muestra los botones de Editar y Eliminar solo si el usuario es autor */}
          {isAuthor && (
            <>
              <Link href={`/document/edit/${doc._id}`} className="flex items-center gap-2 text-green-500 hover:underline no-underline">
                <FaEdit /> Editar
              </Link>
              <Button variant="red" className="flex items-center text-red-600 hover:text-red-700 p-2" onClick={handleShow}>
                <FaTrash />
              </Button>
            </>
          )}
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que quieres <span className="text-red-600 underline">eliminar</span> este documento?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="flex items-center gap-2 text-white bg-gray-700 hover:underline">
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleDelete(doc._id);
              handleClose();
            }}
            className="flex items-center gap-2 text-white bg-red-600 hover:underline hover:bg-red-950"
          >
            <FaTrash /> Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </li>
  );
}


