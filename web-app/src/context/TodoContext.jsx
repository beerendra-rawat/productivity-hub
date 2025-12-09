import React, { createContext, useContext, useEffect, useState } from "react";
import { groupBy } from "../utils/helpers.js";

const TodoContext = createContext();

const LOCAL_KEY = "todos";

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);

  // Load from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    if (!text.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: text.trim(), status: "pending" },
    ]);
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
          : t
      )
    );
  };

  const editTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const groupedTodos = groupBy(todos, "status");

  const value = {
    todos,
    groupedTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  return useContext(TodoContext);
}
