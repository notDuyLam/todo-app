import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

type NavigationProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

function Navigation({ darkMode, setDarkMode }: NavigationProps) {
  const location = useLocation(); // Gets current URL
  return (
    <nav className="p-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/">
            <Button variant={location.pathname === "/" ? "default" : "outline"}>
              Tasks
            </Button>
          </Link>
          <Link to="/user">
            <Button
              variant={location.pathname === "/user" ? "default" : "outline"}
            >
              Profile
            </Button>
          </Link>
        </div>

        <Button
          variant="outline"
          className="fixed top-4 right-4 rounded-full w-10 h-10 p-0 flex items-center justify-center"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </nav>
  );
}

export default Navigation;
