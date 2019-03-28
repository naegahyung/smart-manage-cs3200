import React, { useState, useEffect } from 'react'
import { Card, Button, Feed, Icon } from 'semantic-ui-react'
import moment from 'moment'

import generateDumbData from 'utils/randomData'
import ToDoList from 'component/TaskList'
import { getAllPortfoliosForUser } from 'utils/api'

export default function Home({ history }) {
  function navigateToDetail(id) {
    history.push(`/property/${id}`)
  }

  return (
    <div className="grid-container">
      <div className="grid-portfolio-container">
        <div className="portfolio">
          <Portfolio navigateToDetail={navigateToDetail} />
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

function Portfolio({ navigateToDetail }) {
  const [loPortfolio, setLoPortfolio] = useState([])

  async function fetchPortfolios() {
    const result = await getAllPortfoliosForUser()
    setLoPortfolio(result);
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

  const cards = sorted.map((property, i) => {
    const address = `${property.street1} ${property['street 2']} ${property.city} ${property.state} ${property.zip}`
    let { property_type, status } = property;
    if (property_type === 'SFH') property_type = 'Single-Family'
    else if (property_type === 'MFH') property_type = 'Multi-Family'
    else property_type = 'Condo'

    const color = status === 'OCCUPIED' ? 'green-card' : 'red-card'

    return (
      <Card
        key={`portfolio_element_${property.id}_${i}`}
        className={`portfolio-card ${color}`}
        fluid
        style={{ }}
        onClick={() => navigateToDetail(i)}
        header={address}
        description={`${property.rooms} BED ${property.bathrooms} BATH ${property_type}`}
        meta={property.status}
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