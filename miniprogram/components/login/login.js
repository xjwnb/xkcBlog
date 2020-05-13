let cloudResult
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },


  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function () {
    if (!this.show) {
      this.onClickShow()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickShow() {
      this.setData({
        show: true
      });
    },

    onClickHide() {
      this.setData({
        show: false
      });
    },

    // 点击登录按钮
    async loginHandle(e) {
      let userInfo = e.detail.userInfo
      let openId
      await wx.cloud.callFunction({
        name: 'login'
      }).then(res => {
        openId = res.result.event.userInfo.openId
      })

      cloudResult = await wx.cloud.callFunction({
        name: 'BlogPersonalCount'
      })

      if (!cloudResult.result) {
        cloudResult = await wx.cloud.callFunction({
          name: 'blogPersonal'
        })
        cloudResult.result._id
        wx.setStorageSync('blogPersonal', cloudResult.result._id)
      }


      let userData = {
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        openId
      }
      wx.setStorageSync('userInfo', userData)
      // 获得 blogPersonal 中该用户的 _id
      cloudResult = await wx.cloud.callFunction({
        name: 'getblogPerson'
      })

      let id = cloudResult.result.data[0]._id
      wx.setStorageSync('blogPersonal', id)
    }
  }
})