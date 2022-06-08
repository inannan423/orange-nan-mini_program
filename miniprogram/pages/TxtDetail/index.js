/* 待办详情组件 */

Page({
  // 保存展示待办的 _id 和详细信息
  data: {
    _id: '',
    todo: {
      title: ''
    },
    img:'',
    // bar （title这一条） 距
    barTop: 0,
    // bar 高度， bar 是 fixed
    barHeight: 0,
    // 占位高度，不是 fixed，这个高度实际就是 barTop + barHeight
    placeHolderHeight: 0,
  },
  goback(){
    wx.navigateTo({
      url: '../Txt/index',
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      urls: [current],
      showmenu: true
    })
  } ,
  onLoad(options) {
    // 保存上一页传来的 _id 字段，用于后续查询待办记录
    if (options.id !== undefined) {
      this.setData({
        _id: options.id
      })
    }
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
  },

  // 根据 _id 值查询并显示待办数据
  async onShow() {
    if (this.data._id.length > 0) {
      const db = await getApp().database()
      // 根据 _id 值查询数据库中对应的待办事项
      db.collection(getApp().globalData.collectionTxt).where({
        _id: this.data._id
      }).get().then(res => {
        // 解包获得待办事项
        const {
          data: [todo]
        } = res
        // 将数据保存到本地、更新显示
        this.setData({
          todo
        })
        this.setData({
          img:todo.img
        })
      })
    }
  },
})