"use client";

import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaStar,
  FaArrowDown,
  FaEye,
  FaClock,
} from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { SpinerComp } from "../../document/[id]/components/SpinnerComp";

export default function Documentos() {
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [topRatedDocuments, setTopRatedDocuments] = useState([]);
  const [mostDownloadedDocuments, setMostDownloadedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0: recientes, 1: valorados, 2: descargados

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
  });

  const fetchDocuments = async (endpoint, setDocumentState) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(endpoint);
      setDocumentState(response.data);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        setError("Error: No se recibió respuesta del servidor");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let endpoint;
    let setDocumentState;

    if (activeTab === 0 && recentDocuments.length === 0) {
      endpoint = "/api/Documentos/recent";
      setDocumentState = setRecentDocuments;
    } else if (activeTab === 1 && topRatedDocuments.length === 0) {
      endpoint = "/api/Documentos/top-rated";
      setDocumentState = setTopRatedDocuments;
    } else if (activeTab === 2 && mostDownloadedDocuments.length === 0) {
      endpoint = "/api/Documentos/most-downloaded";
      setDocumentState = setMostDownloadedDocuments;
    }

    if (endpoint) {
      fetchDocuments(endpoint, setDocumentState);
    } else {
      setLoading(false); // Si ya hay documentos, no es necesario mostrar el spinner
    }
  }, [activeTab]);

  const sectionTitles = [
    { title: "Agregados Recientemente!", icon: <FaClock /> },
    { title: "Más valorados!", icon: <FaStar /> },
    { title: "Más descargados!", icon: <FaArrowDown /> },
  ];

  const getHighlightClass = (type) => {
    if (
      (type === "date" && activeTab === 0) ||
      (type === "rating" && activeTab === 1) ||
      (type === "downloads" && activeTab === 2)
    ) {
      return "text-blue-600 font-bold";
    }
    return "text-gray-600";
  };

  const documents =
    activeTab === 0
      ? recentDocuments
      : activeTab === 1
      ? topRatedDocuments
      : mostDownloadedDocuments;

  if (loading) return <SpinerComp />;
  if (error)
    return (
      <p className="text-center text-red-500 mt-8 text-lg">Error: {error}</p>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-4xl font-bold text-left mb-8 flex items-center gap-3">
          {sectionTitles[activeTab].icon} {sectionTitles[activeTab].title}
        </h1>

        <ul className="space-y-8">
          {documents.map((doc) => (
            <li key={doc._id} className="p-6 bg-white rounded shadow-md border">
              <Link href={`/document/${doc._id}`} className="hover:text-blue-600 no-underline hover:underline"><h2 className=" text-2xl font-semibold mb-2">{doc.titulo}</h2></Link>
              <p className="text-lg text-gray-700 mb-1">
                <span className="font-semibold">Subido por:</span> 
                <Link href={`/users/${doc.autores?.[0]?.username}`} className="text-blue-600 hover:underline no-underline"> {doc.autores?.[0]?.nombre}</Link>
              </p>
              <p className="text-base text-gray-600 mb-2 font-semibold">
                {doc.categoria?.map((cat) => cat.nombre).join(", ")}
              </p>

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-8">
                  <div
                    className={`flex items-center gap-2 ${getHighlightClass(
                      "date"
                    )}`}
                  >
                    <FaCalendarAlt />
                    <span>
                      {new Date(doc.fechaSubida).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${getHighlightClass(
                      "rating"
                    )}`}
                  >
                    <FaStar />
                    <span>{doc.datosComputados?.valoracionPromedio == null ? 'Sin calificación' : `${Math.floor(doc.datosComputados?.valoracionPromedio * 10) / 10} /5`}</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 ${getHighlightClass(
                      "downloads"
                    )}`}
                  >
                    <FaArrowDown />
                    <span>
                      {doc.datosComputados?.descargasTotales || "0"} descargas
                    </span>
                  </div>
                </div>

                <Link href={`/document/${doc._id}`} className="flex items-center gap-2 text-blue-600 hover:underline no-underline">
                  <FaEye /> Ver
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
