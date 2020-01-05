//  Created by WHC on 18/12/11.
//  Copyright © 2017年 WHC. All rights reserved.
//
//  Github <https://github.com/netyouli/react-whc-notification>
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * 通知管理
 */
export default class Notification {

    static __default = new Notification();

    constructor() {
        this.__observerMap = new Map();
        this.__hashCodeSet = new Set();
        this.__segmentKey = '_#$@_';
    }

    /**
     * 发送通知
     * @param name   发送通知的名称
     * @param param  发送通知参数
     */
    static post = (name, param = null) => {
        if (name != void 0) {
            Notification.__default.__observerMap.forEach((value, key, map) => {
                const array = key.split(Notification.__default.__segmentKey);
                if (array.length === 2) {
                    const aname = array[0];
                    if (aname === name) {
                        const {
                            block = null,
                        } = value;
                        block && block(param);
                    }
                }
            });
        }else {
            console.warn('[Notification] post name not null');
        }
    };


    /**
     * 添加监听通知
     * @param observer  监听通知的对象
     * @param block     通知回调
     * @param name      通知名称
     */
    static addObserver = (observer,
                          name,
                          block = null) => {
        if (observer != void 0 && name != void 0) {
            const {
                __notification_hashCode = ''
            } = observer;
            if (__notification_hashCode.length === 0) {
                observer.__notification_hashCode = Notification.__default.__makeHashCode();
            }
            const key = name + Notification.__default.__segmentKey + observer.__notification_hashCode;
            Notification.__default.__observerMap.set(key, {observer, block});
        }else {
            console.warn('[Notification] observer not null or name not null');
        }
    };

    /**
     * 移除通知监听
     * @param observer  监听通知的对象
     * @param name      要移除的通知的名称、如果为空则移除所有监听
     */
    static removeObserver = (observer, name = null) => {
        if (observer != void 0) {
            const {
                __notification_hashCode
            } = observer;
            if (__notification_hashCode != void 0) {
                if (name) {
                    const key = name + Notification.__default.__segmentKey + __notification_hashCode;
                    Notification.__default.__observerMap.delete(key);
                }else {
                    const keys = Notification.__default.__observerMap.keys();
                    for(let key of keys) {
                        const array = key.split(Notification.__default.__segmentKey);
                        if (array.length === 2) {
                            const hasCode = array[1];
                            if (hasCode === __notification_hashCode) {
                                Notification.__default.__observerMap.delete(key);
                            }
                        }
                    }
                }
            }else {
                console.log('[Notification] observer not add');
            }
        }else {
            console.warn('[Notification] observer not null');
        }
    };


    /// 生成hashCode
    __makeHashCode = () => {
        let hashCode = '';
        const len = 8;
        const keys = ['0', '1', '2', '3', '4',
                      '5', '6', '7', '8', '9',
                      'a', 'b', 'c', 'd', 'e',
                      'f', 'g', 'h', 'i', 'j',
                      'k', 'l', 'm', 'n', 'o',
                        'p', 'q', 'r', 's', 't',
                        'u', 'v', 'w', 'x', 'y',
                        'z', 'A', 'B', 'C', 'D',
                        'E', 'F', 'G', 'H', 'I',
                        'J', 'K', 'L', 'M', 'N',
                        'O', 'P', 'Q', 'R', 'S',
                        'T', 'U', 'V', 'W', 'X',
                        'Y', 'Z'];
        const keysCount = keys.length;
        for(let i = 0; i < len; i++) {
            const pos = Math.round(Math.random() * (keysCount - 1));
            hashCode += keys[pos];
        }
        if (this.__hashCodeSet.has(hashCode)) {
            return this.__makeHashCode();
        }
        this.__hashCodeSet.add(hashCode);
        return hashCode;
    };
}