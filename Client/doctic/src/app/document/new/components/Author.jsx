import { useEffect, useState } from "react";
import "./author.css";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

export function Author({
  author,
  handleClick,
  isSelected,
  handleCoAutorButton,
  isPrincipal,
}) {
  const { username } = author;
  const { nombre, apellido, fotoPerfil } = author.perfil;

  return (
    <ul className="author-item">
      <div className="author-info">
        <h1 id="author-image">
          <img src={fotoPerfil} alt="" className="authors-image-pub" />
        </h1>
        <div className="authors-name">
          <Link
            href={`/perfilDocuments/${username}`}
            className="author-name hover:underline"
          >
            {nombre} {apellido}
          </Link>

          <Link href={`/perfilDocuments/${username}`} className="flex text-sm">
            @{username}
          </Link>
        </div>
      </div>
      <div className="author-btns">
        {isPrincipal ? (
          <button
            onClick={handleCoAutorButton}
            className="text-blue-900 font-semibold text-[17px]"
            disabled={true}
          >
            Autor Principal
          </button>
        ) : isSelected ? (
          <button
            onClick={handleCoAutorButton}
            className=" text-red-500 font-semibold text-[17px] "
          >
            Quitar
          </button>
        ) : (
          <button
            onClick={handleCoAutorButton}
            className="text-blue-400 font-semibold text-[17px]"
          >
            Seleccionar
          </button>
        )}
      </div>
    </ul>
  );
}
