import WeCropper from '../../../utils/we-cropper'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50;

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width: 750,
      height: 1334,
      scale: 2,
      zoom: 8,
      cut: {
        x: (width - 375) / 2,
        y: (height - 210) / 2,
        width: 375,
        height: 210
      }
    },
    activityId: 0,//活动id
    authorName: "",
    phoneNum: "",
    worksName: "",
    temporaryVideo: ""
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    this.wecropper.getCropperImage((worksCover) => {
      if (worksCover) {
        var addParams = "";
        if (this.data.authorName) {
          addParams += "&authorName=" + this.data.authorName;
        }
        if (this.data.phoneNum) {
          addParams += "&phoneNum=" + this.data.phoneNum;
        }
        if (this.data.worksName) {
          addParams += "&worksName=" + this.data.worksName;
        }
        if (this.data.temporaryVideo) {
          addParams += "&temporaryVideo=" + this.data.temporaryVideo;
        }
        //  获取到裁剪后的图片
        wx.redirectTo({
          url: `../uploadWorks/uploadWorks?worksCover=${worksCover}&activityId=${this.data.activityId}${addParams}`
        })
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    const { cropperOpt } = this.data
    if (option.worksCover) {
      this.setData({
        activityId: option.activityId || "",
        authorName: option.authorName || "",
        phoneNum: option.phoneNum || "",
        worksName: option.worksName || "",
        temporaryVideo: option.temporaryVideo || ""
      })
      cropperOpt.src = option.worksCover
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          // console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          // console.log(`before picture loaded, i can do something`)
          // console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          // console.log(`picture loaded`)
          // console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          // console.log(`before canvas draw,i can do something`)
          // console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  },
  onUnload: function () {
  
  }
})
