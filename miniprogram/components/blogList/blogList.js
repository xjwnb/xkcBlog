// components/blogList/blogList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    newBlogInfo: {}
  },

  lifetimes: {
    attached: function() {
      // 处理 blogInfo 数据中的 textarea[0] 的显示
      let textareaArrOne = this.data.blogInfo.textareaData[0]
      let title = this.data.blogInfo.title
      let newBlogInfo = this.data.blogInfo

      // 如果 textarea[0] 的长度长于 10 就截取前十位 后面多余用 ' ...... ' 代替
      if(textareaArrOne) {
        if (textareaArrOne.length > 30) {
          newBlogInfo.textareaData[0] = textareaArrOne.slice(0,30)+'......'
  
        } else if (title.length > 10) {
          newBlogInfo.title = title.slice(0, 10) + '......'
        }
        this.setData({
          newBlogInfo
        })
      } else {

        if (title.length > 10) {
          newBlogInfo.title = title.slice(0, 10) + '......'
          this.setData({
            newBlogInfo
          })
        }
        this.setData({
          newBlogInfo
        })

      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
