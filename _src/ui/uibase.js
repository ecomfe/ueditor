/**
 * @file uibase.js
 * @author leeight
 */

define(function (require) {
    var utils = require('../core/utils');
    var domUtils = require('../core/domUtils');
    var EventBase = require('../core/EventBase');

    var uiUtils = require('./uiutils');

    /**
     * UIBase
     *
     * @class
     */
    function UIBase() {
    }

    UIBase.prototype = {
        constructor: UIBase,
        className: '',
        uiName: '',
        initOptions: function (options) {
            var me = this;
            for (var k in options) {    // eslint-disable-line
                me[k] = options[k];
            }
            this.id = this.id || 'edui' + uiUtils.uid();
        },
        initUIBase: function () {
            this._globalKey = utils.unhtml(uiUtils.setGlobal(this.id, this));
        },
        render: function (holder) {
            var html = this.renderHtml();
            var el = uiUtils.createElementByHtml(html);

            // by xuheng 给每个node添加class
            var list = domUtils.getElementsByTagName(el, '*');
            var theme = 'edui-' + (this.theme || this.editor.options.theme);
            var layer = document.getElementById('edui_fixedlayer');
            for (var i = 0, node; node = list[i++];) {
                domUtils.addClass(node, theme);
            }
            domUtils.addClass(el, theme);
            if (layer) {
                layer.className = '';
                domUtils.addClass(layer, theme);
            }

            var seatEl = this.getDom();
            if (seatEl != null) {
                seatEl.parentNode.replaceChild(el, seatEl);
                uiUtils.copyAttributes(el, seatEl);
            }
            else {
                if (typeof holder === 'string') {
                    holder = document.getElementById(holder);
                }

                holder = holder || uiUtils.getFixedLayer();
                domUtils.addClass(holder, theme);
                holder.appendChild(el);
            }
            this.postRender();
        },
        getDom: function (name) {
            if (!name) {
                return document.getElementById(this.id);
            }
            return document.getElementById(this.id + '_' + name);
        },
        postRender: function () {
            this.fireEvent('postrender');
        },
        getHtmlTpl: function () {
            return '';
        },
        formatHtml: function (tpl) {
            var prefix = 'edui-' + this.uiName;
            return (tpl
                .replace(/##/g, this.id)
                .replace(/%%-/g, this.uiName ? prefix + '-' : '')
                .replace(/%%/g, (this.uiName ? prefix : '') + ' ' + this.className)
                .replace(/\$\$/g, this._globalKey));
        },
        renderHtml: function () {
            return this.formatHtml(this.getHtmlTpl());
        },
        dispose: function () {
            var box = this.getDom();
            if (box) {
                domUtils.remove(box);
            }

            uiUtils.unsetGlobal(this.id);
        }
    };
    utils.inherits(UIBase, EventBase);

    return UIBase;
});
