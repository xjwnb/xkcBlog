let cloudResult
App({
  globalData: {
    blogInfoSort: null,                   // 博客信息分类后的数据
    follows: [],                          // 关注的用户数据          
    followsSort: [],                      // 关注用户分类后的数据
    notRepeatFollowsUserInfo: [],         // 没有重复的关注的用户信息
    searchData: []                        // 搜索获得的数据
  },
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}

    this.getBlogInfoSort()


    this.getFollows()

  },

  async getBlogInfoSort() {
    // 调用 getBlogInfo 云函数 获得数据
    cloudResult = await wx.cloud.callFunction({
      name: 'getBlogInfo'
    })
    // 获得数据赋值欸变量 blogInfo
    let blogInfo = cloudResult.result.data

    let newBlogInfo = await this.sortBlogInfo(blogInfo)

    // 将分类后获得的数据 newBlogInfo 赋值给全局变量 blogInfoSort
    this.globalData.blogInfoSort = newBlogInfo
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

      this.globalData.follows = blogInfo


      this.getSortFollows()

    })
    
  },

  // 获得关注分类后的数据
  async getSortFollows() {
    let follows = this.globalData.follows
    // 去重复
    this.repeatData(follows)
    let followsSort = await this.sortBlogInfo(follows)
    this.globalData.followsSort = followsSort
  },

  // 去重（收藏的数据）
  repeatData(follows) {

    let newFollows = follows.map(item => {
      let {
        _openid,
        userAvatar,
        userName
      } = item
      item =  {
        _openid,
        userAvatar,
        userName
      }

      return item
    })


    let res = []
    let obj = {}
    newFollows.map((item, index) => {
      if (!obj[newFollows[index]]) {
        obj[newFollows[index]] = 1
        res.push(newFollows[index])
      }
    })
    this.globalData.notRepeatFollowsUserInfo = res
  }

  
})