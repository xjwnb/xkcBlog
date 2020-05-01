// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 创建 blogInfo 集合对象
  const db = cloud.database()
  const blogInfo = db.collection('blogInfo')

  // 默认图片
  let defaultImage = 'cloud://xkctest-3p3ce.786b-xkctest-3p3ce-1301752881/onepiece.png'

  // 获取 OPENID 
  let {
    OPENID
  } = wxContext
  let {
    title,             // 标题
    sort,              // 类目
    textareaData,      // 文本框内容
    imageSrcs,         // 图片内容
    addOrder,          // 文本 图片 提交顺序
  } = event.submitDataToDB

  let likes = 0 // 点赞量
  let readNum = 0 // 阅读量
  let comments = 0 // 评论量
  let date = new Date().toDateString() // 当前时间

  // 集合 blogInfo 增加数据
  try {
    return await blogInfo.add({
      data: {
        _openid: OPENID,     // openid 
        title,               // 标题
        sort,                // 类目
        date,                // 时间
        textareaData,        // textarea
        imageSrcs,           // image
        addOrder,            // 添加的顺序
        likes,               // 点赞量
        readNum,             // 阅读量
        comments,            // 评论量
        defaultImage         // 默认添加的图片
      }
    })
  } catch (e) {
    return e
  }

}