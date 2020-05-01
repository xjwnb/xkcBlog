// components/login/login.js
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

    async loginHandle(e) {
      let userInfo = e.detail.userInfo
      let openId
      await wx.cloud.callFunction({
        name: 'login'
      }).then(res => {
        openId = res.result.event.userInfo.openId
      })
      let userData = {
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        openId
      }
      wx.setStorageSync('userInfo', userData)
    }
  }
})