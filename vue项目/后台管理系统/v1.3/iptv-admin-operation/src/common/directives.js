import Vue from 'vue';
import $ from 'jquery';

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');
        dialogHeaderEl.style.cursor = 'move';
        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;

            // 获取到的值带px 正则匹配替换
            let styL, styT;

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
            } else {
                styL = +sty.left.replace(/\px/g, '');
                styT = +sty.top.replace(/\px/g, '');
            };

            document.onmousemove = function(e) {
                // 通过事件委托，计算移动的距离 
                const l = e.clientX - disX;
                const t = e.clientY - disY;

                // 移动当前元素  
                dragDom.style.left = `${l + styL}px`;
                dragDom.style.top = `${t + styT}px`;

                //将此时的位置传出去
                //binding.value({x:e.pageX,y:e.pageY})
            };

            document.onmouseup = function(e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})

Vue.directive('selectScroll', {
        bind(el, binding) {
            let selectInput = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
            selectInput.addEventListener('scroll', function() {
                /**
                 * scrollHeight 获取元素内容高度(只读)
                 * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                 * clientHeight 读取元素的可见高度(只读)
                 * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                 * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                 */

                const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                if (condition) {
                    binding.value(condition);
                }
            })
        }
    })
    // v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
    bind(el, binding, vnode, oldVnode) {
        const dragDom = el.querySelector('.el-dialog'); //binding.value.$el.querySelector('.el-dialog');
        el.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;

            document.onmousemove = function(e) {
                e.preventDefault();
                // 通过事件委托，计算移动的距离 
                const l = e.clientX - disX;
                dragDom.style.width = `${l}px`;
            };
            document.onmouseup = function(e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})




Vue.directive('dragSize', {
    bind: function(el) {
        var eleLeft = $(el).offset().left;
        var isMouseDown = false;
        var borderLen = 2; //左右边框
        el.onmousedown = function(e) {
            var ele = $(el);
            var rightPos = eleLeft + ele.width() + borderLen;
            if (rightPos - 5 <= e.pageX && e.pageX <= rightPos) {
                isMouseDown = true;
                ele.css('cursor', 'e-resize');
            }

            document.onmousemove = function(e) {
                var ele = $(el);
                var rightPos = eleLeft + ele.width() + borderLen;
                if (rightPos - 5 <= e.pageX && e.pageX <= rightPos) {
                    ele.css('cursor', 'e-resize');
                } else {
                    if (!isMouseDown) {
                        ele.css('cursor', 'auto');
                    }
                }
                if (isMouseDown) {
                    ele.width((e.pageX - eleLeft - borderLen) + 'px');
                }
            };

            document.onmouseup = function(e) {
                e.stopPropagation();
                isMouseDown = false;
            };

        };
    },
    update: function(el) {
        var eleLeft = $(el).offset().left;
        var isMouseDown = false;
        var borderLen = 2; //左右边框
        el.onmousedown = function(e) {
            var ele = $(el);
            var rightPos = eleLeft + ele.width() + borderLen;
            if (rightPos - 5 <= e.pageX && e.pageX <= rightPos) {
                isMouseDown = true;
                ele.css('cursor', 'e-resize');
            }

            document.onmousemove = function(e) {
                var ele = $(el);
                var rightPos = eleLeft + ele.width() + borderLen;
                if (rightPos - 5 <= e.pageX && e.pageX <= rightPos) {
                    ele.css('cursor', 'e-resize');
                } else {
                    if (!isMouseDown) {
                        ele.css('cursor', 'auto');
                    }
                }
                if (isMouseDown) {
                    ele.width((e.pageX - eleLeft - borderLen) + 'px');
                }
            };

            document.onmouseup = function(e) {
                e.stopPropagation();
                isMouseDown = false;
            };

        };
    }
})

Vue.directive("image", {
    bind(el, binding, vnode, oldVnode) {
        el.ondblclick = (function() {
            el.setAttribute("src", binding.value.picPath)
                // binding.value.data = ""
            binding.value.fun()
        });
    }
})