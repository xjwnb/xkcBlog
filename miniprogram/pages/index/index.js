const db = wx.cloud.database()
const blogRecommend = db.collection('blogRecommend')
const blogInfo = db.collection('blogInfo')
let cloudResult
let blogInfoData // 初始化 blogInfo 数据以便后面添加数据
let numLook = 1
let searchData = []
let app = getApp()
Page({
  data: {
    swiperInfo: [], // swiper 中的数据
    isLogin: false, // 登录状态
    blogInfo: [],
    blogNumPage: 1, // 当前页数
    blogPage: 10, // 每页多少条
    show: false, // 搜索栏下面的弹出框状态
    option: [],
    value: 0
  },
  onLoad: function (options) {

    // 初始化获得 swiperInfo 数据
    this.swiperInfo()

    // 是否已经登录
    this.checkLogin()

    // 初始化获得 blogInfo 数据
    this.getBlogInfoByDB()

    console.log('onload')
  },

  async onShow() {
    console.log('onshow')
    // console.log(this.data.swiperInfo)
    // 调用 getBlogInfo 云函数获取 blogInfo 集合的数据
    cloudResult = await wx.cloud.callFunction({
      name: 'getBlogInfo'
    })

    // 将 getBlogInfo 云函数获取到的数据库信息赋值给全局变量 blogInfoData
    blogInfoData = cloudResult.result.data.reverse()
    this.setData({
      blogInfo: []
    })
    console.log(blogInfoData)
    this.setData({
      blogInfo: blogInfoData
    })

  },

  // 下拉刷新
  onPullDownRefresh: function () {
    // 增加当前页面数
    this.setData({
      blogNumPage: this.data.blogNumPage + 1
    })

    // 执行分页刷新操作
    this.getBlogInfoByDB(res => {
      wx.stopPullDownRefresh()
    })
  },
  // 上拉刷新
  onReachBottom: function () {
    this.setData({
      blogNumPage: this.data.blogNumPage + 1
    })

    // 执行分页刷新操作
    this.getBlogInfoByDB()
  },

  // 获取集合 blogRecommend 中的数据并赋值给 swiperInfo
  swiperInfo: function () {
    blogRecommend.get()
      .then(res => {
        this.setData({
          swiperInfo: res.data
        })
        console.log(res.data)
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
    // 当传过来的 callback 为空时,默认赋值为空函数
    if (!callback) {
      callback = res => {}
    }

    // 将 data 中的当前页面数和单个页面条数  blogNamePage 和 blogPage 分别进行赋值
    let blogNumPage = this.data.blogNumPage
    let blogPage = this.data.blogPage

    // 调用 getBlogInfo 云函数获取 blogInfo 集合的数据
    cloudResult = await wx.cloud.callFunction({
      name: 'getBlogInfo'
    })

    // 将 getBlogInfo 云函数获取到的数据库信息赋值给全局变量 blogInfoData
    blogInfoData = cloudResult.result.data.reverse()

    console.log(blogInfoData)

    let maxPage = Math.ceil(blogInfoData.length / this.data.blogPage)

    // 判断当前页码数是否大于最大页数  （当前是大于最大页码数）
    if (maxPage !== 0 && this.data.blogNumPage > maxPage) {
      wx.showToast({
        title: '没有数据了',
      })
      this.setData({
        blogNumPage: maxPage
      })
      callback()
      return
    }
    // 每次截取10条数据并赋值给变量 arrBlog
    let arrBlog = blogInfoData.slice((blogNumPage - 1) * blogPage, blogPage * blogNumPage)

    // 将截取到的数据赋值给 data 中的 blogInfo
    this.setData({
      blogInfo: this.data.blogInfo.concat(arrBlog)
    }, () => {
      console.log(this.data.blogInfo)
      callback()
    })

  },

  // 搜索框发送的事件
  async getTitle(e) {

    let inputData = e.detail
    inputData = inputData.trim()

    if (inputData) {
      cloudResult = await wx.cloud.callFunction({
        name: 'blogInfoFindTitle',
        data: {
          inputData
        }
      })

      let searchResult = cloudResult.result.data
      searchData = searchResult
      /*       app.globalData.searchData = searchResult

            let option = []
            searchResult.map((item, index) => {
              option.push({
                text: item.title,
                value: index
              })

            })

            this.setData({
              option
            }) */
      if (searchResult.length > 0) {
        this.showPopup()
      }
    } else {
      this.onClose()
    }


  },

  focus() {

  },

  // 是否展示弹出层
  showPopup() {
    this.setData({
      show: true
    });
  },

  // 关闭弹出层
  onClose() {
    this.setData({
      show: false
    });
  },

  // 选择下拉菜单选项时
  choiceResult(e) {

    // 获得点击选项对应的数据
    let currentData = searchData[e.detail]
    // 获得点击选项对应博客id
    let currentID = currentData._id

    // 携带 id 跳转到对应博客页面
    wx.navigateTo({
      url: '../blogInfo/blogInfo?id=' + currentID,
    })
  },

  // 点击搜索按钮从子组件传递过来的事件
  search() {
    if (!searchData.length) {
      return
    }
    wx.navigateTo({
      url: '../search/search',
    })
  }


})