// components/search/search.js
let inputData 
let timer
let cloudResult
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 输入事件
    bindKeyInput(e) {
      inputData = e.detail.value
      // 延迟发送调用 show 方法 （防抖）
      clearTimeout(timer)
      timer = setTimeout(this.show.bind(this), 1000)
    },

    // 发送数据给父组件
    show() {

      this.triggerEvent('getTitle', inputData)
    },

    // 输入框获得焦点时
    inputFocus() {
      this.triggerEvent('focus')
    },

    // 点击搜索按钮事件
    search() {
      this.triggerEvent('search')
    }

  }
})
