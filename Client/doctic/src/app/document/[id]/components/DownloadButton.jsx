"use client";
import { instance } from "app/app/api/axios";
import { useContext, useState } from "react";
import { Alert } from "react-bootstrap";
import { Axios } from "axios";
import { AuthContext } from "app/app/context/AuthContext";
import { Ingrid_Darling } from "next/font/google";

export const DownloadButton = ({ archivo }) => {
  const { user, isLoggedIn, clientKey, notificacionDeError,notificacionDeExito } = useContext(AuthContext);

  const userId = isLoggedIn ? user._id : null;
  const documentId = archivo._id;
  const fileId = archivo.urlArchivo;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const downloadFile = async () => {
    setLoading(true);
    setError(null);
    setShowAlert(false); // Reset alert visibility

    if (!userId || !isLoggedIn) { // si no está logeado entonces que nunca haga la petición
      notificacionDeError(
        "No puedes descargar un documento si no te has registrado"
      );
      setLoading(false)
      return
    }

    const form = new FormData();

    form.append("fileId", fileId);
    form.append("userId", userId);
    form.append("documentId", documentId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/Documentos/downloadFile`,
        {
          method: "POST",
          body: form,
          headers: {
            Authorization: clientKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      // Convierte la respuesta en un blob (archivo binario)
      const blob = await response.blob();

      // Crea una URL para el archivo descargado
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Extrae el nombre del archivo desde los headers
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "archivo.pdf"; // Si no hay filename, define uno por defecto

      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Limpia el DOM
      document.body.removeChild(link);

      // Muestra alerta tras la descarga
      notificacionDeExito(true);
    } catch (e) {
      notificacionDeError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      <p className="text-md">¿Quieres descargarlo?</p>
      <button
        onClick={downloadFile}
        className={`flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200`}
        aria-label="Descargar documento PDF"
        disabled={loading} // Disable button while loading
      >
        {loading ? "Cargando..." : "Descargar PDF"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Alert for download success */}
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          El PDF se ha descargado con éxito.
        </Alert>
      )}
    </div>
  );
};
