/**
 * 查询标题
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogInfo = db.collection('blogInfo')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { inputData } = event

  try {
    // 模糊查找
    return await blogInfo.where({
      title: db.RegExp({
        regexp: '.*'+inputData+'.*',
        options: 'i'
      })
    }).get()
  } catch(e) {
    return e
  }
}