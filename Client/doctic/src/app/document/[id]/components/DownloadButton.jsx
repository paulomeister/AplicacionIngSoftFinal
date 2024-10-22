'use client'
import { instance } from "app/app/api/axios";
import { useState } from "react";
import { Alert } from "react-bootstrap";

export const DownloadButton = ({ userId ="66ebbc56e9670a5556f9781a",  documentId = "67132a785e9ca46b7f477a6a", url}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const downloadFile = async () => {
    setLoading(true);
    setError(null);
    setShowAlert(false); // Reset alert visibility

    const fileId = url;

    try {
      const response = await instance.get(`/Documentos/downloadFile`, {
        params: {
          fileId: fileId,
          userId: userId,
          documentId: documentId,
        },
        responseType: "blob", // Important for file downloads
      });

      // Create a URL for the downloaded file
      const fileBlob = new Blob([response.data]);
      const url = window.URL.createObjectURL(fileBlob); // Ensure url is defined after the blob creation
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", response.headers["content-disposition"].split("filename=")[1]); // Use the filename from the response headers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show alert after download
      setShowAlert(true);
    } catch (e) {
      setError(`Error: ${e.response ? e.response.statusText : e.message}`);
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
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          El PDF se ha descargado con éxito.
        </Alert>
      )}
    </div>
  );
};
