import React from 'react';
import './progress.less'

export default class Progress extends React.Component {

  constructor(props) {
    super(props);
  }
  changeProgress(e){
  	let pb = this.refs.pb;		//DOM元素
  	let mx = e.clientX;			//鼠标点击位置
  	let res = (mx - pb.getBoundingClientRect().left) / pb.clientWidth;
  	this.props.onchagneProgress && this.props.onchagneProgress(res);
  }
  
  render() {
    return (
      <div ref="pb" className="components-progress" onClick={this.changeProgress.bind(this)}>
      		<div className="progress" style={{ width : this.props.progress+'%', backgroundColor: this.props.barColor}} ></div>
      </div>
    );
  }
}
