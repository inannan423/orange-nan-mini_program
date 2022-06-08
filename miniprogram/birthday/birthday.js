// birthday/birthday.js
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
      },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    goback(){
        wx.navigateBack({
          delta: 0,
        })
      },
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      console.log("?");
      const innerAudioContext = wx.createInnerAudioContext();
          innerAudioContext.autoplay = true;
          innerAudioContext.control = true;
          innerAudioContext.src = "cloud://nannan-1g1q4u2i02398ecf.6e61-nannan-1g1q4u2i02398ecf-1311679880/btd.wav"  //音频路径
          innerAudioContext.onPlay(() => {
            console.log('开始播放')
          });
          innerAudioContext.onError(res => {
            console.log(rees.errCode)
            console.log(res.errMsg)
          });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    onShareAppMessage: function (res) {
      return {
        title: '生日快乐宝贝！',
        path: '/miniprogram/birthday/birthday'
      }
    }
})