export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('es-US', options);
};