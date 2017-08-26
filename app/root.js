import React from 'react';
import Header from './components/header.js';
import Player from './pages/player.js';
import MusicList from './pages/music-list.js';
import {MUSIC_LIST} from './config/config.js';
import Pubsub from 'pubsub-js';
import { Link , Router , Route , IndexRoute , HashHistory } from 'react-router';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	currentMusitItem : MUSIC_LIST[0],
    	musicList : MUSIC_LIST,
    	playType : 'cycle'
    }
  }

  playMusic(item){		//播放音乐
	$('#player').jPlayer('setMedia',{
		mp3:item.file
	}).jPlayer('play');
  	this.setState({
  		currentMusitItem : item
  	});
  }

  playNext_normal(type = "next"){		//处理列表循环播放

  	let index = this.findMusicIndex(this.state.currentMusitItem);
  	let newIndex = null;
  	let length = this.state.musicList.length;
  	if(type == "next"){	
  		newIndex = ( index + 1 ) % length
  	}else{
  		newIndex = ( index - 1 + length ) % length
  	}

  	this.playMusic(this.state.musicList[newIndex]);
  }

  playNext_once(){		//单曲循环
  	this.playMusic(this.state.currentMusitItem);
  }

  playNext_random(){	//随机播放
  	let index = this.findMusicIndex(this.state.currentMusitItem);
  	this.playMusic(this.state.musicList[this.getRandomIndex(index)]);
  }

  getRandomIndex(index){		//获取随机歌曲index
  	let arr = this.state.musicList.filter((item)=>{
		return item.id !== (index)
  	});
  	return arr[Math.floor(Math.random() * arr.length)].id
  }

  findMusicIndex(item){		//找到歌曲所在位置
  	return this.state.musicList.indexOf(item);
  }

  changePlayType(){
  	console.log(this.state.playType);
  	if(this.state.playType == 'cycle'){
  		this.playNext_normal();
  	}else if(this.state.playType == 'once'){
  		this.playNext_once();
  	}else{
  		this.playNext_random();
  	}
  }

  componentDidMount() {
  	$('#player').jPlayer({
  		supplied : 'mp3',
  		wmode : 'window'
  	});

  	$("#player").bind($.jPlayer.event.ended,(e)=>{
  		this.playNext_normal();
  	});

  	this.playMusic(this.state.currentMusitItem);

  	//通知
  	Pubsub.subscribe('PLAY_MUSIC', (msg,item) =>{		//播放音乐
  		this.playMusic(item);
  	});
  	Pubsub.subscribe('DEL_MUSIC', (msg,item) =>{		//删除音乐
  		this.setState({
  			musicList : this.state.musicList.filter( ii => {
  				return ii !== item ;
  			})
  		});
  	});

  	Pubsub.subscribe('PLAY_NEXT',(msg,item)=>{		//下一曲
  		// this.playNext_random();
  		this.changePlayType()
  	});
  	Pubsub.subscribe('PLAY_PREV',(msg,item)=>{		//上一曲
  		this.playNext_normal('prev');
  	});

  	Pubsub.subscribe('CHANGE_TYPE',(msg,item)=>{	//播放模式变更
  		this.setState({
  			playType : item
  		});
  	});
  	
  }

  componentWillUnmount() {
  	//销毁通知
  	$("#player").unbind($.jPlayer.event.ended);
  	Pubsub.unsubscribe('PLAY_MUSIC');
  	Pubsub.unsubscribe('DEL_MUSIC');
  	Pubsub.unsubscribe('PLAY_PREV');
  	Pubsub.unsubscribe('PLAY_NEXT');
  	Pubsub.unsubscribe('CHANGE_TYPE');
  }
  
//  播放器与歌曲列表组件结构
// <Player currentMusitItem={this.state.currentMusitItem}></Player>
// <MusicList
// 		 		currentMusitItem = {this.state.currentMusitItem}
// 		 		musicList = {this.state.musicList}
// 		 	>
// 		 	</MusicList>
  render() {
    return (
    	<div>
    		<Header/>
    		{React.cloneElement(this.props.children,this.state)}
    	</div>
    );
  }
}



export default class Root extends React.Component {
  render(){
  	return (
  		<Router history={HashHistory}>
  			<Route path="/" component={App}>
  				<IndexRoute component={Player}></IndexRoute>
  				<Route path="/list" component={MusicList}></Route>
  			</Route>
  		</Router>
	);
  }
}
