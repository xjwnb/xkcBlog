let cloudResult
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFollowInfo()
  },

  // 获取关注的数据
  async getFollowInfo() {

    let blogPersonalID = wx.getStorageSync('blogPersonal')
    cloudResult = await wx.cloud.callFunction({
      name: 'blogPersonalFindFollows',
      data: {
        blogPersonalID
      }
    })

    let follows = cloudResult.result.data.follows
    console.log(follows)

    let blogInfo = []
    follows.map(async item => {
      let _id = item
      let blog
      cloudResult = await wx.cloud.callFunction({
        name: 'blogInfoById',
        data: {
          _id
        }
      })
      blog = cloudResult.result.data
      blogInfo.push(blog)

      await this.repeatData(blogInfo)
      console.log(this.data.blogInfo)


    })
  },

  // 去重（收藏的数据）
  repeatData(follows) {

    let newFollows = follows.map(item => {
      let {
        _openid,
        userAvatar,
        userName
      } = item
      item = {
        _openid,
        userAvatar,
        userName
      }

      return item
    })
    console.log(newFollows)

    var arr1=newFollows.reduce(function(prev,element){
      if(!prev.find(el=>el._openid==element._openid)) {
        prev.push(element)
      }
      return prev
    },[])
    console.log(arr1)
    this.setData({
      blogInfo: arr1
    })
  }
})