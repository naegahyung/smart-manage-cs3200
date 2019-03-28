import React, { useState, useEffect } from 'react'
import { Card, Button, Feed, Icon, Modal } from 'semantic-ui-react'
import moment from 'moment'

import generateDumbData from 'utils/randomData'
import ToDoList from 'component/TaskList'
import AddPropertyScreen from 'component/AddPropertyScreen'
import {
  getAllPortfolios,
  getAllUpdates
} from 'utils/api'

export default function Home({ history, location }) {
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
          <ToDoList location={location} />
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
    const result = await getAllPortfolios()
    if (!result) setLoPortfolio([])
    else setLoPortfolio(result);
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
        className={`portfolio-card ${color} cursor-pointer`}
        fluid
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
      <AddPropertyScreen />
    </div>
  )
}

function Header({ add }) {
  return (
    <div>
      <h1>Property Portfolio for Admin</h1>
      <Modal trigger={<Button 
          positive
          onClick={add}
        >
          Add a property
        </Button>}
      >
        <AddPropertyScreen />
      </Modal>
        
    </div>
  )
}

function Update() {
  const [feeds, setFeeds] = useState([])

  async function fetchFeeds() {
    const response = await getAllUpdates()
    console.log(response)
    setFeeds(response)
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  const formattedFeed = feeds.map((feed) => {
    const { due, field, label } = feed;
    const address = `${feed.street1} ${feed['street 2']} ${feed.city}, ${feed.state} ${feed.zip}`
    let reason = ''
    if (field === "last_visited") {
      reason = 'made a visit to the property on'
    } else if (field === 'rent_due') {
      reason = 'rent is due on' 
    } else if (field === 'last_maintenance') {
      reason = 'maintenance occurred on'
    }
    return (
      <Feed.Event>
        <Feed.Content>
          <Feed.Summary>
            For {address}, {reason}
          </Feed.Summary>
            <Feed.Meta>
              <Feed.Date>{moment(due).fromNow()}</Feed.Date>
              {label}
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