export const isLogin = () => {
  const token = localStorage.getItem('token');

  const id = localStorage.getItem('id');

  return token && id ? { token, id } : null;
};
