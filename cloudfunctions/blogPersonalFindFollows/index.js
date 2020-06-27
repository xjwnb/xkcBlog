/**
 * 获取登录用户的收藏信息
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogPersonal = db.collection('blogPersonal')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    blogPersonalID
  } = event
  
  try {
    return await blogPersonal.doc(blogPersonalID).get()
  } catch(e) {
    return e
  }
}