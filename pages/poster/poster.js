/*
 * @Author: whc
 * @Date: 2019-12-13 17:46:59
 * @LastEditTime : 2020-01-05 15:15:27
 */
// pages/poster/poster.js
import ImageSynthesis from '../../utils/image-synthesis.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    posterSrc: null,
    imageurl: null,
    qrcode: '../images/whcapp.jpg',
    fonts: [
      'normal bold 100px NSimSun',
      'normal bold 80px NSimSun',
      'normal bold 100px NSimSun',
      'normal bold 80px NSimSun',
      'normal bold 80px NSimSun',
      'normal bold 80px NSimSun'
    ],
    titles1: [
      '庆圣诞、迎新年',
      '新年快乐、佳节如意',
      '迎元旦、庆新春',
      '团结奋进、振兴中华',
      '愿你的代码永不出BUG！' ,
      '名花虽有主、挖掘最无情'

    ],
    titles2: [
      '来给图像加节日标签吧',
      '来给图像加节日标签吧',
      '来给图像加节日标签吧',
      '来给图像加节日标签吧',
      '来给图像加节日标签吧',
      '来给图像加节日标签吧',
    ],
    title: '',
    type: 0,
    backImageUrls: [
      '../images/poster/1.jpg',
      '../images/poster/2.jpg',
      '../images/poster/3.jpg',
      '../images/poster/4.jpg',
      '../images/poster/5.jpg',
      '../images/poster/6.jpg'
    ],
    backIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const cacheImageUrl = wx.getStorageSync('imageurl');
    if (cacheImageUrl == void 0) {
      const userInfo = app.globalData.userInfo;
      this.setData({
        imageurl: userInfo.highAvatarUrl == null ? userInfo.avatarUrl : userInfo.highAvatarUrl,
        type: 0,
      });
    } else {
      this.setData({
        imageurl: cacheImageUrl,
        type: options.type,
      });
    }
    const type = options.type != void 0 ? options.type : 0;
    switch (type) {
      case 0: //圣诞
        this.data.title = '庆圣诞、迎新年快给图像贴节日标签吧';
        break;
      case 1: //春节
        this.data.title = '';
        break;
      case 2: //元宵
        this.data.title = '';
        break;
      case 3: //国庆
        this.data.title = '';
        break;
      case 4: //1024
        this.data.title = '1024愿你的代码永不出BUG！';
        break;
      case 5: //女神节
        this.data.title = '';
        break;
      default:
        break;
    }
    wx.setNavigationBarTitle({
      title: '制作海报',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this._makePosterImage();
  },

  _makePosterImage: function() {
    if (this.data.loading) {
      return;
    }
    const {
      imageurl = null,
      titles1,
      type,
      qrcode,
      backImageUrls,
      backIndex,
      fonts,
    } = this.data;
    if (imageurl != null) {
      wx.showLoading({
        title: '生成海报...',
      });
      this.data.loading = true;
      const width = 1000;
      const height = 1500;
      const imageSynthesis = new ImageSynthesis(this, 'festivalCanvas', width, height);
      imageSynthesis.addImage({
        path: backImageUrls[backIndex],
        x: 0,
        y: 0,
        w: 1000,
        h: 1506
      }).addText({
        text: titles1[type],
        x: 0,
        y: 150,
        font: fonts[type],
        align: 'center',
        fontSize: 100,
        color: (() => {
          switch(backIndex) {
            case 1:
            case 5:
              return '#99335A';
            case 4:
              return '#000';
            default:
              return '#fff';
          }
        })(),
      }).addImage({
        path: imageurl,
        x: (width - 550) / 2,
        y: (height - 550) / 2 - 80,
        w: 550,
        h: 550,
      }).addImage({
        path: qrcode,
        x: 120,
        y: height - 300,
        w: 250,
        h: 250,
        radius: 250 / 2.0,
      }).addText({
        text: '长按识别小程序码',
        x: 500 - 30,
        y: height - 350 + 250 / 2.0,
        align: 'left',
        fontSize: 40,
        color: (() => {
          switch (backIndex) {
            case 4:
              return '#000';
            case 5:
              return '#99335A';
            default:
              return '#fff';
          }
        })(),
      }).addText({
        text: '免费为图像添加节日标签',
        x: 500 - 30,
        y: height - 350 + 250 / 2.0 + 80,
        align: 'left',
        fontSize: 40,
        color: (() => {
          switch(backIndex) {
            case 2:
            case 3:
              return '#fff';
            case 5:
              return '#99335A';
            default:
              return '#000';
          }
        })(),
      }).startCompound((imgurl) => {
        wx.hideLoading();
        this.data.loading = false;
        if (imageurl) {
          this.setData({
            posterSrc: imgurl,
          });
        }else {
          this._makePosterImage();
        }
      });
    }else {
      wx.showToast({
        title: '海报生成异常，请联系作者',
        icon: 'none'
      });
    }
  },

  clickChangeBackImage: function(e) {
    if (this.data.loading) {
      return;
    }
    const {
      backIndex,
      backImageUrls,
    } = this.data;
    this.data.backIndex = (backIndex + 1) % backImageUrls.length;
    this._makePosterImage();
  },

  clickSavePhoto: function(e) {
    if (this.data.loading) {
      return;
    }
    const {
      posterSrc = null,
    } = this.data;
    if (posterSrc) {
      wx.showLoading({
        title: '正在保存...',
      });
      this.data.loading = true;
      wx.saveImageToPhotosAlbum({
        filePath: posterSrc,
        success: (res) => {
          this.data.loading = false;
          wx.hideLoading();
          wx.showToast({
            title: '保存到相册成功',
          });
        },
        fail: (res) => {
          this.data.loading = false;
          wx.hideLoading();
          wx.showToast({
            title: '保存失败',
            icon: 'none',
          });
        }
      });
    }else {
      wx.showToast({
        title: '海报生成异常，请联系作者',
        icon: 'none'
      });
    }
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