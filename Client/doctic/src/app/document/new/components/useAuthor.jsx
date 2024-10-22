// useAuthors.js
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { nanoid } from "nanoid";

export const useAuthor = (USER = {}, update = false, documentId = "") => {
  const [authors, setAuthors] = useState([]);
  const [provAuthors, setProvAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 5;
  const [addUnregistered, setAddUnregistered] = useState(false);
  const [isAPrincipalAuthor, setIsAPrincipalAuthor] = useState(false);
  const unregisteredName = useRef("");
  const unregisteredUsername = useRef("");

  // Hace que el usuario que ya está "autenticado" ya esté dentro de los autores
  // SELECCIONADOS
  const USERMAPPED = memo({
    usuarioId: USER._id,
    estaRegistrado: true,
    role: "principal",
    nombre: USER.perfil.nombre,
    username: USER.username,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        //! Si voy a actualizar entonces se cambia el endpoint
        const res = await fetch(
          "http://localhost:8080/api/Usuarios/getAllUsers"
        );
        const data = await res.json();

        setAuthors(data);
        setProvAuthors(data);
        // Pre-seleccionar autor principal

        // obtener los datos de los usuarios que ya están en el documento
        const URI = update
          ? `http://localhost:8080/api/Documentos/id/${documentId}`
          : "http://localhost:8080/api/Usuarios/getAllUsers";
        const response = await fetch(
          update ? `http://localhost:8080/api/Documentos/id/${documentId}` : ""
        );
        const authorsInDoc = await response.json(); // recoge los autores que ya estén en el documento que recoge de la API

        // si se va a acutalizar
        if (update) {
          const theAuthors = authorsInDoc.autores;
          console.log(theAuthors);
          const theAuthorsShown = [];

          theAuthors.forEach((auth) => {
            // si el autor no está registrado entonces muestreme en el frontend dicho autor
            if (!auth.estaRegistrado) {
              theAuthorsShown.push({
                // ESTO ES PARA QUE EN EL FRONTEND SE VEAN ESOS AUTORES SELECCIONADOS

                _id: auth.usuarioId,
                username: auth.username,
                perfil: {
                  fotoPerfil:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg",
                  nombre: auth.nombre,
                  apellido:""
                },
              });
            }
          });

          setAddUnregistered(false); // el componente para registrar autores debe estar oculto
          setSelectedAuthors([...selectedAuthors, ...theAuthors, USERMAPPED]); // autores seleciconados para EDITAR el documetno // mostrar en el frontend el botón "Quitar"
          setProvAuthors([...theAuthorsShown, ...data]); // autores seleccionados para MOSTRAR en el frontend
          setAuthors([...theAuthorsShown, ...data]);
        } else {
          setSelectedAuthors([USERMAPPED]); // COMO SELECCIONADO YA ESTÁ EL USER
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const handleChange = useCallback(
    (e) => {
      const newAuthor = e.target.value;
      const filteredAutores = authors.filter(
        (author) =>
          author?.perfil?.nombre
            .toLowerCase()
            .includes(newAuthor.toLowerCase()) ||
          author?.perfil?.apellido
            .toLowerCase()
            .includes(newAuthor.toLowerCase()) ||
          author?.username
            .toLowerCase()
            .includes(newAuthor.toLowerCase().replace("@", ""))
      );

      setProvAuthors(filteredAutores);
    },
    [authors]
  );

  const handleCoAutorButton = (author) => {
    const isSelected = selectedAuthors.some((a) => a.usuarioId === author._id);

    if (isSelected) {
      setSelectedAuthors(
        selectedAuthors.filter((au) => au.usuarioId !== author._id)
      );
    } else {
      const theAuthor = {
        usuarioId: author._id,
        estaRegistrado: true,
        role: "coautor",
        nombre: author.perfil.nombre,
        username: author.username,
      };

      setSelectedAuthors([...selectedAuthors, theAuthor]);
    }
  };

  const addUnregisteredAuthor = () => {
    const newAuthorName = unregisteredName.current.value;
    const newUsername = unregisteredUsername.current.value;

    if (newAuthorName.trim() === "" || newUsername.trim() === "") {
      alert("Por favor ingresa el nombre y el nombre de usuario.");
      return;
    }

    const isDuplicate = selectedAuthors.some(
      (author) => author.username === newUsername
    );

    if (isDuplicate) {
      alert("Este autor ya ha sido agregado.");
      return;
    }

    const unregisteredAuthor = {
      usuarioId: nanoid(),
      estaRegistrado: false,
      role: "coautor",
      nombre: newAuthorName,
      username: newUsername,
    };

    const shallowAuthors = authors.slice();

    const updatingAuthors = [
      {
        username: newUsername,
        perfil: {
          fotoPerfil:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg",
          nombre: newAuthorName,
        },
      },
      ...shallowAuthors,
    ];

    setSelectedAuthors([unregisteredAuthor, ...selectedAuthors]);
    setProvAuthors(updatingAuthors);
    setAuthors(updatingAuthors);
  };

  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = provAuthors.slice(
    indexOfFirstAuthor,
    indexOfLastAuthor
  );
  const totalPages = Math.ceil(provAuthors.length / authorsPerPage);

  return {
    authors,
    provAuthors,
    selectedAuthors,
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
  };
};
