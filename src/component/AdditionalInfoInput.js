import React, { Component } from 'react'
import { Button, Search } from 'semantic-ui-react'

import { fetchAddress } from 'utils/api'

export class AdditionalInfoInput extends Component {
  state = {
    isLoading: false,
    addressInput: '',
    addresses: [],
    selectedPropertyId: '',
  }

  timer = null;

  resetComponent = () => {
    this.setState({ isLoading: false, addressInput: '', addresses: [], selectedPropertyId: '' })
  }

  debounceFetch() {
    this.setState({ isLoading: true })
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      const data = await fetchAddress(this.state.addressInput)
      const addresses = data.map(({ full_address, id }) => ({ title: full_address, id }))
      this.setState({ addresses, isLoading: false })
    }, 200)
  }

  onChange = (e) => {
    if (!e.target) return
    const { value } = e.target
    this.setState({ addressInput: value })
    if (value.length < 1) this.resetComponent() 
    this.debounceFetch()
  } 

  onPropertySelect = (e, { result }) => {
    this.setState({ selectedPropertyId: result.id, addressInput: result.title  })
    this.props.onChangePropertyId(result.id)
  }

  render() {
    const { isShown, onPressCancel, onPressSubmit } = this.props;
    const { isLoading, addresses, addressInput } = this.state;
    if (!isShown) return null

    return (
      <div className="task-input-buttons-container"> 
        <Button color="green" type='submit' onClick={onPressSubmit}>Submit</Button>
        <Button color="red" type='reset' onClick={onPressCancel}>Cancel</Button>
        <div className="task-input-address">
          <label>Link property: &nbsp; </label>
          <Search
            fluid
            onResultSelect={this.onPropertySelect}
            size="large"
            loading={isLoading}
            onSearchChange={this.onChange}
            results={addresses}
            value={addressInput}
          />
        </div>
      </div>
    )
  }
}

export default AdditionalInfoInput
