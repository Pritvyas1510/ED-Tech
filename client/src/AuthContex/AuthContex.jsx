import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../Axois/AxoisInstant";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // On page load: check localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout(false); // Silent logout if token is expired
        } else {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        logout(false); // Silent logout if token is invalid
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await apiRequest.post("/login", { email, password });

      if (response.data.success) {
        const userData = response.data.user;
        const jwtToken = response.data.token;

        const role = userData.accountType.toLowerCase();

        const formattedUser = {
          email: userData.email,
          role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          contactNumber: userData.contactNumber,
          image: userData.image,
        };

        setUser(formattedUser);
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(formattedUser));

        // Always go to home after login
        navigate("/");
        window.scrollTo(0, 0);
        return true;
      } else {
        setError(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError("Login failed, please try again.");
      return false;
    }
  };

  // New function to update user data (e.g., profile image)
  const updateUser = (updatedUserData) => {
    const newUser = {
      ...user,
      ...updatedUserData,
    };
    setUser(newUser); // Update state with new object to trigger re-render
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Logout — with option to skip navigation
  const logout = (navigateToLogin = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (navigateToLogin) {
      navigate("/login");
      window.scrollTo(0, 0);
    }
  };

  const isStudent = user?.role === "student";
  const isInstructor = user?.role === "instructor";
  const isAdmin = user?.role === "admin";

  const checkTokenExpiration = () => {
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser, // Expose updateUser function
        isStudent,
        isInstructor,
        isAdmin,
        loading,
        error,
        checkTokenExpiration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};