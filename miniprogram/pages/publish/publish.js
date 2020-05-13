let incrementList = []    // 添加textarea 和 image
let textareaNum = 0       // textarea name属性的变量的数字部分
let imageNum = 0       // 初始化image name属性的变量的数字部分
let imageSrcs = []    // image 中 src所有数据
let textareaData = []   // textarea所有的数据
let addOrder = []   // 添加的 textarea 和 image 顺序
let cloudRes  // 云函数返回结果
let remind    // 提醒（标题和类目不能为空）
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortList: ['微信小程序', 'Java', 'PHP', 'NodeJs', '人工智能'],
    componentsList: ['文本输入', '选择图片'],
    title: '',
    incrementList: [],
    show: false,   // 类目弹出框是否出现
    sortName: '',    
    submitDataToDB: {},
    isSubmit: false    // 是否能够满足提交要求状态（标题和类目不能为空）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    incrementList = []
  },
  onShow: function() {
  },
  // 选择类目
  choiceSort() {
    let itemList = this.data.sortList
    this.setData({
      show: true
    })
  },
  // 关闭 van-popup
  onClosePopup() {
    this.setData({
      show: false
    });
  },
  // 点击 picker选择器 中的确定按钮
  onConfirmSort(e) {
    this.setData({
      sortName: e.detail.value,
      show: false
    })
  },
  // 点击 picker选择器 中的取消按钮
  onCancelSort() {
    this.setData({
      show: false
    })
  },
  // 添加组件按钮 plus button
  incrementHandle() {
    wx.showActionSheet({
      itemList: this.data.componentsList,
      success: async res => {
        if (res.tapIndex === 0) {
          textareaNum += 1
          incrementList.push({
            type: "textarea",
            name: "textarea" + textareaNum
          })
          this.setData({
            incrementList
          }, () => {
            addOrder.push("textarea" + textareaNum)
          })
        } else {
          // 当 res.tapIndex 为 1 的时候 （image)
          // 选择本地图片
          await wx.chooseImage({
            success: res => {
              // showLoading 提醒用户
              wx.showLoading({
                title: '加载中',
              })
              let fileID = res.tempFilePaths[0]
              // 上传到云存储
              wx.cloud.uploadFile({
                cloudPath: Math.floor(Math.random() * 1000000000) + '.png',
                filePath: fileID
              }).then(res => {
                
                // 长传成功 获得回调
                let fileID = res.fileID
                imageNum += 1
                incrementList.push({
                  type: "image",
                  name: "image" + imageNum,
                  src: fileID
                })
                this.setData({
                  incrementList
                },() => {
                  addOrder.push("image" + imageNum)
                  // 隐藏 loading
                  wx.hideLoading()
                })
              })
            }
          })

        }
      }
    })
  },
  // 提交按钮事件
  async DataSubmit(e) {   

    // 保存 title 标题 到 data 中的 title 上
    this.setData({
      title: e.detail.value.title
    })

    // 判断标题和类目是否为空，为空不执行提交操作
    this.checkEmpty()
    if (!this.data.isSubmit) {
      wx.showToast({
        title: remind,
      })
      return 
    }

    // 向全局变量 imageSrcs 中添加数据
    this.data.incrementList.map(item => {
      if (item.src) {
        imageSrcs.push(item.src)
      }
    }) 
    let submitDataToDB = {}

    // 向局部变量submitDataToDB 中添加 标题和类别
    submitDataToDB.title = e.detail.value.title
    submitDataToDB.sort = e.detail.value.sort
    let textareaData = []
    let {
      title,
      sort,
      ...textdata
    } = e.detail.value

    // 从本地存储中获取用户名和用户头像
    let localStorageData = wx.getStorageSync('userInfo')
    let userName = localStorageData.nickName
    let userAvatar = localStorageData.avatarUrl

    // 遍历textdata变量，并向 全局变量 textareaData中添加数据
    for (let v in textdata) {
      textareaData.push(textdata[v])
    }
    // 向全局变量中添加 textareaData, imageSrcs, addOrder, userName, userAvator
    submitDataToDB.textareaData = textareaData
    submitDataToDB.imageSrcs = imageSrcs
    submitDataToDB.addOrder = addOrder
    submitDataToDB.userName = userName
    submitDataToDB.userAvatar = userAvatar

    // showLoading 提醒上传中
    wx.showLoading({
      title: '正在上传中'
    })

    // 使用云函数 blogInfo 添加数据
    await wx.cloud.callFunction({
      name: 'blogInfo',
      data: {
        submitDataToDB
      }
    }).then(res => {
      wx.hideLoading({
        complete: (res) => {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            success: res => {
              wx.switchTab({
                url: '../me/me',
              })
            }
          })
        },
      })
    })
    
  },
  // 判断是否输入了 title 标题和 选择了类目
  checkEmpty() {
    let title = this.data.title
    let sort = this.data.sortName

    if (!(title && sort)) {
      title ? remind = '请选择类目' : remind = '请输入标题'
      this.setData({
        isSubmit: false
      })
    } else {
      this.setData({
        isSubmit: true
      })
    }


  }
})