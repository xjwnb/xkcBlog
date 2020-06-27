/**
 * 创建登录用户的集合内容
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogPersonal = db.collection('blogPersonal')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 获取用户 openid
  let _openid = wxContext.OPENID


  try {

    /*     let count = await blogPersonal.where({
          _openid
        }).count()
        let total = count.total.result
        return total */
    // 在 blogPersonal集合 中新添加初始化数据
    return await blogPersonal.add({
      data: {
        _openid,
        likes: [],
        follows: []
      }
    })
  } catch (e) {
    return e
  }

}