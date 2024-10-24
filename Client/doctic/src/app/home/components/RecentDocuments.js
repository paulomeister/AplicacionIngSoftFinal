"use client"; // Habilita funciones del cliente

import { useState, useEffect } from "react";
import { FaCalendarAlt, FaStar, FaArrowDown, FaEye, FaClock } from "react-icons/fa"; 
import Link from "next/link";
import axios from "axios";
import { SpinerComp } from "../../document/[id]/components/SpinnerComp";

export default function Documentos() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0: recientes, 1: valorados, 2: descargados



  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
  });


  const fetchDocuments = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(endpoint);
      setDocuments(response.data);
    } catch (err){
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        setError(`Error: ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        // La solicitud fue hecha pero no hubo respuesta
        setError("Error: No se recibió respuesta del servidor");
      } else {
        // Algo pasó al configurar la solicitud
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }

    
  };

  useEffect(() => {
    let endpoint = "/api/Documentos/recent";
    if (activeTab === 1) endpoint = "/api/Documentos/top-rated";
    else if (activeTab === 2) endpoint = "/api/Documentos/most-downloaded";

    fetchDocuments(endpoint);
  }, [activeTab]);

  const sectionTitles = [
    { title: "Agregados Recientemente!", icon: <FaClock /> },
    { title: "Más valorados!", icon: <FaStar /> },
    { title: "Más descargados!", icon: <FaArrowDown /> }
  ];

  const getHighlightClass = (type) => {
    if ((type === 'date' && activeTab === 0) ||
        (type === 'rating' && activeTab === 1) ||
        (type === 'downloads' && activeTab === 2)) {
      return "text-blue-600 font-bold";
    }
    return "text-gray-600";
  };

  if (loading) return <SpinerComp/>;
  if (error) return <p className="text-center text-red-500 mt-8 text-lg">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container p-6 flex-grow">
        {/* Título de la sección con icono */}
        <h1 className="text-4xl font-bold text-left mb-8 flex items-center gap-3">
          {sectionTitles[activeTab].icon} {sectionTitles[activeTab].title}
        </h1>

        <ul className="space-y-8">
          {documents.map((doc) => (
            <li key={doc._id} className="p-6 bg-white rounded shadow-md border">
              <h2 className="text-2xl font-semibold mb-2">{doc.titulo}</h2>
              <p className="text-lg text-gray-700 mb-1">
                <span className="font-semibold">Subido por:</span> {doc.autores?.[0].nombre}
              </p>
              <p className="text-base text-gray-600 mb-2 font-semibold">
                {doc.categoria?.map((cat) => cat.nombre).join(", ")}
              </p>

              {/* Metadatos del documento */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-8">
                  <div className={`flex items-center gap-2 ${getHighlightClass('date')}`}>
                    <FaCalendarAlt />
                    <span>
                      {new Date(doc.fechaSubida).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className={`flex items-center gap-2 ${getHighlightClass('rating')}`}>
                    <FaStar />
                    <span>{doc.datosComputados?.valoracionPromedio == null ? 'Sin calificación' : `${doc.datosComputados?.valoracionPromedio} /5`}</span>
                  </div>

                  <div className={`flex items-center gap-2 ${getHighlightClass('downloads')}`}>
                    <FaArrowDown />
                    <span>{doc.datosComputados?.descargasTotales || '0'} descargas</span>
                  </div>
                </div>

                {/* Botón de Ver usando Link sin <a> */}
                <Link href={`/document/${doc._id}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                  <FaEye /> Ver
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Indicadores en forma de esferas al final */}
      <div className="flex justify-center gap-4 mt-auto p-4">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`w-4 h-4 rounded-full ${
              activeTab === index ? "bg-gray-800" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
