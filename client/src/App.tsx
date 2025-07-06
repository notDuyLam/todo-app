import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import UserPage from "./components/UserPage";
import TodoPage from "./components/TodoPage";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("todo-theme") === "light" ? false : true
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("todo-theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b...">
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
