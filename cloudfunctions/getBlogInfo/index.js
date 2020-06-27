/**
 * 获取所有的博客信息
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogInfo = db.collection('blogInfo')

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    return await blogInfo.get()
  } catch (e) {
    return e
  }
}