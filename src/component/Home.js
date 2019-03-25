import React, { useState, useEffect } from 'react'
import { Card, Button, Input, List, Form, Checkbox, Feed, Icon } from 'semantic-ui-react'
import moment from 'moment'

export default function Home() {
  return (
    <div className="grid-container">
      <div className="grid-portfolio-container">
        <div className="portfolio">
          <Portfolio />
        </div>
      </div>
      <div className="grid-task-list-container">
        <div className="to-do">
          <ToDoList />
        </div>
        <div className="last-updated-list"> 
          <Update />
        </div>
      </div>
    </div>
  )
}

function momentRandom(end = moment(), start) {
  const endTime = +moment(end);
  const randomNumber = (to, from = 0) =>
    Math.floor(Math.random() * (to - from) + from);

  if (start) {
    const startTime = +moment(start);
    if (startTime > endTime) {
      throw new Error('End date is before start date!');
    }
    return moment(randomNumber(endTime, startTime));
  }
  return moment(randomNumber(endTime));
}

function generateDumbData(count, timestamp) {
  const dummy = {
    header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    meta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  }
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({ 
      ...dummy, 
      timestamp: timestamp || momentRandom(),
      index: i,
    });
  }
  return data;
}


function Portfolio() {
  const [loPortfolio, setLoPortfolio] = useState([])

  function fetchPortfolios() {
    setLoPortfolio(generateDumbData(20));
  }

  function addToListing() {
    setLoPortfolio(loPortfolio.concat(generateDumbData(1, moment())));
  } 
  
  useEffect(() => {
    fetchPortfolios();
  }, []);

  const sorted = loPortfolio.sort((d1, d2) => {
    if (d1.timestamp > d2.timestamp) return -1;
    if (d1.timestamp < d2.timestamp) return 1;
    return 0;
  })

  const cards = sorted.map(({ header, meta, description, timestamp }, i) => {
    return (
      <Card
        key={`portfolio_element_${header}_${i}`}
        fluid
        header={header}
        meta={`${meta}_${timestamp}`}
        description={description}
      />
    )
  })

  return (
    <div>
      <Header add={addToListing} />
      {cards}
    </div>
  )
}

function Header({ add }) {
  return (
    <div>
      <h1>Property Portfolio for Admin</h1>
      <Button 
        positive
        onClick={add}
      >
        Add a property
      </Button>
    </div>
  )
}

function ToDoList() {
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

function Update() {
  const [feeds, setFeeds] = useState([])

  useEffect(() => {
    setFeeds(generateDumbData(10))
  }, [])

  const formattedFeed = feeds.map(feed => {
    return (
      <Feed.Event>
        <Feed.Label>
          <img src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User>Elliot Fu</Feed.User> added you as a friend
            <Feed.Date>1 Hour Ago</Feed.Date>
          </Feed.Summary>
          <Feed.Meta>
            <Feed.Like>
              <Icon name='like' />
              4 Likes
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    )
  })

  return (
    <div>
      <h1>Recently Updated</h1>
      <Feed>
        {formattedFeed}
      </Feed>
    </div>
  )
}