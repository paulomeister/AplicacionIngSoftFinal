import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";
import { FaEdit, FaEye, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";

export function DocumentListItem({ doc, handleEdit, handleDelete }) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <li key={doc._id} className="p-6 bg-white rounded shadow-md border">
      <h2 className="text-2xl font-semibold mb-2">{doc.titulo}</h2>

      {/* Autores con links */}
      <p className="text-lg text-gray-700 mb-1">
        <span className="font-semibold">Autores:</span>{" "}
        {doc.autores.map((autor, index) => (
          <Link
            key={autor.username}
            href={`/users/${autor.username}`}
            className="text-blue-600 hover:underline"
          >
            {autor.nombre}
            {index < doc.autores.length - 1 ? ", " : ""}
          </Link>
        ))}
      </p>

      {/* Categorías */}
      <p className="text-base text-gray-600 mb-2 font-semibold">
        {doc.categoria.map((cat) => cat.nombre).join(", ")}
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
          <Link
            href={`/document/${doc._id}`}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <FaEye /> Ver
          </Link>

          <Link
            href={`/document/edit/${doc._id}`}
            className="flex items-center gap-2 text-green-500 hover:underline"
          >
            <FaEdit /> Editar
          </Link>

          <>
            <Button
              variant="red"
              className="flex items-center gap-2 bg-white text-red-600 hover:underline"
              onClick={handleShow}
            >
              <FaTrash /> Eliminar
            </Button>
          </>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que quieres{" "}
          <span className="text-red-600 underline">eliminar</span> este
          documento?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className="flex items-center gap-2 text-white bg-gray-700 hover:underline"
          >
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
