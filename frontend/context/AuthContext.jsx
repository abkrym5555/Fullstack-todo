import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../services/api";
import Toast from "../components/Toast";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    if (token) {
      api("GET", "/users/me")
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(() => {
          setToken(null);
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken, user) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  };

  const showToast = (message, type = "success") => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        login,
        logout,
        showToast,
        setCurrentUser,
        loading,
      }}
    >
      {!loading ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen text-muted">
          Loading...
        </div>
      )}
      {toastMsg && <Toast message={toastMsg.message} type={toastMsg.type} />}
    </AuthContext.Provider>
  );
}
