/* 新增待办页面 */

Page({
  // 保存编辑中待办的信息
  data: {
    title: '',
    desc: '',
    freq: 0,
    award: 0,
    date:"",
    // bar （title这一条） 距
    barTop: 0,
    // bar 高度， bar 是 fixed
    barHeight: 0,
    // 占位高度，不是 fixed，这个高度实际就是 barTop + barHeight
    placeHolderHeight: 0,
    id:""
  },
  
  // 表单输入处理函数
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
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

  // 保存待办
  async saveMission() {
    
    if (this.data.title === '') {
      wx.showToast({
        title: '事项标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.title.length > 10) {
      wx.showToast({
        title: '任务标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: '任务描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.award <= 0) {
      wx.showToast({
        title: '请填写奖励！',
        icon: 'error',
        duration: 2000
      })
      return
    }

    const db = await getApp().database()
    // 在数据库中新建待办事项，并填入已编辑对信息
    db.collection(getApp().globalData.collectionMissionList).add({
      data: {
        award: Number(this.data.award),
        title: this.data.title, // 待办标题
        desc: this.data.desc, // 待办描述
        freq: Number(this.data.freq), // 待办完成情况（提醒频率）
        star: false,
        date:this.data.date
      }
    }).then(() => {
      wx.navigateBack({
        delta: 0,
      })
    })
  },
  goback(){
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
      date: dkl
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
