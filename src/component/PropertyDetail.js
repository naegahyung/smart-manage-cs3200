import React from 'react'
import { List, Icon } from 'semantic-ui-react'
import moment from 'moment'

import ToDoList from 'component/TaskList'

let id;

export default function PropertyDetail({ match, history, location }) {
  id = match.params.id;
  return (
    <div className="detail-container">
      <div onClick={() => history.goBack()}>
        <Icon
          name="arrow left"
          size="big"
          className="back-button"
          style={{ paddingLeft: 30 }} 
        />  
      </div>
      <div className="grid-container">
        <div className="property-info-container">
          <PropertyInfo />
        </div>
        <div className="grid-task-list-container">
          <div className="to-do">
            <ToDoList location={location} />
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertyInfo() {
  return (
    <React.Fragment>
      <h1>24975 Kit Carson Rd <br />
        Hidden Hills, CA 91302
      </h1>
      <HouseDetail />
      <TenantInfo />
      <OwnerInfo />
    </React.Fragment>
  )
}

function HouseDetail() {
  const houseInfo = {
    propertyType: 'Single Home Family',
    lastMaintenance: moment().toISOString(),
    lastVisited: moment().toISOString(),
    appraisedValue: 2301200,
    taxAmount: 10306,
    rentAmount: 10600,
    rentDue: moment().toISOString(),
    totalSpending: 53000,
    status: 'Occupied',
  }

  return detailTemplate(houseInfo, 'Aboute House')
}

function TenantInfo() {
  const tenant = {  
    name: 'Wilma S. Covey',
    phone: '510-834-4115',
    birthday: '11221949',
    ssn: '60805XXXX',
    creditScoreUponMoving: 770,
    lastRentPaid: moment().toISOString(),
    email: 'WilmaSCovey@dayrep.com',
  }

  return detailTemplate(tenant, 'About Tenant')
}

function OwnerInfo() {
  const owner = {
    name: 'Jin Kim',
    phone: '123-456-7890',
    email: 'admin@admin.com',
    contractExpiration: moment().toISOString(),
  }

  return detailTemplate(owner, 'About Owner')
}

function detailTemplate(data, headerText) {
  const listOfDetails = Object.entries(data).map(([key, value]) => {
    return (
      <List.Item key={`${value}_${key}_${id}`}>
        <List.Content>
          <List.Header>
            <h2>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z]+)/g, ' $1')}</h2>
          </List.Header>
          <List.Description>
            {value}
          </List.Description>
        </List.Content>
      </List.Item>
    )
  })

  return (
    <React.Fragment>
      <h3>{headerText}</h3>
      <List className="info-section">
        {listOfDetails}
      </List>
    </React.Fragment>
  )
}