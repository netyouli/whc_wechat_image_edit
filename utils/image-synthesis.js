/*
 * @Author: whc
 * @Date: 2019-12-13 17:46:59
 * @LastEditTime : 2020-01-05 15:16:46
 */
export default class ImageSynthesis {
  constructor(
    view, 
    canvasid, 
    width = 700,
    height = 700) {
    this._canvasid = canvasid;
    this._size = {
      w: width,
      h: height,
    }
    const ctx = wx.createCanvasContext(canvasid, view);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.setFillStyle('#fff');
    ctx.fill();
    ctx.restore();
    this._ctx = ctx;
  }

  switchRect = ({x, y, w, h, sw = 320, sh = 320}) => {
    const {
      _size
    } = this;
    const res = wx.getSystemInfoSync();
    const xc = (res.screenWidth - 320) / 2.0;
    return {
      x: (x - xc) * (_size.w / sw),
      y: y * (_size.h / sh),
      w: w * (_size.w / sw),
      h: h * (_size.h / sh),
    };
  };

  addImage = ({
    path,
    x = 0, 
    y = 0, 
    w = 0, 
    h = 0, 
    deg = 0,
    radius = 0,
  }) => {
    const {
      _ctx = null,
    } = this;
    if (_ctx != null) {
      _ctx.save();
      _ctx.beginPath();
      if (radius > 0) {
        const r = Math.min(w / 2.0, h / 2.0);
        radius = Math.min(radius, r);
        _ctx.setLineWidth(1);
        _ctx.setStrokeStyle('transparent');
        // 左上角
        _ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
        _ctx.moveTo(x + radius, y);
        _ctx.lineTo(x + w - radius, y);
        _ctx.lineTo(x + w, y + radius);
        // 右上角
        _ctx.arc(x + w - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
        _ctx.lineTo(x + w, y + h - radius);
        _ctx.lineTo(x + w - radius, y + h);
        // 右下角
        _ctx.arc(x + w - radius, y + h - radius, radius, 0, Math.PI * 0.5);
        _ctx.lineTo(x + radius, y + h);
        _ctx.lineTo(x, y + h - radius);
        // 左下角
        _ctx.arc(x + radius, y + h - radius, radius, Math.PI * 0.5, Math.PI);
        _ctx.lineTo(x, y + radius);
        _ctx.lineTo(x + radius, y);
        _ctx.stroke(); 
        _ctx.clip();
      }
      if (deg != 0) {
        _ctx.translate(x + w / 2.0, y + h / 2.0);
        _ctx.rotate(deg * Math.PI / 180);
        _ctx.drawImage(path, -w / 2.0, -h / 2.0, w, h);
      }else {
        _ctx.drawImage(path, x, y, w, h);
      }
      _ctx.closePath();
      _ctx.restore();
    }
    return this;
  };

  addText = ({
    text, 
    x = 0, 
    y = 0, 
    fontSize = 14,
    color = '#444',
    maxWidth = 0,
    align = 'left',
    font = '',
    textBaseline = 'top',
  }) => {
    const {
      _ctx = null,
      _size,
    } = this;
    if (_ctx != null && text != void 0) {
      _ctx.save();
      _ctx.beginPath();
      if (fontSize > 0) {
        _ctx.setFontSize(fontSize);
      }
      if (font != '') {
        _ctx.font = font;
      }
      if (maxWidth == 0) {
        maxWidth = _ctx.measureText(text).width;
      }
      if (align == 'center') {
        x = (_size.w - maxWidth) / 2.0;
      }
      _ctx.setTextBaseline(textBaseline);
      _ctx.setFillStyle(color);
      _ctx.fillText(text, x, y, maxWidth);
      _ctx.setTextAlign(align);
      _ctx.closePath();
      _ctx.restore();
    }
    return this;
  };

  startCompound = (block = null) => {
    const {
      _ctx,
      _canvasid,
    } = this;
    _ctx.draw();
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: _canvasid,
        success: (res) => {
          block && block(res.tempFilePath);
        },
        fail: (e) => {
          console.log(e);
          block && block(null);
        }
      });
    }, 100);
  };

  startCut = ({
    x = 0,
    y = 0,
    w = 0,
    h = 0,
  },block = null) => {
    const {
      _ctx,
      _canvasid,
      _size,
    } = this;
    _ctx.draw();
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: _canvasid,
        x,
        y,
        width: w,
        height: h,
        destWidth: w,
        destHeight: h,
        success: (res) => {
          block && block(res.tempFilePath);
        },
        fail: (e) => {
          console.log(e);
          block && block(null);
        }
      });
    }, 100);
  };
}