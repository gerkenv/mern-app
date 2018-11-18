import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './ShoppingList.css';
import { connect } from 'react-redux';
import { getItems, deleteItem } from '../actions/itemActions';
import PropTypes from 'prop-types';

class ShoppingList extends Component {

  componentDidMount() {
    this.props.getItems();
  }

  onDeleteClick = (id) => {
    this.props.deleteItem(id);
  }

  render() {
    const { items } = this.props.item;

    return (
      <ListGroup>
        <TransitionGroup className="shopping-list">
          {items.map(({_id, name}) => (
            <CSSTransition key={_id} timeout={1000} classNames="fade">
              <ListGroupItem>
                <Button
                className="remove-btn"
                color="danger"
                size="sm"
                onClick={this.onDeleteClick.bind(this, _id)}
                >
                  &times;
                </Button>
                {name}
              </ListGroupItem>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListGroup>
    );
  }
}

ShoppingList.propTypes = {
  getItems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
}

// `state` argument here is a complete store. In this component we need only a slice of it. Single property called `item`.
const mapStateToProps = (state) => {
  // console.log({completeStore: state})
  return ({
    item: state.item
  })
};

export default connect(
  mapStateToProps,
  {
    getItems,
    deleteItem
  }
)(ShoppingList);