import React, { Component } from 'react'
import { Modal, Form } from 'semantic-ui-react'
import moment from 'moment';

import { addProperty } from 'utils/api';

class AddPropertyScreen extends Component {
  state = {
    step: 0,
    step0: {
      street1: '360 Huntington',
      street2: '',
      city: 'Boston',
      state: 'MA',
      zip: '02115',
      isComplete: false,
    },
    step1: {
      bedrooms: 10,
      bathrooms: 2,
      value: 4500000.00,
      rent: 50000.00,
      tax: 1200000,
      totalSpending: 800000.00,
      lastVisited: moment().format('YYYY-MM-DD'),
      lastMaintenance: moment().format('YYYY-MM-DD'),
      occupied: true,
      houseType: 'MFH',
      isComplete: false,
    },
    step2: {
      name: 'Jessica',
      creditScore: 683,
      contractExpiration: moment().format('YYYY-MM-DD'),
      lastPaid: moment().format('YYYY-MM-DD'),
      rentDue: moment().format('YYYY-MM-DD'),
      isComplete: false,
    },
    step3: {
      name: 'Jin',
      phoneNum: '1234567891',
      email: 'jin@admin.com',
      isComplete: false,
    }
  }

  onClose = () => {
    this.props.close();
  }

  goToStep = (next) => {
    this.setState({ step: next })
  }

  submit = async (e) => {
    e.preventDefault();
    const data = await addProperty(this.state);

    this.props.addProperty(data);
    this.props.close();
  }

  onChange = (e, field, step) => {
    if (!e.target) return;
    const { value } = e.target;
    this.setState(prevState => ({ 
      [step]: {
        ...prevState[step],
        [field]: value,
      }
    }));
  }

  handleRadioChange = (e, { value }) => this.setState(prevState => ({ 
    step1: {
      ...prevState.step1,
      houseType: value,
    }
  }))

  handleOccupyChange = (e, { value }) => this.setState(prevState => ({
    step1: {
      ...prevState.step1,
      occupied: !value,
    }
  }))

  title = {
    step0: 'Property Location',
    step1: 'Property Details',
    step2: 'Tenant Information',
    step3: 'Owner Information',
  }

  render() {
    return (
      <React.Fragment>
        <Modal.Header>{this.title[`step${this.state.step}`]}</Modal.Header>
        <Modal.Content image>
          <Form style={{ width: '100%' }}>
            {this[`inputsForStep${this.state.step}`]()}
          </Form>
        </Modal.Content>
      </React.Fragment>
    )
  }
  
  handleFocus = (event) => event.target.select();

  inputsForStep0 = () => {
    const { step0 } = this.state;
    const { street1, street2, city, state, zip, } = step0;
    return (
      <React.Fragment>
        <Form.Input onFocus={this.handleFocus} value={street1} fluid label='Street 1' onChange={(e) => this.onChange(e, 'street1', 'step0')} />
        <Form.Input onFocus={this.handleFocus} value={street2} fluid label='Street 2' onChange={(e) => this.onChange(e, 'street2', 'step0')} />
        <Form.Group widths='equal'>
          <Form.Input onFocus={this.handleFocus} value={city} fluid label='City' onChange={(e) => this.onChange(e, 'city', 'step0')} />
          <Form.Input onFocus={this.handleFocus} value={state} fluid label='State' onChange={(e) => this.onChange(e, 'state', 'step0')} />
          <Form.Input onFocus={this.handleFocus} value={zip} fluid label='Zip' onChange={(e) => this.onChange(e, 'zip', 'step0')} />
        </Form.Group>
        <Form.Group>
          <Form.Button onClick={() => this.goToStep(1)}>Next</Form.Button>
          <Form.Button style={{ position: 'absolute', right: 0 }} negative onClick={this.onClose}>Cancel</Form.Button>
        </Form.Group>
      </React.Fragment>
    )
  }

  inputsForStep1 = () => {
    const { step1 } = this.state;
    const { bedrooms, bathrooms, value, rent, tax, totalSpending, lastVisited, lastMaintenance } = step1;
    return (
      <React.Fragment>
        <Form.Group widths='equal'>
          <Form.Input onFocus={this.handleFocus} fluid value={bedrooms} label='Bedrooms' placeholder='How many bedrooms?' onChange={(e) => this.onChange(e, 'bedrooms', 'step1')} />
          <Form.Input onFocus={this.handleFocus}fluid value={bathrooms} label='Bathrooms' placeholder='How many bathrooms?' onChange={(e) => this.onChange(e, 'bathrooms', 'step1')} />
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input onFocus={this.handleFocus}fluid value={value} label='Value' placeholder='current price of the unit' onChange={(e) => this.onChange(e, 'value', 'step1')} />
          <Form.Input onFocus={this.handleFocus}fluid value={tax} label='Tax' placeholder="last paid tax amount" onChange={(e) => this.onChange(e, 'tax', 'step1')} />
          <Form.Input onFocus={this.handleFocus}fluid value={rent} label='Rent' placeholder="monthly rent for the unit" onChange={(e) => this.onChange(e, 'rent', 'step1')} />
          <Form.Input onFocus={this.handleFocus}fluid value={totalSpending} label='Spending' placeholder="total spending on this unit" onChange={(e) => this.onChange(e, 'totalSpending', 'step1')} />
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input onFocus={this.handleFocus} type="date" value={lastVisited} fluid label='Last Visited' onChange={(e) => this.onChange(e, 'lastVisited', 'step1')}/>
          <Form.Input onFocus={this.handleFocus} type="date" value={lastMaintenance} fluid label='Last Maintenance Date' onChange={(e) => this.onChange(e, 'lastMaintenance', 'step1')}/>
        </Form.Group>
        <br />
        <Form.Group inline >
          <label>House Type</label>
          <Form.Radio
            label='Single Family House'
            value='SFH'
            checked={this.state.step1.houseType === 'SFH'}
            onChange={this.handleRadioChange}
          />
          <Form.Radio
            label='Multi Family House'
            value='MFH'
            checked={this.state.step1.houseType === 'MFH'}
            onChange={this.handleRadioChange}
          />
          <Form.Radio
            label='Condo'
            value='CONDO'
            checked={this.state.step1.houseType === 'CONDO'}
            onChange={this.handleRadioChange}
          />
        </Form.Group>
        <br/>
        <Form.Group inline>
          <label>Is the unit currently occupied?</label>
          <Form.Radio
            checked={this.state.step1.occupied}
            value="occupied"
            toggle
            onChange={this.handleOccupyChange}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Button onClick={() => this.goToStep(0)}>Prev</Form.Button>
          <Form.Button onClick={() => this.goToStep(2)}>Next</Form.Button>
          <Form.Button style={{ position: 'absolute', right: 0 }} negative onClick={this.onClose}>Cancel</Form.Button>
        </Form.Group>
      </React.Fragment>
    )
  }

  inputsForStep2 = () => {
    const { step2 } = this.state;
    const { name, creditScore, contractExpiration, lastPaid, rentDue } = step2;
    return (
      <React.Fragment>
        <Form.Input onFocus={this.handleFocus} fluid label='Tenant Name' value={name} onChange={(e) => this.onChange(e, 'name', 'step2')}/>
        <Form.Group widths='equal'>
          <Form.Input onFocus={this.handleFocus} fluid value={creditScore} label='Credit Score' placeholder='Boston' onChange={(e) => this.onChange(e, 'creditScore', 'step2')}/>
          <Form.Input onFocus={this.handleFocus} value={contractExpiration} type="date"fluid label='Contract Expiration Date' onChange={(e) => this.onChange(e, 'contractExpiration', 'step2')}/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input onFocus={this.handleFocus} value={rentDue} type="date" fluid label='Rent Due Date' onChange={(e) => this.onChange(e, 'rentDue', 'step2')} />
          <Form.Input onFocus={this.handleFocus} value={lastPaid} type="date" fluid label='Last Payment Date' onChange={(e) => this.onChange(e, 'lastPaid', 'step2')}/>
        </Form.Group>
        <Form.Group>
          <Form.Button onClick={() => this.goToStep(1)}>Prev</Form.Button>
          <Form.Button onClick={() => this.goToStep(3)}>Next</Form.Button>

          <Form.Button style={{ position: 'absolute', right: 0 }} negative onClick={this.onClose}>Cancel</Form.Button>
        </Form.Group>
      </React.Fragment>
    )
  }

  inputsForStep3 = () => {
    const { step3 } = this.state;
    const { name, email, phoneNum } = step3;
    return (
      <React.Fragment>
        <Form.Input onFocus={this.handleFocus} fluid value={name} label='Owner Name' onChange={(e) => this.onChange(e, 'name', 'step3')}/>
        <Form.Input onFocus={this.handleFocus} fluid value={email} label='Email' onChange={(e) => this.onChange(e, 'email', 'step3')}/>
        <Form.Input onFocus={this.handleFocus} fluid value={phoneNum} label='Phone number' onChange={(e) => this.onChange(e, 'phoneNum', 'step3')}/>
        <Form.Group>
          <Form.Button onClick={() => this.goToStep(2)}>Prev</Form.Button>
          <Form.Button onClick={this.submit} color="green">Submit</Form.Button>

          <Form.Button style={{ position: 'absolute', right: 0 }} negative onClick={this.onClose}>Cancel</Form.Button>
        </Form.Group>
      </React.Fragment>
    )
  }
}

export default AddPropertyScreen
