/**
 * 获取登录用户的点赞信息
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogPerson = db.collection('blogPersonal')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    blogId,
    blogPersonalId
  } = event

  try {
    return await blogPerson.doc(blogPersonalId).get()
  } catch (e) {
    return e
  }

}