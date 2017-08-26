import React from 'react';
import './header.less'

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="components-header row">
      	<img src="/static/images/logo.png" width="40" alt="" className="-col-auto"/>
      	<h1 className="caption">React Music Player</h1>
      </div>
    );
  }
}
