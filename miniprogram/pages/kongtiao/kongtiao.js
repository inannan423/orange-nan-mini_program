// miniprogram/pages/home/home.js

var a1 = wx.createInnerAudioContext()
var a2 = wx.createInnerAudioContext()
var a3 = wx.createInnerAudioContext()
//定时器编号
var timeoutNumber = 0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openType: 0, //开关状态
        temperature: 16, //温度
        modelType: 0, //空调模式
        // bar （title这一条） 距
        barTop: 0,
        // bar 高度， bar 是 fixed
        barHeight: 0,
        // 占位高度，不是 fixed，这个高度实际就是 barTop + barHeight
        placeHolderHeight: 0,
    },
    goback(){
        wx.switchTab({
          url: '../MainPage/index',
        })
    },
    //调低温度
    clickSub() {
        wx.vibrateShort();  // 1、使手机震动15ms
        this.d()
        if (this.data.temperature > 16) {
            this.setData({
                temperature: this.data.temperature - 1
            })
        } else {
            wx.showToast({
                icon: 'error',
                title: '已到最小温度啦',
            })
        }
    },
    //调高温度
    clickAdd() {
        wx.vibrateShort();  // 1、使手机震动15ms
        this.d()
        if (this.data.temperature < 31) {
            this.setData({
                temperature: this.data.temperature + 1
            })
        } else {
            wx.showToast({
                icon: 'error',
                title: '已到最大温度啦',
            })
        }
    },

    /**
     * 选择模式
     */
    selectModel(e) {
        wx.vibrateShort();  // 1、使手机震动15ms
        this.d()
        this.setData({
            modelType: e.currentTarget.dataset.t
        })
    },

    /**
     * 点击开关
     */
    clickSwitch() {
       // wx.vibrateShort();  // 1、使手机震动15ms
        this.d()
        this.setData({
            openType: !this.data.openType
        })
        if (this.data.openType == 1) {
            a2.play();
            timeoutNumber = setTimeout(() => {
                a3.play()
            }, 5000);
        } else {
            a2.stop();
            a3.stop();
            clearTimeout(timeoutNumber);
        }
    },

    //滴滴的声音
    d() {
        a1.play()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        a1.src = '/miniprogram/images/icons/1.mp3'
        a2.src = '/miniprogram/images/icons/1.mp3'
        a3.src = '/miniprogram/images/icons/1.mp3'
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '送给你一个空调，别客气热了就开哈~',
            imageUrl: '../../images/icons/a0.png'
        }
    },

    /**
     * 最重要的分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '给朋友圈的朋友们安排了空调，别客气热了就开哈~',
            imageUrl: 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM7pTA1fEtrDbAw8OZoQ5m3XBsZBhusKxGpFMlmAwNpm3g/0'
        }
    }
})