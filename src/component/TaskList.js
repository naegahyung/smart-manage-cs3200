import React, { useState, useEffect } from 'react'
import { Input, List, Form, Button, Search } from 'semantic-ui-react'
import moment from 'moment'
import _ from 'lodash'

import {
  getAllTasks,
  deleteTaskById,
  addTask,
} from 'utils/api'
import AdditionalInfoInput from 'component/AdditionalInfoInput'

export default function ToDoList({ location }) {
  const [loTodo, setLoTodo] = useState([])
  const [taskValue, setTaskValue] = useState('')

  const isHome = location.pathname.includes('home')

  async function fetchAllTasks() {
    const result = await getAllTasks()
    if (!result) setLoTodo([])
    else setLoTodo(result);
  }

  useEffect(() => {
    if (isHome) {
      fetchAllTasks()
    } else {

    }
  }, [])

  async function addData(taskValue, propertyId) {
    const data = await addTask(taskValue, propertyId)
    if (!data) return;
    setLoTodo([ ...[data], ...loTodo ])
  }

  async function deleteTask(id) {
    const result = await deleteTaskById(id)
    if (!result || result === 'fail') {
      return;
    }
    removeItem(id)
  }

  function removeItem(id) {
    const filtered = loTodo.filter(todo => todo.id !== id)
    setLoTodo(filtered)
  }

  return (
    <div>
      <ToDoHeader 
        toAddTask={addData}
      />
      <Task data={loTodo} deleteTask={deleteTask} />
    </div>
  )
}

function ToDoHeader({ toAddTask }) {
  const [taskInput, setTaskInput] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [propertyId, setPropertyId] = useState('');

  const onChangeInput = (e) => {
    if (!e.target) return;
    setTaskInput(e.target.value);
  }

  const onPress = () => {
    if (isClicked) return;
    setIsClicked(true)
  }

  const onBlur = () => {
    if (!isClicked) return;
    setIsClicked(false)
  }

  function onSubmit() {
    toAddTask(taskInput, propertyId);
    setTaskInput('')
    setPropertyId('')
  }

  return (
    <React.Fragment>
      <h1>Tasks</h1>
      <Form onSubmit={onSubmit}>
        <Input
          icon='plus'
          iconPosition='left'
          placeholder='Add Task'
          fluid
          onClick={onPress}
          onChange={onChangeInput} 
          value={taskInput}
        />
        <AdditionalInfoInput 
          isShown={isClicked} 
          onPressCancel={onBlur} 
          onPressSubmit={onSubmit}
          onChangePropertyId={(value) => setPropertyId(value)}
        />
      </Form>
    </React.Fragment>
  )
}

function Task({ data, deleteTask }) {
  const content = data.map(({ body, id, updated, full_address }, i) => {
    return (
      <List.Item key={`task_home_${id}`} className="task-list-item">
        <List.Icon 
          onClick={() => deleteTask(id)}
          style={{ paddingLeft: 10 }}
          className="cursor-pointer"
          name='circle outline' 
          size='large' 
          verticalAlign='middle' 
        />
        <List.Content style={{ maxWidth: 0 }}>
          <List.Header style={{ overflowWrap: 'break-word' }}>{`${body}`}</List.Header>
          <br />
          {`updated ${moment(updated).fromNow()}`}
          <List.Description>
          {full_address && full_address !== 'None' && <label>For {full_address}</label>}
          </List.Description>
        </List.Content>
      </List.Item>
    )
  })
  return (
    <List divided relaxed>
      {content}
    </List>
  ) 
}
