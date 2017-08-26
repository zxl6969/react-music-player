import React from 'react';
import Progress from '../components/progress.js';
import { Link } from 'react-router';
import Pubsub from 'pubsub-js';
import './player.less';

let duration = null;
let typeArr = ['cycle','once','random'];
export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	volume : 0,
    	progress : 0,
    	isPlay : true,
      leftTime : '',
      type : typeArr[0]
    }
  }
  componentDidMount() {

  	$('#player').bind($.jPlayer.event.timeupdate,(e)=>{			//动态获取播放状态
  		duration = e.jPlayer.status.duration;
  		this.setState({
  			volume : e.jPlayer.options.volume * 100,
  			progress: e.jPlayer.status.currentPercentAbsolute,
        leftTime : this.formatTime(duration * ( 1 - e.jPlayer.status.currentPercentAbsolute / 100))
  		});
  	});
  }
  componentWillUnmount() {		//解绑
  	$('#player').unbind($.jPlayer.event.timeupdate);
  }
  changeProgressHandler(progress){		//改变播放进度
  	$('#player').jPlayer('play',duration * progress);
  }
  changeVolumeHandler(progress){		//改变声音
	$('#player').jPlayer('volume',progress);
  }
  play(){		//暂停播放切换

  	if(this.state.isPlay){
  		$('#player').jPlayer('pause');
  	}else{
  		$('#player').jPlayer('play');
  	}
  	this.setState({
  		isPlay: !this.state.isPlay
  	});
  }

  playPrev(){   //播放上一曲
    Pubsub.publish('PLAY_PREV');
    this.setState({
      isPlay: true
    });
  }

  playNext(){   //播放下一曲
    Pubsub.publish('PLAY_NEXT');
    this.setState({
      isPlay: true
    });
  }

  formatTime(time){   //时间格式化
    time = Math.floor(time);
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);

    sec < 10 ? `0${sec}` : sec;

    return `${min}:${sec}`;
  }

  changeType(){   //更改播放顺序
    let newIndex = typeArr[(typeArr.indexOf(this.state.type) + 1) % typeArr.length];
    Pubsub.publish('CHANGE_TYPE',newIndex);
    this.setState({
      type : newIndex
    });
    
  }


  render() {
    return (
      <div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusitItem.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusitItem.artist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
					               <Progress
        										progress={this.state.volume}
        										onchagneProgress={this.changeVolumeHandler.bind(this)}
        										barColor='#aaa'
					                >
					                </Progress>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px',marginTop:10}}>
			                <Progress
        								progress={this.state.progress}
        								onchagneProgress={this.changeProgressHandler.bind(this)}
			                >
			                </Progress>
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" onClick={this.playPrev.bind(this)}></i>
	                			<i className={`icon ml20 ${this.state.isPlay ? "pause" : "play"}`} onClick={this.play.bind(this)}></i>
	                			<i className="icon next ml20" onClick={this.playNext.bind(this)}></i>
                			</div>
                			<div className="-col-auto">
                				<i className={`icon repeat-${this.state.type}`} onClick={this.changeType.bind(this)}></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                		<img src={this.props.currentMusitItem.cover} alt={this.props.currentMusitItem.title}/>
                	</div>
                </div>
            </div>
    );
  }
}
