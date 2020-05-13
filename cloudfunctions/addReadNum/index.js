// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogInfo = db.collection('blogInfo')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    _id
  } = event

  try {
    return await blogInfo.where({
      _id
    }).update({
      data: {
        readNum: _.inc(1)
      }
    })
  } catch(e) {
    return e
  }
}