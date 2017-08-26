import React from 'react';
import MusicListItem from '../components/musiclistitem.js';

export default class MusicList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  	let liEle = this.props.musicList.map((item)=>{
  		return (
  			<MusicListItem 
  				focus = {item === this.props.currentMusitItem}
  				key = {item.id}
				musiclistitem = {item}
			>
  			</MusicListItem>
		);
  	});
    return (
      <ul>
      	{liEle}
      </ul>
    );
  }
}
