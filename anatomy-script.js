(function($) {
    "use strict";

    function isTouchEnabled() {
        return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    }

    let selectedParts = {}; // Object to store selected parts

    $(document).ready(function () {
        $("path[id^='basic_']").each(function (i, e) {
            addEvent($(e).attr('id'));
        });
    });

    function addEvent(id, relationId) {
        var _obj = $('#' + id);
        $('#basic-wrapper').css({'opacity': '1'});

        _obj.attr({'fill': 'rgba(255, 0, 0, 0)', 'stroke': 'rgba(255, 102, 102, 1)'});
        _obj.attr({'cursor': 'pointer'});

        if (basic_config[id]['active'] === true) {
            if (isTouchEnabled()) {
                var touchmoved;
                _obj.on('touchend', function (e) {
                    if (touchmoved !== true) {
                        toggleSelection(id, _obj);
                    }
                }).on('touchmove', function () {
                    touchmoved = true;
                }).on('touchstart', function () {
                    touchmoved = false;
                });
            }

            _obj.on('mouseup', function () {
                toggleSelection(id, _obj);
            });

            _obj.on('mouseenter', function () {
                if (!selectedParts[id]) {
                    _obj.css({'fill': 'rgba(255, 0, 0, 0.3)'});
                }
                $('#tip-basic').show().html(basic_config[id]['hover']);
            }).on('mouseleave', function () {
                if (!selectedParts[id]) {
                    _obj.css({'fill': 'rgba(255, 0, 0, 0)'});
                }
                $('#tip-basic').hide();
            });

            if (basic_config[id]['target'] !== 'none') {
                _obj.on('mousedown', function () {
                    _obj.css({'fill': 'rgba(255, 0, 0, 0.7)'});
                });
            }
            _obj.on('mousemove', function (e) {
                let x = e.pageX + 10, y = e.pageY + 15;

                let $abasic = $('#tip-basic');
                let basicanatomytipw = $abasic.outerWidth(), basicanatomytiph = $abasic.outerHeight();

                x = (x + basicanatomytipw > $(document).scrollLeft() + $(window).width()) ? x - basicanatomytipw - (20 * 2) : x;
                y = (y + basicanatomytiph > $(document).scrollTop() + $(window).height()) ? $(document).scrollTop() + $(window).height() - basicanatomytiph - 10 : y;

                $abasic.css({left: x, top: y});
            });
        } else {
            _obj.hide();
        }
    }

    function toggleSelection(id, _obj) {
        if (selectedParts[id]) {
            delete selectedParts[id];
            _obj.css({'fill': 'rgba(255, 0, 0, 0)'}); // Reset color when deselected
        } else {
            selectedParts[id] = true;
            _obj.css({'fill': 'rgba(255, 0, 0, 0.7)'}); // Highlight when selected
        }
    }
})(jQuery);
