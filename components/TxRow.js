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
      <Cell>{Account}</Cell>
      <Cell>{Destination}</Cell>
      <Cell>{Amount / 10 ** 6}</Cell>
    </Row>
  );
};
