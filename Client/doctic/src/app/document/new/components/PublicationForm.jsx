'use client'

export const PublicationForm = () => {

  const formHandler = (event) => {
    event.preventDefault();
    console.log(event);
    console.log(event.target);
    const [, inputTitle, inputDescription, inputCategory, inputAuthors, inputPDF, inputVisibility] = event.target;

    const title = inputTitle.value;
    const description = inputDescription.value;
    console.log(inputCategory);

  }

  return (
    <section aria-labelledby="publication-form-heading">
      <h2 id="publication-form-heading" className="text-xl font-bold mb-4">
        Crear Publicación
      </h2>
      <form
      onSubmit={formHandler}
        // action="/api/upload"
        // method="POST"
        // encType="multipart/form-data"
        // className="bg-white p-6 rounded-md shadow-lg w-full max-w-md"
        // aria-describedby="form-description"
      >
        <p id="form-description" className="text-sm text-gray-600 mb-4">
          Por favor completa el formulario a continuación para crear una nueva publicación.
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Título
          </label>
          <input
              className="w-full p-2 border border-gray-300 rounded-md"
              type="text"
              id="title"
              name="title"
              placeholder="Ingresa el título de la publicación"
              required
              aria-required="true"
              maxLength="150"
          />
          <span className="text-gray-500 text-xs">Máximo 150 caracteres</span>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Descripción
            </label>
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                id="description"
                name="description"
                rows="4"
                placeholder="Escribe una breve descripción de la publicación"
                required
                aria-required="true"
                maxLength="800"
                style={{ minHeight: '80px', maxHeight: '400px', overflow: 'auto' }}
            ></textarea>
            <span className="text-gray-500 text-xs">Máximo 800 caracteres</span>
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Categoría
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            id="category"
            name="category"
            required
            aria-required="true"
          >
            <option value="">Selecciona una categoría</option>
            <option value="tecnología">Tecnología</option>
            <option value="ciencia">Ciencia</option>
            <option value="arte">Arte</option>
            <option value="negocios">Negocios</option>
            <option value="salud">Salud</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="authors">
            Autores
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            id="authors"
            name="authors"
            placeholder="Ingresa los autores separados por comas"
            required
            aria-required="true"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Sube un archivo (PDF)
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="file"
            id="file"
            name="file"
            accept=".pdf"
            required
            aria-required="true"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="visibility">
            Visibilidad
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            id="visibility"
            name="visibility"
            required
            aria-required="true"
          >
            <option value="public">Público</option>
            <option value="private">Privado</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            type="submit"

          >
            Crear Publicación
          </button>
        </div>
      </form>
    </section>
  );
};
