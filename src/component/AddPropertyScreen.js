import React, { Component } from 'react'
import { Modal, Header, Form } from 'semantic-ui-react'

export class AddPropertyScreen extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal.Header>Which property are you adding?</Modal.Header>
          <Modal.Content image>
            <Form style={{ width: '100%' }}>
              <Form.Input fluid label='Street 1' placeholder='198 Grand Ave' />
              <Form.Input fluid label='Street 2' placeholder='Apt B (Optional)' />
              <Form.Group widths='equal'>
                <Form.Input fluid label='City' placeholder='Boston' />
                <Form.Input fluid label='State' placeholder='MA' />
                <Form.Input fluid label='Zip' placeholder='00000' />
              </Form.Group>
              <Form.Button>Submit</Form.Button>
            </Form>
          </Modal.Content>
      </React.Fragment>
    )
  }
}

export default AddPropertyScreen
