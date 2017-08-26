import React from 'react';
import './musiclistitem.less';
import Pubsub from 'pubsub-js';

export default class MusicListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  playListMusic(item){
  	Pubsub.publish('PLAY_MUSIC',item);
  }

  delMusic(item,e){
  	e.stopPropagation();
	Pubsub.publish('DEL_MUSIC',item);
  }

  render() {
  	let listItem = this.props.musiclistitem;
    return (
      <li onClick={this.playListMusic.bind(this,listItem)} className={`row components-listitem ${this.props.focus ? 'focus' : ''}`}>
         <p><span className="bold">{listItem.title}</span>  -  {listItem.artist}</p>
         <p onClick={this.delMusic.bind(this,listItem)} className="-col-auto delete"></p>
      </li>
    );
  }
}
