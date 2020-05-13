let cloudResult
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: '1',
    blogInfo: [],
    follows: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.getFollows()

  },



  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },

  // 获得收藏的数据
  async getFollows() {
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

      this.setData({
        follows: blogInfo
      })


      this.getSortFollows()

    })
    
  },



    // 获得关注分类后的数据
    async getSortFollows() {
      let follows = this.data.follows
      let followsSort = await this.sortBlogInfo(follows)
      this.setData({
        blogInfo: followsSort
      })
    },

    sortBlogInfo(blogInfo) {
      let wxBlogInfo = []
      let javaBlogInfo = []
      let phpBlogInfo = []
      let nodeBlogInfo = []
      let AIBlogInfo = []
      // 遍历 blogInfo数组 分别分类
      blogInfo.map(item => {
        if (item.sort === '微信小程序') {
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
      let newBlogInfo = [wxBlogInfo, javaBlogInfo, phpBlogInfo, nodeBlogInfo, AIBlogInfo]
      let newBlog = newBlogInfo.filter(item => {
        if (item.length) {
          return true
        }
        return false
      })
      return newBlog
    },

})