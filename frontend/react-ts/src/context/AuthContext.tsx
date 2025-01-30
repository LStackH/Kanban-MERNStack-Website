import {
    createContext,
    useContext,
    useState,
    ReactNode,
  } from "react";
  
  interface AuthContextValue {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
  }
  
  // Create the context
  const AuthContext = createContext<AuthContextValue>({
    token: null,
    login: () => {},
    logout: () => {},
  });
  
  // The provider component to wrap the app
  export function AuthProvider({ children }: { children: ReactNode }) {
    
    // Initialize state with whatever is in localStorage, if any
    const [token, setToken] = useState<string | null>(
      localStorage.getItem("token")
    );
  
    // Functions to update state + localStorage
    function login(newToken: string) {
      setToken(newToken);
      localStorage.setItem("token", newToken);
    }
  
    function logout() {
      setToken(null);
      localStorage.removeItem("token");
    }
  
    return (
      <AuthContext.Provider value={{ token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  // Custom hook to use auth
  export function useAuth() {
    return useContext(AuthContext);
  }
  