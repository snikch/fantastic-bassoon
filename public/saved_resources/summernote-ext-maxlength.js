(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    // Extends plugins for print plugin.
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        maxlength: function (context) {
            var self = this;

            var layoutInfo = context.layoutInfo;
            var $editor = layoutInfo.editor;
            var $editable = layoutInfo.editable;
            var $statusbar = layoutInfo.statusbar;
            var maxlength = $editor.parent().find('.js-summernote').attr('maxlength') || 768;

            self.$label = null;

            self.initialize = function () {
                // var label = ui.button({contents:"hi"});
                var label = document.createElement("span");

                self.$label = $(label);
                self.$label.addClass('maxlength label label-success');
                self.$label.css({position: 'absolute', left:'50%', transform:'translateX(-50%)'});
                $statusbar.append(self.$label);
                self.toggle($editable.html().length);

                $editable.on('keydown', function(e){
                    var length = $editable.html().length;
                    self.toggle(length, e);
                });
            };

            self.toggle = function(length, e){
                self.$label.text(length +" / "+ maxlength);
                if(length >= maxlength){
                    if (e.keyCode != 8) e.preventDefault(); // dmeehan: fixed plugin to actually prevent key press after > max
                    self.$label.addClass('label-danger');
                    self.$label.removeClass('label-success');
                }else{
                    self.$label.addClass('label-success');
                    self.$label.removeClass('label-danger');
                }
            };
        }
    });
}));
