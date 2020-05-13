// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogInfo = db.collection('blogInfo')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { _openid } = event

  try {
    return await blogInfo
      .aggregate()
      .match({
        _openid
      })
      .end()
  } catch(e) {
    return e
  }
}