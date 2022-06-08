/* 待办列表首页 */

Page({
  // 存储请求结果
  data: {
    allMissions: [], // 所有记事
    kirbyOpenId: getApp().globalData.kirbyOpenId,
    deeOpenId: getApp().globalData.deeOpenId,
    // bar （title这一条） 距
    barTop: 0,
    // bar 高度， bar 是 fixed
    barHeight: 0,
    // 占位高度，不是 fixed，这个高度实际就是 barTop + barHeight
    placeHolderHeight: 0,
  },
  async onload(){
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
  async onShow() {
    // const db = await getApp().database()
    // db.collection(getApp().globalData.collectionTxt).get().then(dataGot => {
    //   const {
    //     data
    //   } = dataGot
    //   // 存储查询到的数据
    //   data.reverse();
    //   console.log(data);
    //   this.setData({
    //     // data 为查询到的所有待办事项列表
    //     allMissions: data,
    //   })
    // })
    wx.cloud.callFunction({
      name:'getallnotes'
    }).then(res=>{
      res.result.reverse();
          this.setData({
            // data 为查询到的所有待办事项列表
            allMissions: res.result,
          })
    })
    // 配置首页左划显示的星标和删除按钮
    this.setData({
      slideButtons: [{
        extClass: 'starBtn',
        text: '星标',
        src: '../../images/list/star.png'
      }, {
        type: 'warn',
        text: '删除',
        src: '../../images/list/trash.png'
      }],
    })

  },

  // 响应左划按钮事件
  async slideButtonTap(e) {
    // 得到触发事件的待办序号
    const {
      index
    } = e.detail
    // 根据序号获得待办对象
    const missionIndex = e.currentTarget.dataset.index
    const mission = this.data.allMissions[missionIndex]
    const db = await getApp().database()
    getApp().getOpenId().then(async openid => {
      if (1) {
        // 处理星标按钮点击事件
        if (index === 0) {
          // 根据待办的 _id 找到并反转星标标识
          db.collection(getApp().globalData.collectionTxt).where({
            _id: mission._id
          }).update({
            data: {
              star: !mission.star
            }
          })
          // 更新本地数据，触发显示更新
          mission.star = !mission.star
          this.setData({
            allMissions: this.data.allMissions
          })
        }

        // 处理删除按钮点击事件
        if (index === 1) {
          // 根据待办的 _id 找到并删除待办记录
          db.collection(getApp().globalData.collectionTxt).where({
            _id: mission._id
          }).remove()
          // 更新本地数据，快速更新显示
          this.data.allMissions.splice(missionIndex, 1)
          this.setData({
            allMissions: this.data.allMissions
          })
          // 如果删除完所有事项，刷新数据，让页面显示无事项图片
          if (this.data.allMissions.length === 0) {
            this.setData({
              allMissions: [],
            })
          }
        }
      } else {
        wx.showToast({
          title: '只能编辑自己的！',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  goback:function(){
    // wx.navigateBack({
    //   delta: 1,
    // })
    // wx.navigateTo({
    //   url: '../MainPage/index',
    // })
    wx.switchTab({
      url: '../MainPage/index',
    })

  },
  // 响应左划按钮事件
  async slideButtonTapBottom(e) {
    // 得到触发事件的待办序号
    const {
      index
    } = e.detail
    // 根据序号获得待办对象
    const missionIndex = e.currentTarget.dataset.index
    const mission = this.data.allMissions[missionIndex]
    const db = await getApp().database()
    getApp().getOpenId().then(async openid => {
      if (1) {
        // 处理星标按钮点击事件
        if (index === 0) {
          // 根据待办的 _id 找到并反转星标标识
          db.collection(getApp().globalData.collectionTxt).where({
            _id: mission._id
          }).update({
            data: {
              star: !mission.star
            }
          })
          // 更新本地数据，触发显示更新
          mission.star = !mission.star
          // this.setData({
          //   finishedMissions: this.data.finishedMissions
          // })
        }

        // 处理删除按钮点击事件
        if (index === 1) {
          // 根据待办的 _id 找到并删除待办记录
          db.collection(getApp().globalData.collectionMissionList).where({
            _id: mission._id
          }).remove()
          // 更新本地数据，快速更新显示
          this.data.finishedMissions.splice(missionIndex, 1)
          this.setData({
            finishedMissions: this.data.finishedMissions
          })
          // 如果删除完所有事项，刷新数据，让页面显示无事项图片
          if (this.data.allMissions.length === 0) {
            this.setData({
              allMissions: []
            })
          }
        }
      } else {
        wx.showToast({
          title: '只能编辑自己的！',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  // 点击左侧单选框时，切换待办状态
  async finishTodo(e) {
    // 根据序号获得触发切换事件的待办
    const missionIndex = e.currentTarget.dataset.index
    const mission = this.data.allMissions[missionIndex]
    const db = await getApp().database()
    const _ = db.command
    getApp().getOpenId().then(async openid => {
      if (mission._openid != openid) {
        // 根据待办 _id，获得并更新待办事项状态
        if (mission.title != '亲亲一次') {
          console.log("不是亲亲");
          db.collection(getApp().globalData.collectionMissionList).where({
            _id: mission._id
          }).update({
            // freq == 1 表示待办已完成，不再提醒
            // freq == 0 表示待办未完成，每天提醒
            data: {
              freq: 1
            }
          })
        }

        
        if (mission.title === '亲亲一次') {
          
          console.log("亲亲++");
          db.collection(getApp().globalData.collectionUserList).where({
            _openid: openid
          }).update({
            
            data: {
              credit: _.inc(1)
            }
          })
        } else {
          // Add Credit
          console.log("非亲亲");
          db.collection(getApp().globalData.collectionUserList).where({
            _openid: openid
          }).update({
            data: {
              credit: _.inc(mission.award)
            }
          })
        }


        // 快速刷新数据
        mission.freq = 1
        this.setData({
          allMissions: this.data.allMissions.filter(mission => mission.freq === 0),
          allMissions: this.data.allMissions.filter(mission => mission.freq === 1)
        })
      } else {
        wx.showToast({
          title: '不能完成自己的任务！',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  // 跳转响应函数
  toDetailPage(e) {
    const missionIndex = e.currentTarget.dataset.index
    const mission = this.data.allMissions[missionIndex]
    wx.navigateTo({
      url: '../TxtDetail/index?id=' + mission._id,
    })
  },

  toAddPage() {
    wx.navigateTo({
      url: '../TxtAdd/index',
    })
  }
})