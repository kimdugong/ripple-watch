import React, { Component } from 'react';
import ripple from '../ripple';

class RippleWatch extends Component {
  static async getInitialProps() {
    await ripple.connect();
    const address = await ripple.getAccountInfo(
      'rN3dBbAqB7b47GB2BPKvP3Y61pkciNKiE5'
    );
    return { address };
  }

  state = {};

  render() {
    return <div>Hi {this.props.address.xrpBalance}</div>;
  }
}
export default RippleWatch;
