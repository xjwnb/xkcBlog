/**
 * 点赞操作
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogInfo = db.collection('blogInfo')
const blogPersonal = db.collection('blogPersonal')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    like,
    _id,
    _openid,
    blogPersonalID
  } = event

  let blogInfoChange
  let blogPersonalChange


  try {
    
    if (like) {
      // 如果传来的 like 为 true 说明已经点赞则修改 blogInfo集合 中的 likes 使其自增一
      blogInfoChange = await blogInfo.where({
        _id
      }).update({
        data: {
          likes: _.inc(1)
        }
      })

      // 修改 blogPersonal集合 中的 likes数组，使其 push 增加 id 
      blogPersonalChange = await blogPersonal.doc(blogPersonalID).update({
        data: {
          likes: _.push([_id])
        }
      })
      

    } else {
      // 如果传来的 like 为 false 说明已经取消点赞 则修改 blogInfo集合 中的 likes 使其自减一
      blogInfoChange =  await blogInfo.where({
        _id
      }).update({
        data: {
          likes: _.inc(-1)
        }
      })

      // 修改 blogPersonal集合 中的 likes数组，使其 push 删除 id 
      blogPersonalChange = await blogPersonal.doc(blogPersonalID).update({
        data: {
          likes: _.pull(_id)
        }
      })
    }
    return {
      blogInfoChange,
      blogPersonalChange
    }
    
  } catch (e) {
    return e
  }
  
}