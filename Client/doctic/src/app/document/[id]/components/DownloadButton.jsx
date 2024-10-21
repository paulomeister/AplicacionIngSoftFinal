export const DownloadButton = ({ url }) => {
  return (
    <div className="flex flex-row justify-center items-center">
      <p className="text-sm">¿Quieres descargarlo?</p>
      <button
        onClick={() => window.open(url)}
        className={`flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200`}
        aria-label="Descargar documento PDF"
      >
        Descargar PDF
      </button>
    </div>
  );
};
