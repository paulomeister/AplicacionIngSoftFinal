import React from 'react';

const FormField = ({ label, name, value, onChange, type = "text", placeholder, required }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        className="w-full p-2 border border-gray-300 rounded-md"
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-required={required}
      />
    </div>
  );
};

export default FormField;