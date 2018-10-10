import React from 'react';
import { Table, Button } from 'semantic-ui-react';

export default props => {
  const { Row, Cell } = Table;
  const {
    hash,
    Destination,
    Account,
    Amount,
    ledger_index
  } = props.transaction.transaction;

  return (
    <Row>
      <Cell>{hash}</Cell>
      <Cell>{Account.substr(0, 8)}</Cell>
      <Cell>{Destination.substr(0, 8)}</Cell>
      <Cell>{Amount / 10 ** 6}</Cell>
      <Cell>{props.currentLedger.ledgerVersion - ledger_index}</Cell>
    </Row>
  );
};
