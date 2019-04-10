import React, { useState, useEffect } from 'react'
import { Card, Button, Feed, Icon, Modal, Confirm } from 'semantic-ui-react'
import moment from 'moment'

import ToDoList from 'component/TaskList'
import AddPropertyScreen from 'component/AddPropertyScreen'
import {
  getAllPortfolios,
  getAllUpdates,
  deleteProperty
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
  const [showPrompt, setShowPrompt] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  
  async function fetchPortfolios() {
    const result = await getAllPortfolios()
    if (!result) setLoPortfolio([]);
    else setLoPortfolio(result);
  }

  const addToListing = (data) => {
    setLoPortfolio([ data, ...loPortfolio ]);
  } 

  const showDeletePrompt = (id) => {
    setShowPrompt(true);
    setDeleteId(id);
  }

  const deleteListing = async () => {
    const { propertyId } = await deleteProperty(deleteId)
    setDeleteId('');
    setLoPortfolio(loPortfolio.filter(p => p.id !== propertyId));
    setShowPrompt(false);
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
      >
        <Card.Content>
          <Card.Header>{address}</Card.Header>
            <Icon
              className="cursor-pointer"
              name="trash alternate"
              size="large"
              color="red"
              style={{ position: 'absolute', right: 10, top: 10 }}
              onClick={() => showDeletePrompt(property.id)}
            />
        </Card.Content>
        <Card.Content 
          onClick={() => navigateToDetail(property.id)}
        >
          <Card.Meta>{property.status}</Card.Meta>
          <Card.Description>
            {`${property.rooms} BED ${property.bathrooms} BATH ${property_type}`}
          </Card.Description>
        </Card.Content>
      </Card>
    )
  })

  return (
    <div>
      <Header add={addToListing} />
      {cards}
      <div>
        <Confirm 
          open={showPrompt} 
          onCancel={() => setShowPrompt(false)} 
          header='Deleting Property'
          content='Deleting property is an irreversible action. By confirming, you will be deleting all information, including tenant, tasks, and owner.'
          onConfirm={deleteListing} />
      </div>
    </div>
  )
}

function Header({ add }) {
  const [isModalOpen, setModalOpen] = useState(false)

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div>
      <h1>Property Portfolio for Admin</h1>
      <Modal trigger={<Button 
          positive
          onClick={() => setModalOpen(true)}
        >
          Add a property
        </Button>}
        open={isModalOpen}
      >
        <AddPropertyScreen 
          close={closeModal}
          addProperty={add} 
        />
      </Modal>
        
    </div>
  )
}

function Update() {
  const [feeds, setFeeds] = useState([])

  async function fetchFeeds() {
    const response = await getAllUpdates()
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
      <h1>Updates</h1>
      <Feed>
        {formattedFeed}
      </Feed>
    </div>
  )
}