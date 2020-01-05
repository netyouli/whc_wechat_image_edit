/*
 * @Author: whc
 * @Date: 2019-12-13 17:46:59
 * @LastEditTime : 2020-01-05 15:14:33
 */
//index.js
//获取应用实例
const app = getApp()
import ImageSynthesis from '../../utils/image-synthesis.js';
import Notification from '../../utils/react-whc-notification.js';
Page({
  data: {
    didShow: false,
    isTouchScale: false,
    makePosterImage: false,
    festivalSrc: '',
    oldx:0,
    oldy: 0,
    startx: 0,
    starty: 0,
    initRotate: 0,
    rotate: 0,
    loading: false,
    callback: null,
    logoPath: null,
    currentFestival: '圣诞',
    userInfo: {},
    olduserInfo: {},
    hasScale: false,
    hasRotate: false,
    hasUserInfo: false,
    isOpenSetting: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    festivalCenterX: 0,
    festivalCenterY: 0,
    festivalLeft: 120,
    festivalTop: 120,
    offsetx: 0,
    offsety: 0,
    festivalSize: 80,
    festivalIndex: 0,
    festivalImageIndex: 0,
    festivalNames: [
      '圣诞',
      '春节',
      '元宵',
      '国庆',
      '1024',
      '女神节'
    ],
    icons: {
      '圣诞': [],
      '春节': [],
      '元宵': [],
      '国庆': [],
      '1024': [],
      '女神节': [],
    },
  },

  _reset: function(e) {
    const {
      olduserInfo
    } = this.data;
    this.setData({
      isTouchScale: false,
      hasScale: false,
      hasRotate: false,
      festivalCenterX: 0,
      festivalCenterY: 0,
      festivalLeft: 120,
      festivalTop: 120,
      offsetx: 0,
      offsety: 0,
      festivalSize: 80,
      oldx: 0,
      oldy: 0,
      startx: 0,
      starty: 0,
      initRotate: 0,
      rotate: 0,
      logoPath: null,
      userInfo: { ...olduserInfo},
    });
  },

  _saveUserInfo: function(userInfo = null) {
    if (userInfo == void 0) {
      wx.showToast({
        title: '获取微信账号信息失败，请重新授权！',
        icon: 'none',
      });
      return;
    }
    if (userInfo.avatarUrl != void 0) {
      const index = userInfo.avatarUrl.lastIndexOf('/132');
      if (index != -1) {
        userInfo.highAvatarUrl = userInfo.avatarUrl.substring(0, index) + '/0';
      }else {
        userInfo.highAvatarUrl = userInfo.avatarUrl;
      }
    }
    app.globalData.userInfo = userInfo;
    console.log(userInfo);
    const {
      icons,
      currentFestival,
      festivalIndex,
    } = this.data;
    this.setData({
      olduserInfo: { ...userInfo},
      userInfo: userInfo,
      hasUserInfo: userInfo != null,
      festivalSrc: icons[currentFestival][festivalIndex].src,
    });
    this._showFestivalSwitchPrompt();
  },

  onShareAppMessage: function(e) {
    return {
      title: '微信节日头像生成',
      desc: '自动生成各种节日（国庆节，春节，元宵节...）图像，让我们为节日欢乐祝福吧',
      path: '/pages/index/index',
    };
  },
  
  _showFestivalSwitchPrompt: function() {
    const {
      userInfo = {},
      didShow,
    } = this.data;
    if (!didShow && userInfo.highAvatarUrl != void 0) {
      setTimeout(() => {
        this.data.didShow = true;
        wx.showToast({
          title: '可以切换不同节日',
          icon: 'none',
        });
      }, 1000);
    }
  },

  onShow: function(e) {
    this._showFestivalSwitchPrompt();
  },

  onLoad: function () {
    const {
      festivalNames,
      icons,
    } = this.data;
    festivalNames.forEach((v, i) => {
      let len = 0;
      let name = '';
      switch(i) {
        case 0: // 圣诞
          len = 19;
          name = 'shengdan';
          break;
        case 1: // 春节
          len = 22;
          name = 'year';
          break;
        case 2: // 元宵
          len = 4;
          name = '15';
          break;
        case 3: // 国庆
          len = 9;
          name = '101';
          break;
        case 4: // 1024
          len = 3;
          name = '1024';
          break;
        case 5: // 女神节
          len = 2;
          name = '38';
          break;
      }
      icons[v] = [...Array(len)].map((v, i) => {
        return {
          src: `../images/${name}/${i + 1}.png`,
          isselected: i == 0,
        };
      });
    });
    this.setData({
      icons,
    });
    if (app.globalData.userInfo) {
      this._saveUserInfo(app.globalData.userInfo);
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this._saveUserInfo(res.userInfo);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this._saveUserInfo(res.userInfo);
        }
      })
    }
  },

  getUserInfo: function(e) {
    const {
      userInfo = null
    } = e.detail;
    if (userInfo != null) {
      app.globalData.userInfo = userInfo;
      this._saveUserInfo(userInfo);
    }else {
      wx.showToast({
        title: e.detail.errMsg,
        icon: 'none'
      });
    }
  },

  onChangePickerFestival: function(e) {
    const {
      icons,
      festivalNames,
      currentFestival,
    } = this.data;
    const index = e.detail.value;
    const name = festivalNames[index];
    icons[currentFestival] = icons[currentFestival].map((v, i) => {
      v.isselected = i == 0;
      return v;
    });
    this.setData({
      festivalIndex: index,
      festivalImageIndex: 0,
      currentFestival: name,
      festivalSrc: icons[name][0].src,
      icons,
    });
  },

  clickCancelOpenSetting: function(e) {
    this.setData({
      isOpenSetting: false,
      callback: null,
    });
  },

  handlerOpenSetting: function(e) {
    if (e.detail.authSetting['scope.writePhotosAlbum'] == true) {
      const {
        callback = null,
      } = this.data;
      callback && callback(true);
      this.setData({
        isOpenSetting: false,
        callback: null,
      });
    }
  },

  clickChangeAvatarImage: function(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const {
          userInfo
        } = this.data;
        if (res.tempFilePaths.length > 0) {
          Notification.addObserver(this, 'cutimagenotify', (img) => {
            if (img != void 0) {
              userInfo.highAvatarUrl = img;
              userInfo.avatarUrl = img;
              this.setData({
                logoPath: img,
                userInfo,
              });
            }else {
              wx.showToast({
                title: '请选择高清图像尺寸至少200x200以上！',
                icon: 'none',
              });
            }
          });
          wx.navigateTo({
            url: `../edit/edit?imageurl=${res.tempFilePaths[0]}`,
          });
        }else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          });
        }
      }
    });
  },

  _checkPhotosAlbum: function (callback = null) {
    const self = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              callback && callback(true);
            },
            fail() { 
              console.log("2-授权《保存图片》权限失败");
              self.setData({
                callback,
                isOpenSetting: true,
              });
            }
          })
        } else {
          console.log("1-已经授权《保存图片》权限");
          callback && callback(true);
        }
      },
      fail(res) {
        console.log("getSetting: success");
        console.log(res);
      }
    });
  },

  clickMakeResetImage: function(e) {
    this._reset();
  },

  clickMakePoster: function(e) {
    this.data.makePosterImage = true;
    this.clickMakeNewImage(e);
  },

  clickFestivalImage: function(e) {
    if (this.data.loading) {
      return;
    }
    const index = e.currentTarget.dataset.index;
    const {
      icons,
      currentFestival
    } = this.data;
    icons[currentFestival] = icons[currentFestival].map((v, i) => {
      v.isselected = i == index;
      return v;
    });
    this.setData({
      icons,
      festivalImageIndex: index,
      festivalSrc: icons[currentFestival][index].src,
    });
  },

  clickMakeNewImage: function(e) {
    if (this.data.loading) {
      return;
    }
    this._checkPhotosAlbum((isok) => {
      if (isok == false) {
        this.data.makePosterImage = false;
        return;
      }
      this.setData({
        loading: true,
      });
      wx.showLoading({
        title: '生成中...',
      });
      if (this.data.logoPath == null) {
        wx.downloadFile({
          url: this.data.userInfo.highAvatarUrl,
          success: (res) => {
            this.data.logoPath = res.tempFilePath;
            this._saveImage();
          },
          fail: (res) => {
            this.data.loading = false;
            wx.showToast({
              title: '获取微信图像失败',
              icon: 'none'
            });
          },
        });
      }else {
        this._saveImage();
      }
    });
  },

  _saveImage: function() {
    const {
      makePosterImage,
      festivalLeft,
      festivalTop,
      festivalSize,
      festivalSrc = '',
      rotate,
      logoPath = '',
      festivalIndex,
    } = this.data;
    if (festivalSrc == '' || logoPath == '') {
      wx.showToast({
        title: '程序异常，请联系作者',
        icon: 'none',
      });
      return;
    }
    const imageSynthesis = new ImageSynthesis(this, 'festivalCanvas', 700, 700);
    imageSynthesis.addImage({
      path:logoPath, 
      x:0, 
      y:0, 
      w:700,
      h:700
    });
    const rc = imageSynthesis.switchRect({
      x: festivalLeft,
      y: festivalTop,
      w: festivalSize,
      h: festivalSize,
    });
    imageSynthesis.addImage({
      path:festivalSrc, 
      x:rc.x, 
      y:rc.y, 
      w:rc.w, 
      h:rc.h, 
      deg:rotate
    });
    imageSynthesis.startCompound((img) => {
      if (img != void 0) {
        wx.hideLoading();
        if (makePosterImage) {
          this.data.makePosterImage = false;
          this.data.loading = false;
          wx.setStorageSync('imageurl', img);
          wx.navigateTo({
            url: `../poster/poster?type=${festivalIndex}`
          });
        }else {
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success: (res) => {
              this.data.loading = false;
              wx.showToast({
                title: '保存到相册成功',
              });
            },
            fail: (res) => {
              this.data.loading = false;
              wx.showToast({
                title: '保存失败',
                icon: 'none',
              });
            }
          });
        }
      }
    });
  },

  _getCurrentPointXiangxian: function(x = 0, y = 0) {
    const {
      festivalCenterX = 0,
      festivalCenterY = 0,
    } = this.data;
    if (x >= festivalCenterX && y <= festivalCenterY) {
      return 1;
    }
    if (x <= festivalCenterX && y <= festivalCenterY) {
      return 2;
    }
    if (x <= festivalCenterX && y >= festivalCenterY) {
      return 3;
    }
    if (x >= festivalCenterX && y >= festivalCenterY) {
      return 4;
    }
  },

  _switchPoint: function(x = 0, y = 0) {
    const xx = this._getCurrentPointXiangxian(x, y);
    const {
      festivalCenterX,
      festivalCenterY,
    } = this.data;
    switch(xx) {
      case 1:
        return {
          x: x - festivalCenterX,
          y: festivalCenterY - y,
        };
      case 2:
        return {
          x: x - festivalCenterX,
          y: festivalCenterY - y,
        };
      case 3:
        return {
          x: x - festivalCenterX,
          y: festivalCenterY - y,
        };
      case 4:
        return {
          x: x - festivalCenterX,
          y: festivalCenterY - y,
        };
      default:
        return null;
    }
  },

  _handlefestivalImageMoveScale: function(e) {
    if (e.touches.length > 0) {
      const {
        oldx = 0,
        oldy = 0,
        festivalCenterX = 0,
        festivalCenterY = 0,
        startx = 0,
        starty = 0,
        initRotate = 0,
        hasRotate,
        hasScale,
        offsety,
        offsetx,
        rotate,
      } = this.data;
      const x = e.touches[0].pageX;
      const y = e.touches[0].pageY;
      if (hasRotate || hasScale) {
        const a = Math.sqrt(Math.pow(Math.abs(x - festivalCenterX), 2) + Math.pow(Math.abs(y - festivalCenterY), 2));
        const b = Math.sqrt(Math.pow(Math.abs(oldx - festivalCenterX), 2) + Math.pow(Math.abs(oldy - festivalCenterY), 2));
        const c = Math.sqrt(Math.pow(Math.abs(oldx - x), 2) + Math.pow(Math.abs(oldy - y), 2));
        const cosa = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
        const ra = Math.abs(Math.acos(cosa) / (Math.PI / 180));
        const a1 = this._switchPoint(oldx, oldy);
        const b1 = this._switchPoint(x, y);
        const sunshi = a1.x * b1.y - a1.y * b1.x;
        const newsize = Math.sqrt(Math.pow(a * 2, 2) / 2);
        if (sunshi != 0) {
          const rotateSshi = sunshi < 0;
          this.setData({
            festivalTop: festivalCenterY - newsize / 2.0,
            festivalLeft: festivalCenterX - newsize / 2.0,
            festivalSize: newsize,
            rotate: rotate + (rotateSshi ? ra : -ra),
            oldx: x,
            oldy: y,
          });
        }else {
          this.setData({
            festivalTop: festivalCenterY - newsize / 2.0,
            festivalLeft: festivalCenterX - newsize / 2.0,
            festivalSize: newsize,
            oldx: x,
            oldy: y,
          });
        }
      } else {
        this.setData({
          festivalTop: y - offsety,
          festivalLeft: x - offsetx,
          oldx: x,
          oldy: y,
        });
      }
    }
  },

  festivalImageTouchStart: function(e){
    if (this.data.isTouchScale) {
      return;
    }
    const {
      festivalLeft,
      festivalTop,
      festivalSize,
    } = this.data;
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    this.data.startx = x;
    this.data.starty = y;
    this.data.oldx = x;
    this.data.oldy = y;
    this.data.festivalCenterX = this.data.festivalLeft + this.data.festivalSize / 2.0;
    this.data.festivalCenterY = this.data.festivalTop + this.data.festivalSize / 2.0;
    this.data.hasRotate = false;
    this.data.hasScale = false;
    this.data.offsetx = x - this.data.festivalLeft;
    this.data.offsety = y - this.data.festivalTop;
  },

  festivalImageTouchMove: function (e) {
    if (this.data.isTouchScale) {
      return;
    }
    this._handlefestivalImageMoveScale(e);
  },

  festivalImageTouchEnd: function(e) {
    if (this.data.isTouchScale) {
      return;
    }
    this._handlefestivalImageMoveScale(e);
  },

  festivalImageRaoteTouchStart: function(e) {
    this.data.isTouchScale = true;
    this.data.initRotate = this.data.rotate;
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    this.data.startx = x;
    this.data.starty = y;
    this.data.oldx = x;
    this.data.oldy = y;
    this.data.festivalCenterX = this.data.festivalLeft + this.data.festivalSize / 2.0;
    this.data.festivalCenterY = this.data.festivalTop + this.data.festivalSize / 2.0;
    this.data.hasRotate = true;
    this.data.hasScale = true;
    this.data.offsetx = x - this.data.festivalLeft;
    this.data.offsety = y - this.data.festivalTop;
  },

  festivalImageRaoteTouchMove: function(e) {
    this._handlefestivalImageMoveScale(e);
  },

  festivalImageRaoteTouchEnd: function(e) {
    this._handlefestivalImageMoveScale(e);
    this.data.isTouchScale = false;
  },
})
