import React, { Component } from 'react';
import ripple from '../ripple';
import TxRow from '../components/TxRow';
import { Container, Table } from 'semantic-ui-react';
import Head from 'next/head';

const api = 'https://data.ripple.com/v2';
const myAddress = 'rN3dBbAqB7b47GB2BPKvP3Y61pkciNKiE5';

class RippleWatch extends Component {
  static async getInitialProps() {
    await ripple.connect();
    const address = await ripple.getAccountInfo(myAddress);
    const ledger = await ripple.getLedgerVersion();
    const transactions = await ripple.getTransactions(myAddress, {
      minLedgerVersion: 13000000,
      maxLedgerVersion: ledger
    });
    return { address, ledger, transactions };
  }

  renderRow = txs =>
    txs.map(tx => <TxRow transaction={tx} key={tx.transaction.hash} />);

  componentDidMount = async () => {
    const transactions = this.props.transactions.map(tx => ({
      transaction: {
        hash: tx.id,
        Destination: tx.specification.destination.address,
        Account: tx.address,
        Amount: tx.specification.destination.amount.value * 10 ** 6
      }
    }));
    this.setState({ txs: transactions });
    await ripple.connect();
    console.log('transactions  : ', this.state.txs);
    ripple.on('ledger', ledger => {
      this.setState({ currentLedger: ledger });
      return console.log(
        `${ledger.ledgerVersion}번쩨  ledger 생성   :  `,
        ledger
      );
    });

    ripple.connection.on('transaction', tx => {
      console.log('새로운 tx 발견    : ', tx);
      const affectedNodes = tx.meta.AffectedNodes;
      const myLedger = affectedNodes.filter(
        node => node.ModifiedNode.FinalFields.Account === myAddress
      );
      console.log('myLedger  : ', myLedger);
      const newTransaction = {
        transaction: {
          hash: tx.transaction.hash,
          Destination: tx.transaction.Destination,
          Account: tx.transaction.Account,
          Amount: tx.transaction.Amount
        }
      };
      this.setState(prev => ({
        txs: [newTransaction, ...prev.txs],
        xrpBalance: myLedger[0].ModifiedNode.FinalFields.Balance / 10 ** 6,
        previousAffectingTransactionLedgerVersion: tx.ledger_index
      }));
    });

    ripple.request('subscribe', {
      accounts: [myAddress]
    });
  };

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
