import React from "react"
import TodoItem from "./TodoItem"

import '../todoData'
import '../styles/App.css'

function App() {
  const todoItems = todoData.map(item => <TodoItem key={item.id} item={item} />)

    (
      <div className="todo-list">
          {todoItems}
      </div>
    )
}

export default App
