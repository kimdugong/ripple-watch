import React from 'react';
import { Table, Button } from 'semantic-ui-react';

export default children => {
  const { Row, Cell } = Table;
  const {
    hash,
    Destination,
    Account,
    Amount
  } = children.transaction.transaction;

  return (
    <Row>
      <Cell>{hash}</Cell>
      <Cell>{Account.substr(0, 8)}</Cell>
      <Cell>{Destination.substr(0, 8)}</Cell>
      <Cell>{Amount / 10 ** 6}</Cell>
    </Row>
  );
};
