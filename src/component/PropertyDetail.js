import React from 'react'

export default function PropertyDetail() {
  return (
    <div className="detail-container">
      <div className="grid-container">
        <div className="property-info-container border">
          <PropertyInfo />
        </div>
        <div className="grid-task-list-container border">
          <div className="to-do">
            hello
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertyInfo() {
  return (
    <React.Fragment>
      <h1>5587 Nunc. Avenue <br />
      Erie Rhode Island 24975
      </h1>
      <HouseDetail />
      <TenantInfo />
      <OwnerInfo />
    </React.Fragment>
  )
}

function HouseDetail() {
  return (
    <div>
      <h3>House Details</h3>
      
    </div>
  )
}

function TenantInfo() {
  return (
    <div>
      <h3>Tenant Info</h3>
    </div>
  )
}

function OwnerInfo() {
  return (
    <div>
      <h3>Owner Info</h3>

    </div>
  )
}
