'use client';
import React, { useState } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCalendarAlt, FaStar, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "./DocumentItem.css";

const DocumentItem = ({ results, propietario }) => {
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Nuevo estado para el pop-up de éxito
  const [idToDelete, setIdToDelete] = useState(null);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (id) => {
    setIdToDelete(id);
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/Documentos/delete/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setShowSuccess(true); // Mostrar el pop-up de éxito
      } else {
        console.error("Error al eliminar el documento.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const calcularPromedioValoracion = (valoraciones) => {
    if (!valoraciones || valoraciones.length === 0) {
      return 0;
    } else {
      const suma = valoraciones.reduce((total, valoracion) => total + valoracion.puntuacion, 0);
      return (suma / valoraciones.length).toFixed(1);
    }
  };

  return (
    <div>
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <h3><strong>{result.titulo}</strong></h3>

          {/* Renderizar autores */}
          <div className="result-authors">
            <p><strong className="result-author">Autores: </strong> 
              {result.autores?.map((autor, i) => (
                <Link href={`/users/${autor.username}`} className="author" key={i}> 
                  <span>{autor.nombre}{i < result.autores.length - 1 ? ", " : ""}</span> 
                </Link>
              ))}
            </p>
          </div>

          {/* Renderizar categoría */}
          <div className="result-categories">
            <p><strong>Categorías: </strong>
              {result.categoria?.map((cat, i) => (
                <span key={i}>{cat.nombre}{i < result.categoria.length - 1 ? ", " : ""}</span>
              ))}
            </p>
          </div>

          {/* Renderizar fecha y valoración */}
          <div className="result-params">
            <div className="result-img">
              <div className="result-date">
                <FaCalendarAlt /> <p>{new Date(result.fechaSubida).toLocaleDateString()}</p>
              </div>
              <div className="result-rating">
                <FaStar /> <p>{calcularPromedioValoracion(result.valoraciones)}</p>
              </div>
            </div>
            <div className="btns-container">
              <Link className="view-btn" href={`/document/${result._id}`}><FaEye /><p>Ver</p></Link>

              {/* Renderizar botón de eliminar y editar */}
              {propietario &&
              <div className="propietario">
                <button className="delete-btn" onClick={() => handleShow(result._id)}><FaTrash /><p>Eliminar</p></button>
                <Link className="edit-btn" href={`/document/edit/${result._id}`}><FaEdit /><p>Editar</p></Link>
              </div>
              }
            </div>
          </div>
          
          {/* Modal para confirmar eliminación de documento */}
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
                  handleDelete(idToDelete);
                  handleClose();
                }}
                className="flex items-center gap-2 text-white bg-red-600 hover:underline hover:bg-red-950"
              >
                <FaTrash /> Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal para mostrar éxito en la eliminación */}
          <Modal show={showSuccess} onHide={() => setShowSuccess(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Documento Eliminado</Modal.Title>
            </Modal.Header>
            <Modal.Body>El documento ha sido eliminado exitosamente.</Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => setShowSuccess(false)}
              >
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ))}
    </div>
  );
};

export default DocumentItem;
