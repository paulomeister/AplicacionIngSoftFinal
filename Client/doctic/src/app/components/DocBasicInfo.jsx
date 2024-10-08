import React from 'react';

export const DocBasicInfo = ({ title, description, visibility, category, authors}) => {
  return (
    <div className="border border-gray-300 p-6 rounded-lg max-w-lg">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">{title}</h1>

      {/* Authors */}
      {
          authors.map((aut, index) => {
            return (
              <p className="text-lg text-blue-500 mb-1" key={index}>
                {aut.nombre}
              </p>
            );
          })
        }
      

      {/* Descripción */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Descripción</h3>
        <p className="text-sm text-gray-700">{description}</p>
      </div>

      {/* Visibility */}
      <div className="mt-4">
        <span 
          className={`inline-block px-3 py-1 text-white rounded ${
            visibility === 'publico' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {visibility}
        </span>
      </div>

      {/* Categories */}
      <div className="mt-2 space-x-2">
        {category.map((cat, index) => (
          <span 
            key={index} 
            className="inline-block px-3 py-1 bg-gray-200 rounded-full text-xs"
          >
            {cat.nombre}
          </span>
        ))}
      </div>
    </div>
  );
};
