import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { groupBy } from "../utils/helpers.js";

export default function TodoScreen() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  /* ---------- LOAD TODOS ---------- */
  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const loadTodos = async () => {
    const saved = await AsyncStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  };

  /* ---------- ADD TODO ---------- */
  const addTodo = () => {
    if (!text.trim()) return;

    Keyboard.dismiss();

    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setText("");
  };

  /* ---------- TOGGLE ---------- */
  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  /* ---------- DELETE ---------- */
  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  /* ---------- EDIT ---------- */
  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
    setExpandedId(null);
  };

  const saveTodo = (id) => {
    if (!editText.trim()) return;

    Keyboard.dismiss();

    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, text: editText } : t
      )
    );

    setEditingId(null);
    setEditText("");
  };

  /* ---------- GROUP TODOS ---------- */
  const groupedTodos = groupBy(todos, "completed");
  const pendingTodos = groupedTodos[false] || [];
  const completedTodos = groupedTodos[true] || [];

  /* ---------- RENDER ITEM ---------- */
  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const isLongText = item.text.length > 80;

    return (
      <View style={styles.todoItem}>
        <TouchableOpacity
          onPress={() => toggleTodo(item.id)}
          style={styles.checkBox}
        >
          <View style={item.completed ? styles.checked : styles.unchecked} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          {editingId === item.id ? (
            <TextInput
              style={[styles.todoText, styles.editInput]}
              value={editText}
              onChangeText={setEditText}
              autoFocus
              multiline
              returnKeyType="done"
              onSubmitEditing={() => saveTodo(item.id)}
            />
          ) : (
            <>
              <Text
                numberOfLines={isExpanded ? undefined : 2}
                style={[
                  styles.todoText,
                  item.completed && styles.completedText,
                ]}
              >
                {item.text}
              </Text>

              {isLongText && (
                <TouchableOpacity
                  onPress={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                >
                  <Text style={styles.readMore}>
                    {isExpanded ? "Read less" : "... Read more"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {editingId === item.id ? (
          <TouchableOpacity onPress={() => saveTodo(item.id)}>
            <Text style={styles.saveBtn}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => startEditing(item.id, item.text)}
          >
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>📝 Todo List</Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Add a new todo..."
                value={text}
                onChangeText={setText}
                returnKeyType="done"
                onSubmitEditing={addTodo}
              />

              <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.SecondHeading}>Pending</Text>
            <FlatList
              data={pendingTodos}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />

            <Text style={styles.SecondHeading}>Completed</Text>
            <FlatList
              data={completedTodos}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eef2ff',
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
    color: "#3b3b98",
  },

  SecondHeading: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 12,
    color: "#3b3b98",
  },

  inputRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d9ff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
  },

  addBtn: {
    backgroundColor: "#4b7bec",
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  todoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 3,
  },

  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#4b7bec",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 4,
  },

  unchecked: {
    width: 14,
    height: 14,
  },

  checked: {
    width: 14,
    height: 14,
    backgroundColor: "#4b7bec",
    borderRadius: 3,
  },

  todoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3436",
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },

  readMore: {
    color: "#4b7bec",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "600",
  },

  editBtn: {
    fontSize: 16,
    color: "#0984e3",
    marginLeft: 10,
  },

  saveBtn: {
    fontSize: 16,
    color: "green",
    marginLeft: 10,
    fontWeight: "700",
  },

  deleteText: {
    fontSize: 20,
    color: "#e74c3c",
    fontWeight: "700",
    marginLeft: 8,
  },

  editInput: {
    backgroundColor: "#e8f0ff",
    padding: 6,
    borderRadius: 6,
  },
});
