import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

class TxRow extends Component {
  render() {
    const { Row, Cell } = Table;
    const {
      hash,
      Destination,
      Account,
      Amount
    } = this.props.transaction.transaction;

    return (
      <Row>
        <Cell>{hash}</Cell>
        <Cell>{Account}</Cell>
        <Cell>{Destination}</Cell>
        <Cell>{Amount / 10 ** 6}</Cell>
      </Row>
    );
  }
}

export default TxRow;
