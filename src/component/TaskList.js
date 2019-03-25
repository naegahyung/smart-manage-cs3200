import React, { useState, useEffect } from 'react'
import { Input, List, Form, Checkbox } from 'semantic-ui-react'

import generateDumbData from 'utils/randomData'

export default function ToDoList() {
  const [loTodo, setLoTodo] = useState([])
  const [taskValue, setTaskValue] = useState('')

  useEffect(() => {
    setLoTodo(generateDumbData(5))
  }, [])

  function addData() {
    setLoTodo(loTodo.concat([ { description: taskValue } ]))
  }

  useEffect(() => {
    if (taskValue.length) {
      addData();
    }
  }, [ taskValue ])

  function deleteTask(i) {
    const copy = loTodo.slice();
    copy.splice(i, 1);
    setLoTodo(copy)
  }

  return (
    <div>
      <ToDoHeader toAddTask={(value) => setTaskValue(value)} />
      <Task data={loTodo} deleteTask={deleteTask} />
    </div>
  )
}

function ToDoHeader({ toAddTask }) {
  const [taskInput, setTaskInput] = useState('');


  const onChangeInput = (e) => {
    if (!e.target) return;
    setTaskInput(e.target.value);
  }

  function clearInput() {
    toAddTask(taskInput);
    setTaskInput('');
  }

  return (
    <React.Fragment>
      <h1>To Do</h1>
      <Form onSubmit={clearInput}>
        <Input
          icon='plus'
          iconPosition='left'
          placeholder='Add Task'
          fluid
          onChange={onChangeInput} 
          value={taskInput}
        />
      </Form>
    </React.Fragment>
  )
}

function Task({ data, deleteTask }) {
  const content = data.map(({ description, index }, i) => {
    return (
      <List.Content>
        <List.Description>
          <Checkbox
            radio
            onClick={() => deleteTask(i)}
            checked={false}
          />
          {`${description}_${index}`}
        </List.Description>
      </List.Content>
    )
  })
  return (
    <List>
      {content}
    </List>
  ) 
}
