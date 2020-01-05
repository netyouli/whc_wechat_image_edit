/*
 * @Author: whc
 * @Date: 2019-12-13 17:46:59
 * @LastEditTime : 2020-01-05 15:14:33
 */
// pages/about/about.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: [
      '小程序作者：吴海超',
      '意见反馈添加微信：whc66888',
      '个人网站：http://www.wuhaichao.com',
      'github：https://github.com/netyouli',
      '小程序版本：v1.0.3',
    ],
  },

  clickItem: function(e) {
    const index = e.currentTarget.dataset.index;
    switch (index) {
      case 1:
        wx.setClipboardData({
          data: 'whc66888',
          success: (res) => {
            wx.showToast({
              title: '复制成功',
            });
          }
        });
      break;
      case 2:
        wx.setClipboardData({
          data: 'http://www.wuhaichao.com',
          success: (res) => {
            wx.showToast({
              title: '复制成功',
            });
          }
        });
        break;
      case 3:
        wx.setClipboardData({
          data: 'https://github.com/netyouli',
          success: (res) => {
            wx.showToast({
              title: '复制成功',
            });
          }
        });
        break;
      default:
      break;
    }
  },

  clickContactWe: function(e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '关于',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '微信节日头像生成',
      desc: '自动生成各种节日（国庆节，春节，元宵节...）图像，让我们为节日欢乐祝福吧',
      path: '/pages/index/index',
      imageUrl: app.globalData.userInfo.highAvatarUrl,
    };
  }
})