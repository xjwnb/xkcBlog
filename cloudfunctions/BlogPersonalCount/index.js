// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const blogPersonal = db.collection('blogPersonal')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let _openid = wxContext.OPENID

  let count

  try {
    count = await blogPersonal.where({
      _openid
    }).count()
    let total = count.total
    return total
  } catch (e) {
    return e
  }

}