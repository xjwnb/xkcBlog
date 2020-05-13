let cloudResult
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogInfo: [],
    userAvatar: '',
    userName: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 传递 openid 获得对应的数据
    this.getBlogInfoByOpenID(options.openID)
  },

  // 利用 openid 获得 blogInfo集合 对应数据
  async getBlogInfoByOpenID(_openid) {
    // 调用 云函数getBlogInfoByOpenID 并传递 openid 作为参数
    cloudResult = await wx.cloud.callFunction({
      name: 'getBlogInfoByOpenID',
      data: {
        _openid
      }
    })
    // 从 blogInfo集合 中根据 openid 查询出对应的数据列
    let blogInfo = cloudResult.result.list
    
    // 获得的数据赋值给 data 中的 blogInfo 
    this.setData({
      blogInfo
    })

    // 结构获得用户名和用户头像
    let {
      userName,
      userAvatar
    } = this.data.blogInfo[0]

    let userInfo = {
      userAvatar,
      userName
    }
    // 将获得的用户信息赋值给 data 中的 userInfo
    this.setData({
      userInfo
    })
  }

})