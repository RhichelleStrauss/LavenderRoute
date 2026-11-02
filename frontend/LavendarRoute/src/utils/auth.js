// clears everything the site saves for a logged-in user, then goes home
export const logout = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRoles');
  localStorage.removeItem('userId');
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
  navigate('/');
  window.location.reload();
};

// the login token's middle part holds { id, firstName, roles }
export const getTokenPayload = () => {
  try {
    const payload = localStorage.getItem('token').split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};
