let cloudResult
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    blogInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取 blogInfo集合 中的数据
    this.getBlogInfo()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取 blogInfo集合 中的数据
    this.getBlogInfo()
  },

  // 调用 getBlogInfo 获得 blogInfo集合 中的数据
  async getBlogInfo() {

    // 调用 getBlogInfo 云函数 获得数据
    cloudResult = await wx.cloud.callFunction({
      name: 'getBlogInfo'
    })
    // 获得数据赋值欸变量 blogInfo
    let blogInfo = cloudResult.result.data
    // 分别声明微信小程序，Java,PHP,NodeJs,人工智能的变量数组 （声明各分类存放）
    let wxBlogInfo = []
    let javaBlogInfo = []
    let phpBlogInfo = []
    let nodeBlogInfo = []
    let AIBlogInfo = []
    // 遍历 blogInfo数组 分别分类
    blogInfo.map(item => {
      if (item.sort === 'Web') {
        wxBlogInfo.push(item)
        return item
      } else if (item.sort === "Java") {
        javaBlogInfo.push(item)
        return item
      } else if (item.sort === "PHP") {
        phpBlogInfo.push(item)
        return item
      } else if (item.sort === "NodeJs") {
        nodeBlogInfo.push(item)
        return item
      } else {
        AIBlogInfo.push(item)
        return item
      }
    })
    
    // 给各个分类进行反转，以便新数据显示在第一条
    wxBlogInfo = wxBlogInfo.reverse()
    javaBlogInfo = javaBlogInfo.reverse()
    phpBlogInfo = phpBlogInfo.reverse()
    nodeBlogInfo = nodeBlogInfo.reverse()
    AIBlogInfo = AIBlogInfo.reverse()
    // 声明变量存储反转后的数组
    let newBlogInfo = [wxBlogInfo,javaBlogInfo,phpBlogInfo,nodeBlogInfo,AIBlogInfo]
    // 将数据赋值给 data 中的 blogInfo
    this.setData({
      blogInfo: newBlogInfo
    },() => {
      // app.globalData.blogInfoSort = this.data.blogInfo
      console.log(this.data.blogInfo)
    })
  },
})