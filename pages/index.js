import React, { Component } from 'react';
import ripple from '../ripple';
import TxRow from '../components/TxRow';
import { Container, Table } from 'semantic-ui-react';
import Head from 'next/head';
import axios from 'axios';

const api = 'https://data.ripple.com/v2';
const myAddress = 'rN3dBbAqB7b47GB2BPKvP3Y61pkciNKiE5';

class RippleWatch extends Component {
  static async getInitialProps() {
    await ripple.connect();
    const address = await ripple.getAccountInfo(myAddress);
    const ledger = await ripple.getLedgerVersion();
    const transactions = await ripple.getTransactions(myAddress, {
      minLedgerVersion: 12500000,
      maxLedgerVersion: ledger
    });
    return { address, ledger, transactions };
  }

  renderRow = txs =>
    txs.map(tx => <TxRow transaction={tx} key={tx.transaction.hash} />);

  componentDidMount = async () => {
    const transactions = this.props.transactions.map(tx => {
      const transaction = {
        transaction: {
          hash: tx.id,
          Destination: tx.specification.destination.address,
          Account: tx.address,
          Amount: tx.specification.destination.amount.value * 10 ** 6
        }
      };
      return transaction;
    });
    this.setState(prev => ({ txs: transactions }));
    await ripple.connect();
    ripple.on('ledger', ledger => this.setState({ currentLedger: ledger }));
    ripple.connection.on('transaction', tx => {
      console.log('tx listening  : ', tx);
      const affectedNodes = tx.meta.AffectedNodes;
      const myNode = affectedNodes.filter(
        node => node.ModifiedNode.FinalFields.Account === myAddress
      );

      this.setState(prev => ({
        txs: [...prev.txs, tx],
        xrpBalance: myNode[0].ModifiedNode.FinalFields.Balance / 10 ** 6,
        previousAffectingTransactionLedgerVersion: tx.ledger_index
      }));
    });

    ripple.request('subscribe', {
      accounts: [myAddress]
    });
  };

  componentDidUpdate(prevProps) {}

  state = {
    txs: [],
    currentLedger: this.props.ledger,
    xrpBalance: this.props.address.xrpBalance,
    previousAffectingTransactionLedgerVersion: this.props.address
      .previousAffectingTransactionLedgerVersion
  };

  render() {
    const { Header, Row, HeaderCell, Body, Cell } = Table;
    return (
      <Container>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"
          />
        </Head>
        <div>
          <h1>Dugong's Ripple Watch</h1>
          <div>현재 렛져 : {this.state.currentLedger.ledgerVersion}</div>
        </div>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Address</HeaderCell>
              <HeaderCell>xrpBalance</HeaderCell>
              <HeaderCell>previousAffectingTransactionLedgerVersion</HeaderCell>
            </Row>
          </Header>
          <Body>
            <Row>
              <Cell>{myAddress}</Cell>
              <Cell>{this.state.xrpBalance}</Cell>
              <Cell>
                {this.state.previousAffectingTransactionLedgerVersion}
              </Cell>
            </Row>
          </Body>
        </Table>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Transaction Hash</HeaderCell>
              <HeaderCell>From</HeaderCell>
              <HeaderCell>To</HeaderCell>
              <HeaderCell>Amount(xrp)</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow(this.state.txs)}</Body>
        </Table>
      </Container>
    );
  }
}
export default RippleWatch;
