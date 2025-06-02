const API_URL = "http://localhost:5000/api";

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

const logout = async () => {
  try {
    const refreshToken = getRefreshToken();
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {}
  localStorage.clear();
  window.location.href = "login.html";
};

const fetchWithAuth = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  const skipAutoRefresh = url.includes("/users/verify-password");

  if (!skipAutoRefresh && (res.status === 403 || res.status === 401)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
    } else {
      logout();
    }
  }

  return res;
};


const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (res.ok) {
    const data = await res.json();
    setTokens({ accessToken: data.accessToken });
    return true;
  }

  return false;
};
