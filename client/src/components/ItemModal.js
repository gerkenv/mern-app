import React from 'react';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { addItem } from '../actions/itemActions';


class ItemModal extends React.Component {
  state = {
    // defines if modal is visible
    modal: false,
    // property for a new item name
    name: ''
  }

  // toggle visibility
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  // save a new value of input in state
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = (e) => {
    // prevent default event behavior & stop propagation
    e.preventDefault();

    // create a new item
    const newItem = {
      // get item name from `input` form
      name: this.state.name
    }

    // send action
    this.props.addItem(newItem);

    // Close modal
    this.toggle();
  }

  render() {
    return (
      <div>
        <Button
          color="dark"
          style={{marginBottom: "2rem"}}
          onClick={this.toggle}
        >
          Add Item
        </Button>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          backdrop={true}
        >
          <ModalHeader
            // this toggle hear is triggered by `X` button of header
            toggle={this.toggle}
          >
            Add an Item to Shopping List
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="item">Item</Label>
                <Input
                  type="text"
                  name="name"
                  id="item"
                  placeholder="Add a new item to buy"
                  onChange={this.onChange}
                />
                <Button
                  color="dark"
                  style={{marginTop: "2rem"}} block
                >
                  Add Item
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  item: state.item
});

export default connect(mapStateToProps, {addItem})(ItemModal);