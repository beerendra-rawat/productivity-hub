// import { useState } from "react";
// import { useTodos } from "../context/TodoContext.jsx";
// import "../styles/TodoPage.css";

// export default function TodoPage() {
//   const { groupedTodos, addTodo, deleteTodo, toggleTodo, editTodo } = useTodos();

//   const [text, setText] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [editingText, setEditingText] = useState("");

//   const handleAdd = () => {
//     addTodo(text);
//     setText("");
//   };

//   const startEdit = (todo) => {
//     setEditingId(todo.id);
//     setEditingText(todo.text);
//   };

//   const saveEdit = () => {
//     editTodo(editingId, editingText);
//     setEditingId(null);
//     setEditingText("");
//   };

//   const renderList = (label, list = []) => (
//     <div className="todo-section">
//       <h3 className="todo-section-title">{label}</h3>

//       {list.length === 0 && <p className="todo-empty">No todos</p>}

//       {list.map((todo) => (
//         <div key={todo.id} className="todo-item">
//           <input
//             type="checkbox"
//             checked={todo.status === "completed"}
//             onChange={() => toggleTodo(todo.id)}
//           />

//           {editingId === todo.id ? (
//             <>
//               <input
//                 className="todo-edit-input"
//                 value={editingText}
//                 onChange={(e) => setEditingText(e.target.value)}
//               />
//               <button className="todo-btn" onClick={saveEdit}>Save</button>
//               <button className="todo-btn todo-btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
//             </>
//           ) : (
//             <>
//               <span
//                 className={`todo-text ${todo.status === "completed" ? "completed" : ""
//                   }`}
//               >
//                 {todo.text}
//               </span>
//               <button className="todo-btn" onClick={() => startEdit(todo)}>Edit</button>
//               <button className="todo-btn todo-btn-danger" onClick={() => deleteTodo(todo.id)}>
//                 Delete
//               </button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   const pending = groupedTodos["pending"] || [];
//   const completed = groupedTodos["completed"] || [];

//   return (
//     <div className="todo-page">
//       <h2 className="todo-title">Todo Management</h2>

//       <div className="todo-input-row">
//         <input
//           className="todo-input"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Add a new todo..."
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               handleAdd();
//             }
//           }}
//         />

//         <button className="todo-add-btn" onClick={handleAdd}>Add</button>
//       </div>

//       {renderList("Pending Todos", pending)}
//       {renderList("Completed Todos", completed)}
//     </div>
//   );
// }


import { useState } from "react";
import { useTodos } from "../context/TodoContext.jsx";
import "../styles/TodoPage.css";

export default function TodoPage() {
  const { groupedTodos, addTodo, deleteTodo, toggleTodo, editTodo } = useTodos();

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const LIMIT = 120; // characters before truncation

  const handleAdd = () => {
    addTodo(text);
    setText("");
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setExpandedId(null);
  };

  const saveEdit = () => {
    editTodo(editingId, editingText);
    setEditingId(null);
    setEditingText("");
  };

  const toggleReadMore = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // ⭐ Cut text after sentence end
  const getShortText = (text) => {
    if (text.length <= LIMIT) return text;

    const sliced = text.slice(0, LIMIT);
    const lastDot = sliced.lastIndexOf(".");

    return lastDot !== -1 ? sliced.slice(0, lastDot + 1) : sliced;
  };

  const renderList = (label, list = []) => (
    <div className="todo-section">
      <h3 className="todo-section-title">{label}</h3>

      {list.length === 0 && <p className="todo-empty">No todos</p>}

      {list.map((todo) => {
        const isExpanded = expandedId === todo.id;
        const isLongText = todo.text.length > LIMIT;

        return (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.status === "completed"}
              onChange={() => toggleTodo(todo.id)}
            />

            {editingId === todo.id ? (
              <>
                <input
                  className="todo-edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button className="todo-btn" onClick={saveEdit}>
                  Save
                </button>
                <button
                  className="todo-btn todo-btn-secondary"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className={`todo-text ${
                    todo.status === "completed" ? "completed" : ""
                  }`}
                >
                  {isExpanded || !isLongText
                    ? todo.text
                    : getShortText(todo.text)}
                </span>

                {isLongText && (
                  <button
                    className="read-more-btn"
                    onClick={() => toggleReadMore(todo.id)}
                  >
                    {isExpanded ? "... Read less" : "... Read more"}
                  </button>
                )}

                <button
                  className="todo-btn"
                  onClick={() => startEdit(todo)}
                >
                  Edit
                </button>

                <button
                  className="todo-btn todo-btn-danger"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  const pending = groupedTodos["pending"] || [];
  const completed = groupedTodos["completed"] || [];

  return (
    <div className="todo-page">
      <h2 className="todo-title">Todo Management</h2>

      <div className="todo-input-row">
        <input
          className="todo-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="todo-add-btn" onClick={handleAdd}>
          Add
        </button>
      </div>

      {renderList("Pending Todos", pending)}
      {renderList("Completed Todos", completed)}
    </div>
  );
}
