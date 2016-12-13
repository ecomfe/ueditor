/**
 * @file message.js
 * @author leeight
 */

define(function (require) {
    var utils = require('../core/utils');
    var domUtils = require('../core/domUtils');
    var UIBase = require('./uibase');

    /**
     * Message
     *
     * @param {Object} options The options.
     * @class
     */
    function Message(options) {
        this.initOptions(options);
        this.initMessage();
    }

    Message.prototype = {
        constructor: Message,
        initMessage: function () {
            this.initUIBase();
        },
        /* eslint-disable */
        getHtmlTpl: function () {
            return '<div id="##" class="edui-message %%">' +
                ' <div id="##_closer" class="edui-message-closer">×</div>' +
                ' <div id="##_body" class="edui-message-body edui-message-type-info">' +
                ' <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe>' +
                ' <div class="edui-shadow"></div>' +
                ' <div id="##_content" class="edui-message-content">' +
                '  </div>' +
                ' </div>' +
                '</div>';
        },
        /* eslint-enable */
        reset: function (opt) {
            var me = this;
            if (!opt.keepshow) {
                clearTimeout(this.timer);
                me.timer = setTimeout(function () {
                    me.hide();
                }, opt.timeout || 4000);
            }

            opt.content !== undefined && me.setContent(opt.content);
            opt.type !== undefined && me.setType(opt.type);

            me.show();
        },
        postRender: function () {
            var me = this;
            var closer = this.getDom('closer');
            closer && domUtils.on(closer, 'click', function () {
                me.hide();
            });
        },
        setContent: function (content) {
            this.getDom('content').innerHTML = content;
        },
        setType: function (type) {
            type = type || 'info';
            var body = this.getDom('body');
            body.className = body.className.replace(/edui-message-type-[\w-]+/, 'edui-message-type-' + type);
        },
        getContent: function () {
            return this.getDom('content').innerHTML;
        },
        getType: function () {
            var arr = this.getDom('body').match(/edui-message-type-([\w-]+)/);
            return arr ? arr[1] : '';
        },
        show: function () {
            this.getDom().style.display = 'block';
        },
        hide: function () {
            var dom = this.getDom();
            if (dom) {
                dom.style.display = 'none';
                dom.parentNode && dom.parentNode.removeChild(dom);
            }

        }
    };

    utils.inherits(Message, UIBase);

    return Message;
});
