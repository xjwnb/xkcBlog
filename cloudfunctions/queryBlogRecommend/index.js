// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogRecommend = db.collection('blogRecommend')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await blogRecommend.doc(event._id).get()
  } catch (e) {
    console.log(e)
  }
}