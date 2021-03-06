import React, { useState, useEffect } from 'react'
import { Input, List, Form, Button, Search } from 'semantic-ui-react'
import moment from 'moment'

import {
  getAllTasks,
  deleteTaskById,
  addTask,
  getTasksForProperty,
  updateTaskApi
} from 'utils/api'
import AdditionalInfoInput from 'component/AdditionalInfoInput'

export default function ToDoList({ location }) {
  const [loTodo, setLoTodo] = useState([])

  const isHome = location.pathname.includes('home')
  async function fetchAllTasks() {
    const result = await getAllTasks()
    if (!result) setLoTodo([])
    else setLoTodo(result);
  }

  async function fetchTasksForProperty(id) {
    const result = await getTasksForProperty(id)
    if (!result) setLoTodo([])
    else setLoTodo(result)
  }

  useEffect(() => {
    if (isHome) {
      fetchAllTasks()
    } else {
      const propertyId = location.pathname.split('/')[2]
      fetchTasksForProperty(propertyId)
    }
  }, [])

  async function addData(taskValue, propertyId) {
    let id = propertyId
    if (!propertyId || propertyId.length === 0) {
      id = location.pathname.split('/')[2]
    }
    const data = await addTask(taskValue, id)
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

  function updateTask(info) {
    const { id, body, updated } = info
    const updatedList = loTodo.map(todo => {
      if (todo.id === id) {
        let update = {
          ...todo,
          body,
          updated
        }
        return update;
      }
      return todo;
    })
    setLoTodo(updatedList)
  }

  return (
    <div>
      <ToDoHeader 
        toAddTask={addData}
        isHome={isHome}
      />
      <Task 
        data={loTodo} 
        deleteTask={deleteTask}
        updateTask={(info) => updateTask(info)} 
      />
    </div>
  )
}

function ToDoHeader({ toAddTask, isHome }) {
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
        { isHome && 
          <AdditionalInfoInput 
            isShown={isClicked} 
            onPressCancel={onBlur} 
            onPressSubmit={onSubmit}
            onChangePropertyId={(value) => setPropertyId(value)}
          />
        }
      </Form>
    </React.Fragment>
  )
}

function Task({ data, deleteTask, updateTask }) {
  const [editing, flipEditing] = useState(false)
  const [editId, changeEditTarget] = useState('')
  const [field, changeField] = useState('')

  function turnOnEdit(id, body) {
    flipEditing(true)
    changeEditTarget(id)
    changeField(body)
  }

  const onChangeField = e => {
    if (!e.target) return
    const { value } = e.target
    changeField(value)
  }

  const onSubmit = async () => {
    const response = await updateTaskApi(editId, field);
    resetValues()
    updateTask(response)
  }

  function resetValues() {
    changeField('')
    changeEditTarget('')
    flipEditing(false)
  }

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
          <List.Header
            className="cursor-text"
            onClick={() => turnOnEdit(id, body)}
            style={{ overflowWrap: 'break-word' }}
          >
            { editing && editId === id ?
              <Form onSubmit={onSubmit}>
                <Input 
                  autoFocus
                  value={field}
                  fluid
                  onChange={onChangeField}
                  onBlur={resetValues}
                />
              </Form> :
              `${body}`
            }
          </List.Header>
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
