// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogInfo = db.collection('blogInfo')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    _id
  } = event

  try {
    return await blogInfo.where({
      _id
    }).get()
  }catch(e) {
    return e
  }

  
}