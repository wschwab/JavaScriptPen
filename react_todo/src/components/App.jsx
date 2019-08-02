import React from "react"
import TodoItem from "./TodoItem"
import '../styles/App.css'

const App = () => (
      <div className="todo-list">
          <TodoItem />
          <TodoItem />
          <TodoItem />
          <TodoItem />
      </div>
)

export default App
