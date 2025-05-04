export const getVerb = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return date < today ? 'Has hecho' : 'Harás';
};

export const getOtherVerb = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return date < today ? 'ha hecho' : 'hará';
};
