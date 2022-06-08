/* 新增待办页面 */

Page({
  // 保存编辑中待办的信息
  data: {
    title: '',
    desc: '',
    freq: 0,
    date: '',
    head: '',
    imgPath: '',
    // bar （title这一条） 距
    barTop: 0,
    // bar 高度， bar 是 fixed
    barHeight: 0,
    // 占位高度，不是 fixed，这个高度实际就是 barTop + barHeight
    placeHolderHeight: 0,
    id: ""
  },

  //上传图片
  uploadPhoto: function () {
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success: res => {
        // console.log(res.tempFilePaths[0])
        var photoTempPath = res.tempFilePaths[0]
        this.uploadPhotoToDatabase(photoTempPath)
      }
    })
  },

  uploadPhotoToDatabase: function (photoTempPath) {
    let that = this;
    wx.showLoading({
      title: "图片上传中！"
    })
    wx.cloud.uploadFile({
      cloudPath: "photo/" + Date.now() + ".jpg",
      filePath: photoTempPath,
      success: res => {
        console.log(res.fileID);
        // 在数据库中新建待办事项，并填入已编辑对信息
        // db.collection(getApp().globalData.collectionTxt).add({
        //   data: {
        //     img: res.fileID
        //   }
        // })
        that.setData({
          imgPath:res.fileID
        })
        wx.hideLoading()
        wx.showToast({
            title: "上传成功！",
            duration: 2000,
            icon: "success"
          })
      },

      fail(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: "网络错误！",
          duration: 2000,
          icon: "error"
        })
      }
    })
    // this.setData({
    //   imgPath:fileID
    // })
  },
  // 表单输入处理函数
  onTitleInput(e) {
    this.setData({
      head: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  onAwardInput(e) {
    this.setData({
      award: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      title: e.detail.value
    })
  },
  // 保存待办
  async saveMission() {

    if (this.data.title === '') {
      wx.showToast({
        title: '日期未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.head === '') {
      wx.showToast({
        title: '标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.head.length > 8) {
      wx.showToast({
        title: '事件标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 200) {
      wx.showToast({
        title: '细节过长',
        icon: 'error',
        duration: 2000
      })
      return
    }

    var code;
    wx.login({
      success: (res) => {
        console.log(res);
        code = res.code
      }
    })

    const db = await getApp().database()
    // 在数据库中新建待办事项，并填入已编辑对信息
    db.collection(getApp().globalData.collectionTxt).add({
      data: {
        title: this.data.title, // 时间
        desc: this.data.desc, // 描述
        star: false,
        head: this.data.head,
        img: this.data.imgPath
      }
    }).then(() => {
      wx.navigateBack({
        delta: 0,
      })
    })
  },
  goback() {
    wx.navigateBack({
      delta: 0,
    })
  },
  // 重置所有表单项
  resetMission() {
    this.setData({
      title: '',
      desc: '',
      freq: 0,
      award: 0
    })
  },
  inputpic() {
    wx.showToast({
      title: '代码还没写好呢！',
      icon: 'error'
    })
  },
  async onLoad() {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var dkl = Y + "-" + M + "-" + D;
    console.log("当前时间：", dkl);
    this.setData({
      data: dkl
    })
    var that = this;
    // 获取通知栏高度
    // 获取距上
    const barTop = wx.getSystemInfoSync().statusBarHeight;
    // 获取胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 获取导航栏高度
    const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2
    // // 获取导航栏高度
    // wx.getSystemInfoAsync({
    //   success(res) {
    //     that.setData({
    //       BarHeight: res.statusBarHeight
    //     })
    //   }
    // })
    this.setData({
      barHeight,
      barTop,
      placeHolderHeight: barHeight + barTop
    })

    //对输入框内容进行校验
    // const db = await getApp().database()
    // db.collection(getApp().globalData.collectionUserList).get().then(dataGot => {
    //   const {
    //     data
    //   } = dataGot
    //   // 存储查询到的数据
    //   this.setData({
    //     id:user._id
    //   })
    // })
    // console.log("!!!");



  }

})