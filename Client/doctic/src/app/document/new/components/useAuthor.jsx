import { useEffect, useState, useRef, useCallback, memo } from "react";
import { customAlphabet } from "nanoid";

export const useAuthor = (
  onAuthorSubmit,
  USER = {},
  update = false,
  documentId = ""
) => {
  const [authors, setAuthors] = useState([]);
  const [provAuthors, setProvAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 5;
  const [addUnregistered, setAddUnregistered] = useState(false);
  const [isAPrincipalAuthor, setIsAPrincipalAuthor] = useState(false);
  const unregisteredName = useRef("");
  const unregisteredUsername = useRef("");

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

        const URI = update
          ? `http://localhost:8080/api/Documentos/id/${documentId}`
          : "http://localhost:8080/api/Usuarios/getAllUsers";
        const response = await fetch(URI);
        const authorsInDoc = await response.json(); // recoge los autores que ya estén en el documento que recoge de la API

        if (update) {
          const theAuthors = authorsInDoc.autores;
          const theAuthorsShown = [];

          theAuthors.forEach((auth) => {
            if (!auth.estaRegistrado) {
              theAuthorsShown.push({
                _id: auth.usuarioId,
                username: auth.username,
                perfil: {
                  fotoPerfil:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg",
                  nombre: auth.nombre,
                  apellido: "",
                },
              });
            }
          });

          setAddUnregistered(false);
          setSelectedAuthors([...selectedAuthors, ...theAuthors]);
          setProvAuthors([...theAuthorsShown, ...data]);
          setAuthors([...theAuthorsShown, ...data]);
        }
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchData();
  }, []);

  // Hook modificado para incluir el autor adicional por defecto
  useEffect(() => {
    const defaultAuthor = {
      usuarioId: "671aa9d3977f359d06bd523a",
      estaRegistrado: true,
      rol: "principal",
      nombre: "Pepito",
      username: "probador",
    };

    // Incluimos el autor por defecto si no está ya seleccionado
    const updatedAuthors = selectedAuthors.some(
      (author) => author.usuarioId === defaultAuthor.usuarioId
    )
      ? selectedAuthors
      : [defaultAuthor, ...selectedAuthors ];

    onAuthorSubmit(updatedAuthors); // Enviamos los autores con el predeterminado al componente padre
  }, [selectedAuthors]);

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
    const isSelected = selectedAuthors.some(
      (a) => a.username === author.username
    );

    if (isSelected) {
      setSelectedAuthors(
        selectedAuthors.filter((au) => au.username !== author.username)
      );
    } else {
      const theAuthor = {
        usuarioId: author._id,
        estaRegistrado: true,
        rol: "coautor",
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

    const nanoid = customAlphabet("1234567890abcdef", 24);

    const unregisteredAuthor = {
      usuarioId: nanoid(),
      estaRegistrado: false,
      rol: "coautor",
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
    unregisteredName.current.value = "";
    unregisteredUsername.current.value = "";
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

