Page({
    data: {

        jssj: "2021-04-02 21:15:00", //设置结束时间

        timer: "", //倒计时定时器名称

        qgdjs_jo: {
            day: "00",
            hour: "00",
            min: "00",
            sec: "00"
        },
        dym: {
            day: "00",
            hour: "00",
            min: "00",
            sec: "00"
        },
        imgURL: "",
        allMissions: [], // 用户的所有待办事项
        incompleteMissions: [], // 未完成待办事项
        finishedMissions: [], // 已完成待办事项
        kirbyOpenId: getApp().globalData.kirbyOpenId,
        deeOpenId: getApp().globalData.deeOpenId,
        display:true
    },
    gototxt:function(){
        wx.navigateTo({
          url: '../Txt/index',
        })
    },
    gotokt:function(){
        wx.navigateTo({
          url: '../kongtiao/kongtiao',
        })
    },
    gotobr:function(){
        wx.navigateTo({
          url: '../../birthday/birthday',
        })
    },
    closeit:function(){
        this.setData({
            display:false
        })
    },
    countDown: function () {
        let that = this;

        that.setData({
            timer: setInterval(function () {

                var lefttime = parseInt((-new Date(that.data.jssj.replace(/-/g, "/")).getTime() + new Date().getTime()));

                // if (lefttime <= 0) {
                //     that.setData({
                //         qgdjs_jo: {
                //             day: "00",
                //             hour: "00",
                //             min: "00",
                //             sec: "00"
                //         }
                //     })
                //     clearInterval(that.data.timer);
                //     return;
                // }

                var d = parseInt(lefttime / 1000 / 3600 / 24); //天数
                var h = parseInt(lefttime / 1000 / 3600 % 24); //小时
                var m = parseInt(lefttime / 1000 / 60 % 60); //分钟
                var s = parseInt(lefttime / 1000 % 60); //当前的秒

                d < 10 ? d = "0" + d : d;
                h < 10 ? h = "0" + h : h;
                m < 10 ? m = "0" + m : m;
                s < 10 ? s = "0" + s : s;

                that.setData({
                    qgdjs_jo: {
                        day: d,
                        hour: h,
                        min: m,
                        sec: s
                    }
                })
            }, 1000)
        })
    },
    //身份识别
    async onLoad() {
        var that = this;
        that.countDown();
        var app = getApp();
        const db = await getApp().database();
        getApp().getOpenId().then(async openid => {
          if(openid!=app.globalData.kirbyOpenId&&openid!=app.globalData.deeOpenId){
            wx.showModal({
              title: '警告',
              content: '你没有权限',
              success: function (res) {
                if (res.confirm) {//这里是点击了确定以后
                  wx.redirectTo({
                    url: '../about copy/about',
                  })
                } else {//这里是点击了取消以后
                    wx.redirectTo({
                        url: '../about copy/about',
                      })
                }
              }
            })
          }
        })
    },
    //上传文件
    upload() {
        //把this赋值给that，就相当于that的作用域是全局的。
        let that = this;
        console.log("jaj");
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                console.log("成功", res);
                that.uploadImage(res.tempFilePaths[0]);
            }
        })
    },
    uploadImage(fileURL) {
        wx.cloud.deleteFile({
            fileList: [0],
            success(res) {
                console.log(res, '删除文件')
            },
            fail(err) {
                console.log(err)
            }
        })
        wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + 'image1.png', // 上传至云端的路径
            filePath: fileURL, // 小程序临时文件路径
            success: res => {
                // 返回文件 ID
                console.log("上传成功", res)
                //获取文件路径
                this.setData({
                    imgURL: res.fileID
                })
            },
            fail: console.error
        })
        this.onLoad();
    },
    onShareAppMessage: function (res) {
        return {
          title: '生日快乐宝贝！',
          path: '/miniprogram/pages/MainPage/index'
        }
      }
})