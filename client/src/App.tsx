import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import UserPage from "./pages/UserPage";
import TodoPage from "./pages/TodoPage";
import LoginPage from "./pages/LoginPage";
import TodoListPage from "./pages/TodoListPage";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("todo-theme") === "light" ? false : true
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("todo-theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
          <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<TodoListPage />} />
              <Route path="/todoLists/:listId" element={<TodoPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
