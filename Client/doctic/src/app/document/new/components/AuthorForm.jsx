// AuthorForm.js
"use client";
import { useContext, useEffect } from "react";
import React from "react";
import { Author } from "./Author";
import { useAuthor } from "./useAuthor";
import { AuthContext } from "app/app/context/AuthContext";

export const AuthorForm = ({ initialAuthors, onAuthorsChange }) => {
  const { user } = useContext(AuthContext);

  const {
    authors,
    provAuthors,
    selectedAuthors, // ! ESTE ES EL ARREGLO DE OBJETOS QUE SE TIENE QUE ENVIAR BIEN SEA, PARA ACTUALIZAR O AÑADIR UNA PUBLICACIÓN ()
    //! es decir, cuando el usuario ya haya terminado de hacer todo el formulario, esto será lo que se deba de enviar a la bd.
    currentAuthors,
    currentPage,
    totalPages,
    addUnregistered,
    unregisteredName,
    unregisteredUsername,
    setAddUnregistered,
    handleChange,
    handleCoAutorButton,
    addUnregisteredAuthor,
    setCurrentPage,
    isAPrincipalAuthor,
  } = useAuthor(onAuthorsChange, initialAuthors, user);
  // useAuthor(USER, false, "");
  // se envía: USUARIO, update?, documentId

  useEffect(() => {
    if (initialAuthors && initialAuthors.length > 0) {
      onAuthorsChange(initialAuthors);
    }
  }, [initialAuthors]);

  return (
    <div
      className="mb-5 text-lg author-section"
      style={addUnregistered ? { minHeight: "900px" } : { minHeight: "650px" }}
    >
      <label
        className="block text-gray-700 text-lg font-bold mb-2"
        htmlFor="author"
      >
        Autores
      </label>
      <div id="input-authors">
        <input
          className="input-authors"
          type="text"
          onChange={handleChange}
          placeholder="Buscar autor"
        />
      </div>

      <ul className="list-none mt-6">
        {currentAuthors.map((author, key) => (
          <Author
            key={key}
            author={author}
            isSelected={Boolean(
              selectedAuthors.some((a) => a.username === author.username)
            )}
            isPrincipal={Boolean(
              selectedAuthors.some(
                (a) => a.usuarioId === author._id && a.rol === "principal"
              )
            )}
            handleCoAutorButton={() => {
              handleCoAutorButton(author);
            }}
          />
        ))}
      </ul>

      {/* Paginación */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            type="button" // Aseguramos que sea solo un botón y no dispare el submit
            onClick={(e) => {
              e.preventDefault(); // Prevenimos la propagación del evento al formulario
              setCurrentPage(index + 1);
            }}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Añadir autor no registrado */}
      <div className="mt-6 text-center italic text-[16.5px]">
        {!addUnregistered && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevenimos la propagación del evento al formulario
              setAddUnregistered(true);
            }}
            className="text-blue-400 cursor-pointer hover:underline hover:text-blue-500"
          >
            ¿No encuentras a una persona?{" "}
            <span className="font-bold">Agrégalo.</span>
          </a>
        )}
        {addUnregistered && (
          <div className="mt-4 w-[400px] m-auto bg-gray-100 p-4 rounded-lg shadow-lg">
            <h2 className="text-[20px] font-semibold text-gray-700 mb-4">
              Añadir un nuevo autor no registrado
            </h2>
            <input
              type="text"
              placeholder="Nombre"
              ref={unregisteredName}
              value={unregisteredName.value}
              className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            />
            <div className="unregistered-btns">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); // Prevenimos la propagación del evento al formulario
                  addUnregisteredAuthor();
                }}
                className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition duration-200 text-[18px]"
              >
                Añadir autor
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); // Prevenimos la propagación del evento al formulario
                  setAddUnregistered(false);
                }}
                className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-500 transition duration-200 text-[18px]"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
