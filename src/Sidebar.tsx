import { useState, useEffect } from 'react';

export default function Sidebar() {

  interface TODO {
    text: string,
    completed: boolean
  }
  let [text, setText] = useState("");
  let [todos, setTodos] = useState<Array<TODO>>([]);
  let [printTodos, setprintTodos] = useState<any>([]);

  useEffect(() => {
    printTodoElements();
  }, [todos]);

  const updateText = (e: any) => {
    setText(e.target.value);
  }

  const addTodo = (e: any) => {
    e.preventDefault();
    setTodos([{ text: text, completed: false }, ...todos]);
    setText('');
  }

  const updateStatus = (e: any) => {
    console.log(e);
    let selectedTodo: TODO = todos.filter((todo) => { return todo.text === e.target.innerHTML })[0];
    console.log(selectedTodo)
    selectedTodo.completed = !selectedTodo.completed;
    printTodoElements();
  }

  function printTodoElements () {
    console.log(todos);
    let t = todos.map((todo) => {
      console.log(todo);
      return <ul><li value={todo.text} onClick={updateStatus} style={ todo.completed ? {textDecoration: "line-through"} : {} }>{todo.text}</li></ul>;
    });
    console.log(t);
    setprintTodos(t);
  }

  return (
    <div>
      <form>
        <input onChange={updateText} value={text}/><br></br>
        <button onClick={addTodo}>Add Todo</button>
      </form>
      { printTodos }
    </div>
  );
}