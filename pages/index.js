import React, { Component } from 'react';
import ripple from '../ripple';
import TxRow from '../components/TxRow';
import { Container, Table } from 'semantic-ui-react';
import Head from 'next/head';

class RippleWatch extends Component {
  static async getInitialProps() {
    await ripple.connect();
    const address = await ripple.getAccountInfo(
      'rN3dBbAqB7b47GB2BPKvP3Y61pkciNKiE5'
    );
    // ripple.on('ledger', ledger => {
    //   console.log('ledger', JSON.stringify(ledger, null, 2));
    // });
    console.log(address);

    return { address };
  }
  renderRow = txs =>
    txs.map(tx => {
      console.log('-------------------------', tx);
      return <TxRow transaction={tx} key={tx.transaction.hash} />;
    });

  componentDidMount = async () => {
    await ripple.connect();
    ripple.connection.on('transaction', tx => {
      // console.log(JSON.stringify(ev, 'transaction event', 2));
      this.setState(prev => ({ txs: [...prev.txs, tx] }));
    });

    ripple.request('subscribe', {
      accounts: ['rN3dBbAqB7b47GB2BPKvP3Y61pkciNKiE5']
    });
  };

  componentDidUpdate(prevProps) {}

  state = { txs: [] };

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
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
          <div>현재 블록 : ???</div>
        </div>
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
