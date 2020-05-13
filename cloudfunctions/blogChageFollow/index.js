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
    follow,
    _id,
    blogPersonalID
  } = event

  let blogInfoChange, blogPersonalChange

  try {
    if (follow) {
      blogInfoChange = await blogInfo.where({
        _id
      }).update({
        data: {
          follows: _.inc(1)
        }
      })

      blogPersonalChange = await blogPersonal.doc(blogPersonalID)
        .update({
          data: {
            follows: _.push([_id])
          }
        })
    } else {
      blogInfoChange = await blogInfo.where({
        _id
      }).update({
        data: {
          follows: _.inc(-1)
        }
      })

      blogPersonalChange = await blogPersonal.doc(blogPersonalID)
        .update({
          data: {
            follows: _.pull(_id)
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