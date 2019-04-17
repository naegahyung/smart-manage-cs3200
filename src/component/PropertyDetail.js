import React, { useEffect, useState } from 'react'
import { List, Icon, Grid, Input, Form } from 'semantic-ui-react'

import ToDoList from 'component/TaskList'
import { 
  getPropertyInfo,
  modifyStatusOfProperty,
  modifyPropertyField
} from 'utils/api'

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
          <PropertyInfo goBack={() => history.push('/home')} />
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

function PropertyInfo({ goBack }) {
  const [propertyInformation, setInformation] = useState({})

  async function fetchInformation() {
    const response = await getPropertyInfo(id)
    if (!response || !response.length) goBack();
    else setInformation(formatDetails(response[0]))
  }

  function formatDetails(o) {
    const house = {}
    const tenant = {}
    const owner = {}
    const address1 = `${o.street1} ${o[`street 2`]}`
    const address2 = `${o.city}, ${o.state} ${o.zip}`
    house.bathroom = o.bathrooms
    house.room = o.rooms
    house.status = o.status
    house.propertyType = o.property_type
    house.lastMaintenance = o.last_maintenance
    house.lastVisited = o.last_visited
    house.value = o.value
    house.taxAmount = o.tax_amount
    house.rentAmount = o.rent_amount 
    house.rentDue = o.rent_due
    house.totalSpending = o.total_spending

    tenant.tenantName = o.tenant_name
    tenant.creditScore = o.credit_score
    tenant.lastPayment = o.last_rent_payment_date
    tenant.contractDue = o.tenant_contract_due

    owner.ownerName = o.owner_name
    owner.email = o.owner_email
    owner.phone = o.owner_phone
    return { house, tenant, owner, address1, address2 }
  }

  useEffect(() => {
    fetchInformation()
  }, [])

  const modifyData = (table, field, value) => {
    setInformation({ ...propertyInformation, [table]: { ...propertyInformation[table], [field]: value }})
  }

  return (
    <React.Fragment>
      <h1>{propertyInformation.address1} <br />
      {propertyInformation.address2}
      </h1>
      <Grid columns={2}>
        <HouseDetail data={propertyInformation.house} modifyData={modifyData} />
        <Grid.Column>
          <TenantInfo data={propertyInformation.tenant} modifyData={modifyData} />
          <OwnerInfo data={propertyInformation.owner} modifyData={modifyData} />
        </Grid.Column>
      </Grid>
    </React.Fragment>
  )
}

function HouseDetail({ data, modifyData }) {
  return detailTemplate(data, 'About House', modifyData)
}

function TenantInfo({ data, modifyData}) {
  return detailTemplate(data, 'About Tenant', modifyData)
}
function OwnerInfo({ data, modifyData}) {

  return detailTemplate(data, 'About Owner', modifyData)
}

function detailTemplate(data, headerText, modifyData) {
  if (!data) return null
  const [modifyField, changeModifyField] = useState('')
  const [isModifyState, changeModifyState] = useState(false)
  const [modifiedValue, changeValue] = useState('')

  const onClickField = (key, value) => {
    changeModifyField(key);
    changeModifyState(true);
    changeValue(value)
  }

  const resetValues = () => {
    changeModifyField('')
    changeModifyState(false)
    changeValue('')
  }

  const changeStatus = async (val) => {
    await modifyStatusOfProperty(val, id);
    changeValue(val)
    modifyData('house', 'status', val)
  }

  const onSubmit = async () => {
    const response = await modifyPropertyField(headerText.replace('About ', ''), modifyField, modifiedValue, id);
    resetValues();
    if (!response) return;
    modifyData(headerText.replace('About ', '').toLowerCase(), modifyField, modifiedValue)
  }
  const InputFieldVariation = (key) => {
    const set = new Set()
    set.add('lastMaintenance')
    set.add('lastVisited')
    set.add('lastPayment')
    set.add('contractDue')
    set.add('rentDue')
    if (set.has(key)) return "date"
    return "text"
  }

  const listOfDetails = Object.entries(data).map(([key, value]) => {
    const rejected = key === 'propertyType'
    return (
      <List.Item key={`${value}_${key}_${id}`}>
        <List.Content>
          <List.Header>
            <h2>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z]+)/g, ' $1')}</h2>
          </List.Header>
          { isModifyState && key === modifyField && !rejected ? 
            <Form onSubmit={onSubmit}>
              { key === 'status' ? 
                <Form.Radio
                  checked={modifiedValue === 'OCCUPIED'}
                  value="status"
                  toggle
                  style={{ zIndex: 999 }}
                  onChange={(e) => changeStatus(modifiedValue === 'OCCUPIED' ? 'VACANT' : 'OCCUPIED')}
                /> :
                <Input 
                  type={InputFieldVariation(key)}
                  autoFocus
                  value={modifiedValue}
                  fluid
                  onChange={(e) => changeValue(e.target.value)}
                  onBlur={resetValues} 
                />
              } 
            </Form> :
            <List.Description onClick={() => onClickField(key, value)}>
              {value}
            </List.Description>
          }
        </List.Content>
      </List.Item>
    )
  })

  return (
    <Grid.Column style={{ marginBottom: 50 }}>
      <h3>{headerText}</h3>
      <List className="info-section">
        {listOfDetails}
      </List>
    </Grid.Column>
  )
}