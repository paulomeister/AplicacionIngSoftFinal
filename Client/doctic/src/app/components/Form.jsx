<form
 //action="/api/upload"  
  //method="POST"
  //cType="multipart/form-data"
  //className="bg-white p-6 rounded-md shadow-lg w-full max-w-md"
>
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
      Nombre
    </label>
    <input
      className="w-full p-2 border border-gray-300 rounded-md"
      type="text"
      id="name"
      name="name"
      placeholder="Ingresa tu nombre"
      required
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
      Correo electrónico
    </label>
    <input
      className="w-full p-2 border border-gray-300 rounded-md"
      type="email"
      id="email"
      name="email"
      placeholder="Ingresa tu correo"
      required
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
      Mensaje
    </label>
    <textarea
      className="w-full p-2 border border-gray-300 rounded-md"
      id="message"
      name="message"
      rows="4"
      placeholder="Escribe tu mensaje aquí"
      required
    ></textarea>
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
      Sube un archivo
    </label>
    <input
      className="w-full p-2 border border-gray-300 rounded-md"
      type="file"
      id="file"
      name="file"
    />
  </div>

  <div className="flex justify-center">
    <button
      className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600"
      type="submit"
    >
      Enviar
    </button>
  </div>
</form>
