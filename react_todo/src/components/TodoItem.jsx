import React from "react"
import "../styles/TodoItem.css"

const TodoItem = (props) => (
  <div className="todo-item">
      <input type="checkbox" onChange={() => props.handleChange(props.item.id)} checked={props.item.completed} />
      <p>{props.item.text}</p>
  </div>
)

export default TodoItem
