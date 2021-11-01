<template>
  <div class="videoDetailCon">
    <el-row class="videoPlayCon movieCon">
      <el-col :span="24">
        <div id="videoPlayBox" :class="['videoPlayBox',!controlerShow&&isFullScreen?'noCursor':'']"
          @click="controlerShowControl(true)"
          @mousemove="controlerShowControl(true)"
          @mouseup="controlerShowControl(false)"
        >
          <!-- <video-player  id="oneVideoBox" class="video-player vjs-custom-skin videoBox"
            ref="videoPlayer" 
            :playsinline="true" 
            :options="playerOptions"
          >
          </video-player> -->
          <video ref="video" class="tryVideo"
          :autoplay="autoplay"
          :muted="videoMuted"
          @ended="videoPlayEnd()"
          @timeupdate="videoTimeUpdate()"
          @loadedmetadata="videoLoded()"
          :src="videoPlayUrl">
          </video>
          <div class="tryVideoCover">
            <div class="screenVideoTitle" v-show='controlerShow'>第{{ videoIndex }}集 {{curVideoCname}}</div>
            <div v-if="screenVideoListShow" class="videoCoverList" @mouseenter="showScreenVideoList(true)" @mouseleave="showScreenVideoList(false)">
              <ul class="infinite-list videoListCon" v-infinite-scroll="screenLoad">
                <li v-for="(item,index) in videoList" class="infinite-list-item videoCon" :key="item.id" @click="changePlayUrl(index)">
                  <div class="videoConImgBox">
                    <img class="videoConImg" :src="item.detailPic?(imgUrl+item.detailPic.picPath):videoFakeImg" alt="">
                    <img v-if="index==(videoIndex-1)" class="videoConImgBorder" src="../../assets/images/cartoonDetail/playIngFocus.png" alt="">
                  </div>
                  <div class="videoConTextBox">
                    <span class="videoConText">{{ item.videoCname }}</span>
                    <img v-if="index==(videoIndex-1)" class="videoConTextImg" src="../../assets/images/cartoonDetail/singlePlaying.png" alt="">
                  </div>
                </li>
              </ul>
            </div>
            <div class="videoControl" v-show='controlerShow'>
              <div class="ctrlLineBot"
                ref="ctrlLine"
                @mousedown.stop='progressOnDown' 
                @touchstart.stop='progressOnDown'
                @mousemove.stop='progressOnMove' 
                @touchmove.stop='progressOnMove'
                @mouseup.stop='progressOnUp' 
                @mouseout.stop='progressOnUp'
                @touchend.stop='progressOnUp'
              >
                <div class="ctrlLine" :style="{width: ctrlLinePer}"></div>
              </div>
              <img @click="videoPlay()" class="ctrlPlay" :src="videoIsPlay?videoPauseBtn:videoPlayBtn" alt="">
              <img @click="videoNext()" class="ctrlNext" src="../../assets/images/cartoonDetail/ctrlNext.png" alt="">
              <div class="ctrlTime">
                <span class="ctrlCurTime">{{videoCurTime}}</span>
                <span class="ctrlTimeDevider">/</span>
                <span class="ctrlAllTime">{{videoAllTime}}</span>
              </div>
              <div class="ctrlVoiceBox" @mouseenter="showVoiceLine(true)" @mouseleave="showVoiceLine(false)">
                <div class="ctrlVoiceBot" v-show="isVoiceCtrlShow"
                  ref="voiceProgress"
                  @mousedown.stop='voiceOnDown' 
                  @touchstart.stop='voiceOnDown'
                  @mousemove.stop='voiceOnMove' 
                  @touchmove.stop='voiceOnMove'
                  @mouseup.stop='voiceOnUp' 
                  @touchend.stop='voiceOnUp'
                >
                  <div class="ctrlVoiceLine" :style="{width: voiceProgress}"></div>
                </div>
                <img @click="setVoiceMute()" class="ctrlVoice" :src="videoMuted?voiceMuteImg:voiceImg" alt="">
              </div>
              <div class="ctrlChose" @click="showScreenVideoList(true)" v-show="isFullScreen">选集</div>
              <img @click="videoToScreen()" class="ctrlToScreen" :src="(isFullScreen?exitFullBtn:toFullBtn)" alt="">
            </div>
          </div>
        </div>
        <div class="videoListConBox" v-if="listCanShow">
          <ul class="infinite-list videoListCon" v-infinite-scroll="smallLoad">
          <li class="curVideoPlayCon" >
            <div class = "cartoonTitle">{{ cartoonDetail.cartoonCname }}</div>
            <div class = "videoCur">
              <img class="videoCurImg" src="../../assets/images/cartoonDetail/playing.png" alt="">
              第{{ videoIndex }}集 {{ curVideoCname }}
            </div>
          </li>
          <li v-for="(item,index) in videoList" class="infinite-list-item videoCon" :key="item.id" @click="changePlayUrl(index)">
            <div class="videoConImgBox">
              <img class="videoConImg" :src="item.detailPic?(imgUrl+item.detailPic.picPath):videoFakeImg" alt="">
              <img v-if="index==(videoIndex-1)" class="videoConImgBorder" src="../../assets/images/cartoonDetail/playIngFocus.png" alt="">
            </div>
            <div class="videoConTextBox">
              <span class="videoConText">{{ item.videoCname }}</span>
              <img v-if="index==(videoIndex-1)" class="videoConTextImg" src="../../assets/images/cartoonDetail/singlePlaying.png" alt="">
            </div>
          </li>
        </ul>
        </div>
      </el-col>
    </el-row>
    <el-row class="cartoonIntro">
      <el-col :span="24">
        <span class="cartoonIntroTitle">{{ cartoonDetail.cartoonCname }}</span>
        <img class="cartoonIntroImg" src="../../assets/images/cartoonDetail/content.png" alt="">
        <span @click="showIntro" class="cartoonIntroBtn">内容简介<i class="el-icon-arrow-up" v-show="!showCartoonIntro"></i><i class="el-icon-arrow-down" v-show="showCartoonIntro"></i></span>
        <span class="cartoonIntroText" v-for="tags in cartoonDetail.tagsInfoList" :key="tags.id">{{ tags.typeCname }}</span>
        <i class="equere"></i>
      </el-col>
    </el-row>
    <el-row class="cartoonIntroduction" v-show="showCartoonIntro">
      <el-col :span="24">
        <div class="cartoonIntroductionTitle">{{ cartoonDetail.cartoonCname }}</div>
        <div class="cartoonIntroductionText">概要：{{ cartoonDetail.cartoonIntroduction }}</div>
      </el-col>
    </el-row>
    <!-- 正在热播 -->
    <el-row class = "cartoonRec fourPart" v-if="commpageInfo.recommend_1">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="fourPartTitleImg hotViewTitleImg" v-if="(commpageInfo.recommend_1&&commpageInfo.recommend_1[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_1&&commpageInfo.recommend_1[0].recommendPic.picPath)" alt="">
            <span class="fourPartTitleText">{{ (commpageInfo.recommend_1&&commpageInfo.recommend_1[0].more1) }}</span>
            <img class="fourPartTitleImg hotViewTitleImg" v-if="(commpageInfo.recommend_1&&commpageInfo.recommend_1[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_1&&commpageInfo.recommend_1[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class="fourPartSingle" v-for="(rec1) in (commpageInfo.recommend_1&&commpageInfo.recommend_1.slice(1,5))" :key="rec1.id">
            <img @click="clickJump(rec1)" class="fourPartImg" :src="imgUrl+rec1.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec1.recommendDisplayName">{{ rec1.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec1.detailedDescription">{{ rec1.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
    <!-- 为你推荐 -->
    <el-row class = "cartoonRec fourPart" v-if="commpageInfo.recommend_2">
        <el-row class = "mainDownBoxTitle">
          <el-col :span="24">
            <img class="fourPartTitleImg hotViewTitleImg" v-if="(commpageInfo.recommend_2&&commpageInfo.recommend_2[0].recommendPic)" :src="imgUrl+(commpageInfo.recommend_2&&commpageInfo.recommend_2[0].recommendPic.picPath)" alt="">
            <span class="fourPartTitleText">{{ (commpageInfo.recommend_2&&commpageInfo.recommend_2[0].more1) }}</span>
            <img class="fourPartTitleImg hotViewTitleImg" v-if="(commpageInfo.recommend_2&&commpageInfo.recommend_2[0].recommendLabelpic)" :src="imgUrl+(commpageInfo.recommend_2&&commpageInfo.recommend_2[0].recommendLabelpic.picPath)" alt="">
          </el-col>
        </el-row>
        <el-col :span="24">
          <div class="fourPartSingle" v-for="(rec2) in (commpageInfo.recommend_2&&commpageInfo.recommend_2.slice(1,5))" :key="rec2.id">
            <img @click="clickJump(rec2)" class="fourPartImg" :src="imgUrl+rec2.recommendPic.picPath" alt="">
            <div class="mainCartoonTitle" :title="rec2.recommendDisplayName">{{ rec2.recommendDisplayName }}</div>
            <div class="mainCartoonCon" :title="rec2.detailedDescription">{{ rec2.detailedDescription }}</div>
          </div>
        </el-col>
    </el-row>
  </div>
</template>
<script>
import 'video.js/dist/video-js.css'
export default{
  name: 'videoDetail',
  components: {
  },
  data () {
    return {
      isFullScreen: false,
      controlerShow: false,//是否显示控制栏
      controlerShowTimer: null,//控制栏显示定时器
      toFullBtn: require('../../assets/images/cartoonDetail/ctrlToScreen.png'),
      exitFullBtn: require('../../assets/images/cartoonDetail/ctrlExitScreen.png'),
      autoplay: true,
      videoCurTime: '00:00',
      videoAllTime: '00:00',
      ctrlLinePer: '0%',
      ctrlLineMoving: false,//进度条是否在拖动
      videoIsPlay: false,
      videoPlayBtn: require('../../assets/images/cartoonDetail/ctrlPlay.png'),
      videoPauseBtn: require('../../assets/images/cartoonDetail/ctrlPause.png'),
      screenVideoListShow: false,
      isVoiceCtrlShow: false,
      videoVolume: 0.5,
      voiceLineMoving: false,
      voiceProgress: '50%',//音量大小
      voiceImg: require('../../assets/images/cartoonDetail/ctrlVoice.png'),
      voiceMuteImg: require('../../assets/images/cartoonDetail/ctrlMute.png'),
      videoMuted: false,
      isVoiceCtrlShow: false,
      imgUrl: window.configs.pic_BASEURL,
      pageEName: 'cartoonDetail_PC',//页面英文名称
      commpageInfo: '',//页面配置信息
      cartoonId: '35',//当前卡通id
      cartoonDetail: '',//当前卡通详情
      loadVideoId: '',
      videoList: [],//当前卡通的视频列表
      listCanShow: false,
      videoFakeImg: require('../../assets/images/cartoonDetail/fakerDetail.png'),
      videoPlayUrl: 'http://112.25.69.62:8092/video/xhbhysm/xhbhysm01.mp4',//当前播放视频地址
      renderVideoList: [],//右侧列表渲染用数组
      renderInitLength: 6,//列表初始渲染长度
      screenRenderVideoList: [],//全屏右侧列表渲染用数组
      screenRenderInitLength: 12,//全屏列表初始渲染长度
      videoIndex: 1,//当前正在播放第几集视频
      curVideoCname: "",//当前播放视频的中文名
      showCartoonIntro: true,//是否展示卡通介绍
      /*playerOptions: {//播放器设置
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4',//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: 'http://112.25.69.62:8092/video/xhbhysm/xhbhysm01.mp4' //url地址
        }],
        poster: '', //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,//当前时间和持续时间的分隔符
          durationDisplay: true,//时长显示
          currentTimeDisPlay: true,//当前时间
          playToggle: true,//暂停和播放键
          progressControl: true,//进度条
          remainingTimeDisplay: false,//剩下时间
          fullscreenToggle: true,  //全屏按钮
          ChaptersButton: true
        }
      }*/
    }
  },
  methods: {
    getCommPageInfo(ename){
      let _this = this;
      if(ename){
        this.pageEName = ename
      }
      this.$store.dispatch('getCommpageInfo',{contentName: this.pageEName}).then(res => {
        if(res && res.data && res.data.data){
          _this.commpageInfo = res.data.data;
        }
      });
    },
    getCartoonDetail(cartoonId) {
      var _this = this;
      if(cartoonId){
        this.cartoonId = cartoonId;
      }
      this.$store.dispatch('getCartoonDetail',{id: this.cartoonId}).then(res =>{
        if(res && res.data && res.data.data){
          _this.cartoonDetail = res.data.data;
        }
      });
    },
    getVideoList(cartoonId) {
      var _this = this;
      if(cartoonId){
        this.cartoonId = cartoonId;
      }
      this.listCanShow = false;
      _this.renderVideoList = [];
      // _this.renderInitLength = 0;
      _this.screenRenderVideoList = [];
      // _this.screenRenderInitLength = 0;
      this.$store.dispatch('getVideoList',{cartoonId: this.cartoonId}).then(res =>{
        if(res && res.data && res.data.data && res.data.data.length > 0){
          _this.videoList = res.data.data;
          // _this.smallLoad();
          // _this.screenLoad();
          if(_this.loadVideoId){
            for(let i = 0; i < _this.videoList.length; i++){
              if(_this.videoList[i].id == _this.loadVideoId){
                _this.videoIndex = i + 1;
                break;
              }
            }
            _this.loadVideoId = '';
          }
          if(_this.videoIndex > _this.videoList.length){
            _this.videoIndex = 1;
          }
          _this.curVideoCname = _this.videoList[_this.videoIndex - 1].videoCname;
          if(_this.videoList[_this.videoIndex - 1].movieDetails[0].playUrl){
            _this.videoPlayUrl = _this.videoList[_this.videoIndex - 1].movieDetails[0].playUrl
          }
          _this.listCanShow=true;
          _this.$store.dispatch('setUserView',{
            userId: _this.$store.state.userInfo.id,
            contentId: _this.cartoonId,
            contentType: 1,
            playType: 0,
            videoId: _this.videoList[_this.videoIndex-1].id}).then(res);
        }
      });
    },
    changePlayUrl(videoIndex){
      var _this = this;
      if(this.videoIndex == videoIndex + 1)return;
      this.videoIndex = parseInt(videoIndex) + 1;
      this.videoPlayUrl = this.videoList[videoIndex].movieDetails[0].playUrl;
      this.curVideoCname = this.videoList[videoIndex].videoCname;
      localStorage.setItem('videoIndex',this.videoIndex);
      this.videoIsPlay=true;
      this.$store.dispatch('setUserView',{
          userId: _this.$store.state.userInfo.id,
          contentId: _this.cartoonId,
          contentType: 1,
          playType: 0,
          videoId: _this.videoList[_this.videoIndex-1].id}).then();
    },
    smallLoad(){
      // if(this.videoList.length > 0){
      //   this.renderInitLength = this.renderVideoList.length;
      //   this.renderInitLength += 5;
      //   if(this.renderInitLength > this.videoList.length){
      //     this.renderInitLength = this.videoList.length;
      //   }
      //   for(let i = this.renderVideoList.length; i < this.renderInitLength; i++){
      //     this.renderVideoList.push(this.videoList[i]);
      //   }
      // }
    },
    screenLoad(){
      // if(this.videoList.length > 0){
      //   this.screenRenderInitLength = this.screenRenderVideoList.length;
      //   this.screenRenderInitLength += 12;
      //   if(this.screenRenderInitLength > this.videoList.length){
      //     this.screenRenderInitLength = this.videoList.length;
      //   }
      //   for(let i = this.screenRenderVideoList.length; i < this.screenRenderInitLength; i++){
      //     this.screenRenderVideoList.push(this.videoList[i]);
      //   }
      // }
    },
    showIntro(){
      this.showCartoonIntro = !this.showCartoonIntro;
    },
    clickJump(recJson){
      let cartoonId = recJson.recommendDisplayValue;
      if(cartoonId != this.cartoonId){
        this.cartoonId = cartoonId;
        this.videoIndex = 1;
        localStorage.setItem('cartoonId',this.cartoonId);
        localStorage.setItem('loadVideoId',this.loadVideoId);
        this.getCartoonDetail();
        this.getVideoList();
      }
      // 让页面回到顶部
      document.documentElement.scrollTop = 0
    },
    videoLoded(){
      // 设置初始音量
      if(this.$refs.video){
        if(this.videoVolume && !this.videoMuted){
          this.$refs.video.volume = this.videoVolume;
        }
        this.setVoice()
        //设置总时长
        this.videoAllTime = this.formatTime(this.$refs.video.duration);
        this.videoIsPlay = true;
      }
    },
    videoPlay(){
      if(this.videoIsPlay){
        this.$refs.video.pause();
        this.videoIsPlay = false;
      }else{
        this.$refs.video.play();
        this.videoIsPlay = true;
      }
      this.controlerShowControl(true);
    },
    videoNext(){
      if(this.videoIndex < this.videoList.length){
        this.changePlayUrl(this.videoIndex);
      }
    },
    controlerShowControl(state){
      if (state) {
        clearTimeout(this.controlerShowTimer);
        this.controlerShowTimer = setTimeout(() => {
            if (this.videoIsPlay) {
                this.controlerShow = false;
            }           
        },3000)
      }
      this.controlerShow = state;
    },
    setVoice(){
      this.videoMuted = false;
      this.$refs.video.volume = this.videoVolume;
    },
    setVoiceMute(){
      if(!this.videoMuted){
        this.videoMuted = true;
        this.videoVolume = 0;
        this.$refs.video.volume = this.videoVolume;
        this.voiceProgress = '0%';
      }else{
        this.videoMuted = false;
        this.videoVolume = 0.5;
        this.$refs.video.volume = this.videoVolume;
        this.voiceProgress = '50%';
      }
    },
    showVoiceLine(state){
      this.isVoiceCtrlShow = state;
    },
    updateVoice(ePageX){
      this.videoMuted = false;
      let progressRect = this.$refs.voiceProgress.getBoundingClientRect();
      var percent = 100 * (ePageX - progressRect.x) / progressRect.width;
      if(percent > 100) {
          percent = 100;
      }
      if(percent < 0) {
          percent = 0;
          this.mutedState = true;
      } else {
          this.mutedState = false;
      }
      this.voiceProgress = percent * 1 + "%";
      this.videoVolume = percent / 100;
      this.$refs.video.volume = this.videoVolume;
    },
    voiceOnDown(e){
      this.voiceLineMoving = true;
      this.updateVoice(e.pageX || e.changedTouches[0].pageX);
    },
    voiceOnMove(e){
      if (this.voiceLineMoving) {
        this.updateVoice(e.pageX || e.changedTouches[0].pageX);
      }
    },
    voiceOnUp(e){
      if (this.voiceLineMoving) {
        this.updateVoice(e.pageX || e.changedTouches[0].pageX);
        this.voiceLineMoving = false;
      }
    },
    formatTime(seconds) {
      var minute = Math.floor(seconds / 60);
      if(minute < 10) {
          minute = "0" + minute;
      }
      var second = Math.floor(seconds % 60);
      if(second < 10) {
          second = "0" + second;
      }
      return minute + ":" + second;
    },
    videoTimeUpdate(){
      if(this.$refs.video){
        let currentTime = this.$refs.video.currentTime;
        let duration = this.$refs.video.duration;
        let progress = currentTime / duration * 100;
        this.videoCurTime = this.formatTime(currentTime);
        this.ctrlLinePer = progress + '%';
      }
    },
    progressOnDown(e){
      this.ctrlLineMoving=true;
      this.progressUpDate(e.pageX)
    },
    progressOnMove(e){
      if (this.ctrlLineMoving) {
        this.progressUpDate(e.pageX || e.changedTouches[0].pageX);
      }
    },
    progressOnUp(e){
      if (this.ctrlLineMoving) {
        this.ctrlLineMoving = false;
        this.progressUpDate(e.pageX || e.changedTouches[0].pageX);
      }
    },
    progressUpDate(ePageX){
      let progressRect = this.$refs.ctrlLine.getBoundingClientRect();
      var percent = 100 * (ePageX - progressRect.x) / progressRect.width;
      if(percent > 100) {
          percent = 100;
      }
      if(percent < 0) {
          percent = 0;
      }
      this.ctrlLinePer = percent*0.996 + "%";
      this.videoCurTime = this.formatTime(this.$refs.video.duration * percent / 100);
      this.$refs.video.currentTime = this.$refs.video.duration * percent / 100;
    },
    keyToPress(state){
      if(!this.isFullScreen)return;
      let curTime = this.$refs.video.currentTime;
      if(state=='left'){
        if(curTime >= 20){
          curTime -= 20;
          this.$refs.video.currentTime = curTime;
          this.videoCurTime = this.formatTime(this.$refs.video.currentTime);
        }
      }else{
        if(curTime < this.$refs.video.duration){
          curTime += 20;
          this.$refs.video.currentTime = curTime;
          this.videoCurTime = this.formatTime(this.$refs.video.currentTime);
        }
      }
    },
    keyToVoice(state){
      if(!this.isFullScreen)return;
      if(state=='up'){
        if(this.videoVolume < 1){
          this.videoVolume += 0.1;
        }
      }else{
        if(this.videoVolume > 0){
          this.videoVolume -= 0.1;
        }
      }
      if(this.videoVolume > 1)this.videoVolume = 1;
      if(this.videoVolume < 0)this.videoVolume = 0;
      this.$refs.video.volume = this.videoVolume;
      this.voiceProgress = (this.videoVolume*100) + '%';
    },
    showScreenVideoList(state){
      this.screenVideoListShow = state;
    },
    videoPlayEnd(){
      this.videoIsPlay =false;
      this.videoNext();
    },
    videoToScreen(){
      if(this.isFullScreen){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        this.isFullScreen = false;
      }else{
        let ele = document.getElementById('videoPlayBox');
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
        }
        this.isFullScreen = true;
      }
    }
  },
  created(){
    var _this = this;
    this.cartoonId = this.$route.params.cartoonId?this.$route.params.cartoonId:(localStorage.getItem('cartoonId')||this.cartoonId);
    this.videoIndex = this.$route.params.videoIndex?(parseInt(this.$route.params.videoIndex)+1):(localStorage.getItem('videoIndex')||1);
    this.loadVideoId = this.$route.params.videoId?(this.$route.params.videoId):(localStorage.getItem('loadVideoId')||'');
    if(this.cartoonId){
       localStorage.setItem('cartoonId',this.cartoonId);
    }
    if(this.videoIndex){
       localStorage.setItem('videoIndex',this.videoIndex);
    }
    if(this.loadVideoId){
       localStorage.setItem('loadVideoId',this.loadVideoId);
    }
    this.getCommPageInfo();
    this.getCartoonDetail();
    this.getVideoList();
    document.onkeydown = function(e){
      switch(e.key){
        case 'ArrowLeft':
          _this.keyToPress('left');
          break;
        case 'ArrowRight':
          _this.keyToPress('right');
          break;
        case 'ArrowUp':
          _this.keyToVoice('up')
          break;
        case 'ArrowDown':
          _this.keyToVoice('down')
          break;
        default:
          break;
      }
    }
  },
  watch: {
    videoPlayUrl(){
      this.controlerShowControl(true);
    }
  },
  mounted(){
  }
}
</script>
<style>
  .noCursor{ 
    /* cursor: url('~@/assets/images/cartoonDetail/empty.png'); */
    cursor: none;
  } 
  .videoDetailCon{
    width: 1920px;
    font-family: Source Han Sans CN;
  }
  .videoDetailCon .videoPlayCon{
    padding-left: 145px;
    padding-right: 145px;
  }
  .video-js .vjs-icon-placeholder{
    width: 100%;
    height: 100%;
    display: block;
  }
  .videoDetailCon .movieCon{
    background: #1E1E24;
  }
  .videoDetailCon .videoPlayBox{
    float: left;
    width: 1292px;
    height: 729px;
    position: relative;
  }
  .videoDetailCon .videoPlayBox .tryVideo{
    width: 100%;
    height: 100%;
  }
  .videoDetailCon .videoPlayBox .tryVideoCover{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .videoDetailCon .videoPlayBox .tryVideoCover .screenVideoTitle{
    width: 100%;
    height: 70px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 70px;
    font-weight: 500;
    color: #ECECEC;
    font-size: 22px;
  }
  .videoDetailCon .videoPlayBox .videoControl{
    width: 100%;
    height: 55px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(36, 34, 34, 0.2);
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlLineBot{
    width: 100%;
    height: 4px;
    position: absolute;
    top: 0;
    left: 0;
    background: #FFFFFF;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlLineBot .ctrlLine{
    width: 5%;
    height: 4px;
    position: absolute;
    top: 0;
    left: 0;
    background: #4CD5FF;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlPlay{
    width: 17px;
    height: 21px;
    position: absolute;
    top: 16px;
    left: 26px;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlNext{
    width: 21px;
    height: 21px;
    position: absolute;
    top: 16px;
    left: 72px;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlTime{
    width: 100px;
    height: 25px;
    line-height: 25px;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    position: absolute;
    top: 15px;
    left: 110px;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlChose{
    width: 60px;
    height: 24px;
    float: right;
    margin-top: 15px;
    margin-right: 5px;
    background: #000000;
    font-weight: 500;
    color: #ECECEC;
    font-size: 16px;
    text-align: center;
    border-radius: 12px;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlVoiceBox{
    /* width: 150px; */
    height: 55px;
    margin-right: 80px;
    float: right;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlVoiceBox .ctrlVoice{
    width: 21px;
    height: 21px;
    float: right;
    margin-top: 16px;
    margin-right: 5px; 
    transition: 0.5s;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlVoiceBox .ctrlVoiceBot{
    width: 100px;
    height: 3px;
    margin-top: 24px;
    background: #FFFFFF;
    border-radius: 2px;
    float: right;
    transition: 0.5s;
    position: relative;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlVoiceBot .ctrlVoiceLine{
    width: 50%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #4CD5FF;
    border-radius: 2px;
  }
  .videoDetailCon .videoPlayBox .videoControl .ctrlToScreen{
    width: 21px;
    height: 21px;
    position: absolute;
    top: 16px;
    right: 28px;
  }
  .videoDetailCon .videoPlayBox .videoCoverList{
    width: 337px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
  }
  .videoDetailCon .videoListBox{
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .videoDetailCon .videoListConBox{
    overflow: hidden;
    width: 337px;
    height: 729px;
    float: left;
  }
  .videoDetailCon .videoListCon{
    width: 360px;
    height: 100%;
    color: #BCBDBF;
    background: #333b42;
    overflow-y: scroll;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-inline-start: 0;
  }
  .videoDetailCon .videoListCon .curVideoPlayCon{
    height: 105px;
  }
  .videoDetailCon .videoListCon .videoCon{
    width: 318px;
    height: 90px;
    padding-left: 19px;
    margin-bottom: 17px;
    text-align: left;
  }
  .videoDetailCon .videoListCon .videoCon .videoConImgBox{
    width: 160px;
    height: 90px;
    float: left;
    position: relative;
  }
  .videoDetailCon .videoListCon .videoCon .videoConImgBox .videoConImg{
    width: 160px;
    height: 90px;
    border-radius: 6px;
  }
  .videoDetailCon .videoListCon .videoCon .videoConImgBox .videoConImgBorder{
    width: 160px;
    height: 90px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .videoDetailCon .videoListCon .videoCon .videoConTextBox{
    padding-left: 18px;
    float: left;
    width: 140px;
    height: 90px;
    position: relative;
  }
  .videoDetailCon .videoListCon .videoCon .videoConTextBox .videoConText{
    display: inline-block;
    font-weight: 500;
    color: #BCBDBF;
    font-size: 15px;
  }
  .videoDetailCon .videoListCon .videoCon .videoConTextBox .videoConTextImg{
    width: 18px;
    height: 20px;
    position: absolute;
    bottom: 0px;
    left: 19px;
  }
  .videoDetailCon .videoListCon .videoCon .videoConText:hover{
    color: #00BBBF;
  }
  .videoDetailCon .videoListCon .cartoonTitle{
    /* height: 25px; */
    margin-top: 20px;
    margin-left: 19px;
    line-height: 25px;
    text-align: left;
    font-weight: 500;
    font-size: 22px;
    color: #FFFFFF;
  }
  .videoDetailCon .videoListCon .videoCur{
    line-height: 22px;
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    color: #BDBDBF;
    margin-top: 23px;
  }
  .videoDetailCon .videoListCon .videoCur .videoCurImg{
    float: left;
    margin-left: 21px;
  }
  .videoDetailCon .videoListCon .videoCur .videoCurText{
    display: inline-block;
  }
  .videoDetailCon .cartoonIntro{
    height: 126px;
    padding-left: 145px;
    padding-right: 145px;
    background: #1E1E24;
  }
  .videoDetailCon .cartoonIntrolabel{
    margin-top: 15px;
  }
  .videoDetailCon .cartoonIntro span{
    display: inline-block;
    height: 16px;
    line-height: 16px;
  }
  .videoDetailCon .cartoonIntro .cartoonIntroTitle{
    display: block;
    height: 26px;
    line-height: 26px;
    color: #FFFFFF;
    text-align: left;
    font-size: 24px;
    margin-top: 22px;
  }
  .videoDetailCon .cartoonIntro .cartoonIntroImg{
    width: 15px;
    height: 17px;
    float: left;
    margin-top: 14px;
  }
  .videoDetailCon .cartoonIntro .cartoonIntroBtn{
    float: left;
    color: #45BBD5;
    font-size: 16px;
    margin-top: 14px;
    font-weight: 400;
  }
  .videoDetailCon .cartoonIntro .cartoonIntroText{
    float: left;
    color: #E7E7E7;
    font-size: 14px;
    margin-left: 14px;
    margin-top: 14px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
  .videoDetailCon .cartoonIntroduction{
    padding-left: 145px;
    padding-right: 145px;
    text-align: left;
    font-size: 30px;
  }
  .videoDetailCon .cartoonIntroduction .cartoonIntroductionTitle{
    margin-top: 14px;
    height: 30px;
    font-size: 30px;
    font-weight: 500;
    color: #333333;
    line-height: 25px;
  }
  .videoDetailCon .cartoonIntroduction .cartoonIntroductionText{
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    margin-top: 16px;
  }
  .videoDetailCon .fourPart{
    width: 1920px;
    padding-left: 145px;
    padding-right: 146px;
  }
  .videoDetailCon .fourPart .fourPartTitleImg{
    float: left;
  }
  .videoDetailCon .fourPart .fourPartTitleText{
    height: 100%;
    display: inline-block;
    /* margin-left: 12px;
    margin-right: 12px; */
  }
  .videoDetailCon .fourPart .fourPartSingle{
    width: 392px;
    height: 270px;
    float: left;
    margin-left: 20px;
  }
  .videoDetailCon .fourPart .fourPartSingle:nth-child(1){
    margin-left: 0;
  }
  .videoDetailCon .fourPartImg{
    width: 392px;
    height: 210px;
    border-radius: 8px;
    transition-duration: .5s;
  }
  .videoDetailCon .fourPartImg:hover{
    transform: scale(1.05, 1.05);
    -webkit-transform: scale(1.05, 1.05);
    -moz-transform: scale(1.05, 1.05);
    -o-transform: scale(1.05, 1.05);
  }
   .videoDetailCon .mainCartoonTitle{
    height: 16px;
    line-height: 16px;
    margin-top: 14px;
    text-align: left;
    font-weight: 400;
    color: #111111;
    font-size: 16px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .videoDetailCon .mainCartoonCon{
    height: 15px;
    line-height: 15px;
    margin-top: 14px;
    text-align: left;
    font-weight: 400;
    color: #999999;
    font-size: 15px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .videoDetailCon .equere{
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: 220px;
    border: 10px solid;
    border-color: transparent transparent white;
  }
  /* 修改视频播放器样式 */
  /*当前播放时长显示*/
  .video-js .vjs-current-time, .vjs-no-flex .vjs-current-time {
    display: block;
    padding-right: 0em;
  }
  /* 播放时长与总时长分隔符 */
  /* video-js .vjs-time-control {
    -webkit-box-flex: none;
    -ms-flex: none;
    flex: none;
    font-size: 1em;
    line-height: 3em;
    min-width: 0.5em;
    width: auto;
    padding-left: 0em;
    padding-right: 0em;
  } */
  .vjs-control-bar .vjs-time-divider {
    display: block;
    -webkit-box-flex: none;
    -ms-flex: none;
    flex: none;
    font-size: 1em;
    line-height: 3em;
    min-width: 0.5em;
    width: auto;
    padding-left: 0em;
    padding-right: 0em;
  }
  /* 当前播放总时长显示 */
  .video-js .vjs-duration, .vjs-no-flex .vjs-duration {
    display: block;
    padding-left: 0em;
  }
</style>