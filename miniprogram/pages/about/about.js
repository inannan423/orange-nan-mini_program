// pages/about/about.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
            // bar （title这一条） 距
    barTop: 0,
    // bar 高度， bar 是 fixed
    barHeight: 0,
    // 占位高度，不是 fixed，这个高度实际就是 barTop + barHeight
    placeHolderHeight: 0,
    },
    goback(){
        wx.navigateBack({
          delta: 0,
        })
      },
      onLoad: function (options) {
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
})