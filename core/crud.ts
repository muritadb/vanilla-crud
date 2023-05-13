// const fs = require("fs");
import fs from "fs";
import { json } from "stream/consumers";
import { v4 as uuid } from 'uuid';

const DB_FILE_PATH = "./core/db";

console.log("[CRUD]");

type UUID = string

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

function create(content: string): Todo {
  const todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content,
    done: false,
  }

  const todos: Array<Todo> = [
    ...read(),
    todo,
  ]

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
    todos
  }, null, 2));

  return todo;
}

function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) {
    return [];
  }

  return db.todos;
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();

  todos.forEach(currentTodo => {
    const isToUpdate = currentTodo.id === id
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo)
    }
  })

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
    todos,
  }, null, 2))

  if (!updatedTodo) {
    throw new Error("Please, provide another ID!");
  }

  return updatedTodo
}

function updatedContentById(id: UUID, content: string): Todo {
  return update(id, {
    content,
  })
}

function deleteById(id: UUID) {
  const todos = read()

  const todosWithoutOne = todos.filter(todo => {
    if (id === todo.id) {
      return false
    }


    return true
  });

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
    todos: todosWithoutOne,
  }, null, 2));
}

function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// SIMULATION
CLEAR_DB()
create("nova mensagem")
const secondTodo = create("segunda mensagem")
const thirdTodo = create("terceira mensagem")
// update(secondTodo.id, {
//   content: "segunda todo com novo content",
//   done: true
// });
deleteById(secondTodo.id)
updatedContentById(thirdTodo.id, "atualiza a terceira  agora")
console.log(read())