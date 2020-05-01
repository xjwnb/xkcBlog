const db = wx.cloud.database()
const blogRecommend = db.collection('blogRecommend')
const blogInfo = db.collection('blogInfo')
let cloudResult 
Page({
  data: {
    swiperInfo: [],   // swiper 中的数据
    isLogin: false,   // 登录状态
    blogInfo: []
  },
  onLoad: function (options) {

    // 初始化获得 swiperInfo 数据
    this.swiperInfo()

    // 是否已经登录
    this.checkLogin()

    // 初始化获得 blogInfo 数据
    this.getBlogInfoByDB()

  },
  // 生命周期
  onShow: function() {
    // 切换页面执行获得 blogInfo 数据
    // this.getBlogInfoByDB()
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    // 刷新获取 blogInfo数据
    this.getBlogInfoByDB(res => {
      wx.stopPullDownRefresh()
      this.pageData.skip = 0
    })
  },

  // 获取集合 blogRecommend 中的数据并赋值给 swiperInfo
  swiperInfo: function () {
    blogRecommend.get()
      .then(res => {
        this.setData({
          swiperInfo: res.data
        })
      })
  },
  // 检查是否登录
  checkLogin() {
    let storageData = wx.getStorageSync('userInfo')
    if (storageData) {
      this.setData({
        isLogin: true
      })
    }
  },
  // 获取 blogInfo 数据库
  async getBlogInfoByDB(callback) {
    if (!callback) {
      callback = res => {}
    }
    blogInfo.skip(this.pageData.skip).get().then(res => {
      console.log(res.data)
      let oldData = this.data.blogInfo
      this.setData({
        blogInfo: oldData.concat(res.data)
      },() => {

        this.pageData.skip += 10
        callback()
      })
    })


/*     cloudResult = await wx.cloud.callFunction({
      name: 'getBlogInfo'
    })
    let blogInfo = cloudResult.result.data
    this.setData({
      blogInfo
    },() => {
      callback()
    }) */
  },

  // 指定分页
  pageData: {
    skip: 0
  }
})