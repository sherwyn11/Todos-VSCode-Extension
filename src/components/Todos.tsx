import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Todos(props: any) {
  interface TODO {
    id: string;
    text: string;
    status: boolean;
  }
  let [text, setText] = useState("");
  let [todos, setTodos] = useState<Array<TODO>>([]);
  let [printTodos, setprintTodos] = useState<any>([]);
  let [accessToken, setAccessToken] = useState(props.accessToken);

  useEffect(() => {
    printTodoElements();
  }, [todos]);

  useEffect(() => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "add-todo":
          setText(message.value);
          addTodo(undefined, message.value);
          break;
      }
    });
    axios
      .get(`${apiBaseURL}todo/get-all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response: any) => {
        let temp: Array<TODO> = [];
        response.data.message.forEach((todo: any) => {
          temp.push({
            id: todo.id,
            text: todo.todo,
            status: todo.status,
          });
        });
        setTodos(temp);
      })
      .catch((err: Error) => {});
  }, []);

  const updateText = (e: any) => {
    setText(e.target.value);
  };

  const addTodo = (e?: any, selectedText?: string) => {
    let todoText = "";
    if (e) {
      e.preventDefault();
    }
    if (selectedText) {
      setText(selectedText);
      todoText = selectedText;
    } else {
      todoText = text;
    }
    let data = { todo: todoText, status: false };
    axios
      .post(`${apiBaseURL}todo/add`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setTodos((prevTodos) => [
          { id: response.data.message.id, text: todoText, status: false },
          ...prevTodos,
        ]);

        setText("");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const updateStatus = (e: any) => {
    let selectedTodo: TODO = todos.filter((todo) => {
      return todo.id === e.target.id;
    })[0];
    let data = { tid: selectedTodo.id };
    axios
      .patch(`${apiBaseURL}todo/update`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        selectedTodo.status = !selectedTodo.status;
        printTodoElements();
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  function printTodoElements() {
    let t = todos.map((todo) => {
      return (
        <ul>
          <li
            value={todo.text}
            id={todo.id}
            onClick={updateStatus}
            style={
              todo.status
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