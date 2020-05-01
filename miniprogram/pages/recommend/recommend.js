
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogRecommend: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 传参数 id 以获取数据库blogRecommend的数据并赋值给data中的blogRecommend
      this.queryBlogRecommendById(options.id)
  },

  // 通过 id 获取数据库 blogRecommend 数据并赋值给 data 中的 blogRecommend
  queryBlogRecommendById: function(id) {
    wx.cloud.callFunction({
      name: 'queryBlogRecommend',
      data: {
        _id: id
      }
    }).then(res => {
      // 转义数据库信息中的 \n 字符
      const arr = res.result.data.content.split('')
      const newArr = arr.map(item => {
        if (item === "\\") {
          item = ''
        } else if (item === "n") {
          item = "\n"
        }
        return item
      })
      const newContent = newArr.join('')
      res.result.data.content = newContent
      this.setData({
        blogRecommend: res.result.data
      })
    })
  }
})