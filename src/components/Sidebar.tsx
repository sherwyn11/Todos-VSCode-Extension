import React, { useState, useEffect } from "react";

export default function Sidebar() {
  interface TODO {
    text: string;
    completed: boolean;
  }
  let [text, setText] = useState("");
  let [todos, setTodos] = useState<Array<TODO>>([]);
  let [printTodos, setprintTodos] = useState<any>([]);

  useEffect(() => {
    window.addEventListener("message", async (event) => {
      console.log(event);
      const message = event.data;
      switch (message.type) {
        case "add-todo":
          setText(message.value);
          addTodo(undefined, message.value);
          break;
      }
    });
    printTodoElements();
  }, [todos]);

  const updateText = (e: any) => {
    setText(e.target.value);
  };

  const addTodo = (e?: any, selectedText?: string) => {
    if (e) {
      e.preventDefault();
    }
    if (selectedText) {
      setTodos([{ text: selectedText, completed: false }, ...todos]);
    } else {
      setTodos([{ text: text, completed: false }, ...todos]);
    }
    setText("");
  };

  const updateStatus = (e: any) => {
    let selectedTodo: TODO = todos.filter((todo) => {
      return todo.text === e.target.innerHTML;
    })[0];
    selectedTodo.completed = !selectedTodo.completed;
    printTodoElements();
  };

  function printTodoElements() {
    let t = todos.map((todo) => {
      return (
        <ul>
          <li
            value={todo.text}
            onClick={updateStatus}
            style={
              todo.completed
                ? { textDecoration: "line-through", fontStyle: "italic" }
                : {}
            }
          >
            {todo.text}
          </li>
        </ul>
      );
    });
    setprintTodos(t);
  }

  return (
    <div>
      <form>
        <input onChange={updateText} value={text} />
        <br></br>
        <button onClick={addTodo}>Add Todo</button>
      </form>
      {printTodos}
    </div>
  );
}
