export const isLogin = () => {
  const token = localStorage.getItem('token');

  const id = localStorage.getItem('id');

  return token && id ? { token, id } : null;
};

export const formatDate = (date) => {
  return (
    new Date(date).getDate() +
    ' ' +
    new Date(date).toLocaleString('en-US', {
      month: 'short',
    }) +
    ', ' +
    new Date(date).getFullYear().toString().slice(-2)
  );
};

export const formatDateMonD = (date) => {
  return (
    new Date(date).toLocaleString('en-US', {
      month: 'short',
    }) +
    ' ' +
    new Date(date).getDate() +
    'th '
  );
};
