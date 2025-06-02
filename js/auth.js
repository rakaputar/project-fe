const checkAuth = () => {
  if (!getAccessToken()) {
    window.location.href = "login.html";
  }
};

const checkNotAuth = () => {
  if (getAccessToken()) {
    window.location.href = "index.html";
  }
};
