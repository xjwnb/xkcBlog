let cloudResult
let id // 该博客的 id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogInfo: [], // blogInfo集合中对应 id 的数据
    incremenrArr: [], // 渲染到页面的 textarea 和 image 及其数据
    isLike: false, // 是否点赞
    isFollow: false, // 是否关注
    isShowLikeFollow: false, // 是否显示点赞关注
    commentList: [], // 评论内容
    inputData: ''   // 输入框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    id = options.id
    // 将id 作为参数传递获得该 id 对应的博客信息
    await this.getBlogInfoById(id)


  },
  // 调用 getBlogInfoById 云函数 通过 id 获取对应 blogInfo集合 的数据
  async getBlogInfoById(id) {
    cloudResult = await wx.cloud.callFunction({
      name: 'getBlogInfoById',
      data: {
        _id: id
      }
    })
    let blogInfo = cloudResult.result.data[0]
    this.setData({
      blogInfo
    })

    // 获得评论内容
    let commentList = this.data.blogInfo.commentList

    // 将获得的评论内容赋值给 data 中的 commentList
    this.setData({
      commentList
    }, () => {
      console.log(this.data.commentList)
    })


    // 向 icremenArr 中添加需要在页面渲染的 textarea image 的顺序及其内容
    this.getIncrementArr()

    // 增加阅读量
    this.readNum()

    // 是否展示点赞和关注
    this.isShowLikeFollow()

    // 获得自己是否已经点赞了该博客
    this.getLikeState()

    // 获得自己是否已经关注过了该博客
    this.getFollowState()
  },

  // 获得将要添加的渲染给 wxml 的数组
  getIncrementArr() {
    let blogInfo = this.data.blogInfo
    let {
      addOrder,
      imageSrcs,
      textareaData
    } = blogInfo

    let text = 0
    let image = 0
    let regex = /^(textarea)[0-9]+/
    let incremenrArr = []
    addOrder.map(item => {
      if (regex.test(item)) {
        incremenrArr.push({
          type: "textarea",
          name: item,
          content: textareaData[text]
        })
        text++
        return item
      } else {
        incremenrArr.push({
          type: 'image',
          name: item,
          content: imageSrcs[image]
        })

        image++
        return item
      }

    })

    this.setData({
      incremenrArr
    })

  },

  // 阅读量 
  async readNum() {
    // 获取 data 中的 blogInfo 并赋值给 变量 blogInfo
    let blogInfo = this.data.blogInfo

    // 获得 _id 
    let _id = blogInfo._id

    // 调用云函数 addReadNum 修改 blogInfo集合 中的 readNum
    cloudResult = await wx.cloud.callFunction({
      name: 'addReadNum',
      data: {
        _id
      }
    })
    // 修改完成后 readNum 自增1
    blogInfo.readNum++

    // 自增后的 blogInfo 重新赋值给 data 此时动态修改页面
    this.setData({
      blogInfo
    })
  },

  // 是否显示点赞和关注
  isShowLikeFollow() {
    console.log(this.data.blogInfo)
    let openidByStorage = wx.getStorageSync('userInfo').openId
    let openidByBlogInfo = this.data.blogInfo._openid
    // 判断打开的博客的 openid 和自己的 openid 是否一致，一致则不显示
    if (openidByStorage !== openidByBlogInfo) {
      this.setData({
        isShowLikeFollow: true
      })
    }
  },

  // 点赞操作
  async like() {
    this.setData({
      isLike: !this.data.isLike
    })
    let like = this.data.isLike
    let _id = this.data.blogInfo._id

    // 从本地存储中获得 key 为 blogPersonal 的数据 id
    let blogPersonalID = wx.getStorageSync('blogPersonal')

    // 调用云函数 blogChangeLike 
    cloudResult = await wx.cloud.callFunction({
      name: 'blogChangeLike',
      data: {
        like,
        _id,
        blogPersonalID
      }
    })
    let blogInfo = this.data.blogInfo

    // 判断 like 的状态
    if (like) {
      // 如果 like 为 true blogInfo.likes 自增一，并赋值给 data 中的 blogInfo
      blogInfo.likes++
      this.setData({
        blogInfo
      })
    } else {
      // 如果 like 为 false blogInfo.likes 自减一，并赋值给 data 中的 blogInfo
      blogInfo.likes--
      this.setData({
        blogInfo
      })
    }

  },

  // 获取是否之前已经点赞该博客
  async getLikeState() {
    // 获得该博客的 _id 并赋值给变量
    let blogId = this.data.blogInfo._id
    // 获得本地存储中的 blogPerson集合中 为用户创建的那条数据的 id
    let blogPersonalId = wx.getStorageSync('blogPersonal')

    // 调用 云函数blogPersonalFindLike， 并传递该博客id以及本地存储中的 id
    cloudResult = await wx.cloud.callFunction({
      name: 'blogPersonalFindLike',
      data: {
        blogId,
        blogPersonalId
      }
    })

    // 获得从 云函数blogPersonalFindLike 处理之后的数据结果中的 likes数组（用户点赞数组） 并赋值给变量 likesFromBlogPersonal
    let likesFromBlogPersonal = cloudResult.result.data.likes

    // 遍历数组
    likesFromBlogPersonal.map(item => {

      if (item === blogId) {
        // 如果遍历到用户点赞的数组中有一条和该博客的 id 一致 修改 data 中的 isLike 的值为 true
        this.setData({
          isLike: true
        })
        return item
      }
      return item
    })
  },

  // 点击关注
  async follow() {
    // 取反 data 中的 isFollow 
    this.setData({
      isFollow: !this.data.isFollow
    })
    // 获得该博客关注的状态 isFollow 并赋值给变量 follow
    let follow = this.data.isFollow
    // 获得本地存储中的 id
    let blogPersonalID = wx.getStorageSync('blogPersonal')
    // 获得该博客中的 id 
    let _id = this.data.blogInfo._id

    // 调用 云函数blogChageFollow 并传递博客id,本地存储id，以及当前关注的状态
    cloudResult = await wx.cloud.callFunction({
      name: 'blogChageFollow',
      data: {
        _id,
        blogPersonalID,
        follow
      }
    })

    // 获得 data 中的 blogInfo 并赋值给变量 blogInfo
    let blogInfo = this.data.blogInfo

    // 判断关注状态
    if (follow) {
      // 如果关注为true 时，变量 blogInfo 自增一，并赋值给 data 
      blogInfo.follows++
      this.setData({
        blogInfo
      })
    } else {
      // 如果关注为false 时，变量 blogInfo 自减一，并赋值给 data 
      blogInfo.follows--
      this.setData({
        blogInfo
      })
    }
  },

  // 获取是否关注过该博客
  async getFollowState() {
    // 获得本地存储中的 id
    let blogPersonalID = wx.getStorageSync('blogPersonal')

    // 获得当前博客的 id 
    let blogInfoID = this.data.blogInfo._id
    cloudResult = await wx.cloud.callFunction({
      name: 'blogPersonalFindFollows',
      data: {
        blogPersonalID
      }
    })

    let follows = cloudResult.result.data.follows

    follows.map(item => {

      if (item === blogInfoID) {

        this.setData({
          isFollow: true
        })
        return item
      }
      /* else {
             this.setData({
               isFollow: false
             })
           } */
      return item
    })
  },

  // 评论发送按钮事件
  async send(e) {
    let commentContent = e.detail.value.commentContent
    commentContent = commentContent.trim()

    let userInfo = wx.getStorageSync('userInfo')


    let userName = userInfo.nickName
    let userAvatar = userInfo.avatarUrl

    let commentList
    commentList = {
      userName,
      userAvatar,
      commentContent
    }

    if(commentContent.length > 0) {
      cloudResult = await wx.cloud.callFunction({
        name: 'blogInfoChangeCommentList',
        data: {
          id,
          commentList
        }
      })

      let comm = this.data.commentList
      comm.push(commentList)
      this.setData({
        commentList: comm ,
        inputData: ''
      })

    }
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

  },

})