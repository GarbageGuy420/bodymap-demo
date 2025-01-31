( function( $ ) {

    "use strict";

    function isTouchEnabled() {
    return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
    }

    let selectedPart = null;

    $(document).ready(function () {
        $("path[id^=\"basic_\"]").each(function (i, e) {
            addEvent($(e).attr('id'));
        });

        $(document).on('mousedown touchstart', function (e) {
            // Only reset selection if clicking outside any valid body part
            if (!$(e.target).is("path[id^=\"basic_\"]")) {
                resetSelection();
            }
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
                        selectPart(id, _obj);
                    }
                }).on('touchmove', function () {
                    touchmoved = true;
                }).on('touchstart', function () {
                    touchmoved = false;
                });
            }

            _obj.on('mouseup', function () {
                selectPart(id, _obj);
            });

            _obj.on('mouseenter', function () {
                if (selectedPart !== id) {
                    _obj.css({'fill': 'rgba(255, 0, 0, 0.3)'});
                }
                $('#tip-basic').show().html(basic_config[id]['hover']);
            }).on('mouseleave', function () {
                if (selectedPart !== id) {
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

    function selectPart(id, _obj) {
        resetSelection();
        selectedPart = id;
        _obj.css({'fill': 'rgba(255, 0, 0, 0.5)'});
    }

    function resetSelection() {
        if (selectedPart) {
            $('#' + selectedPart).css({'fill': 'rgba(255, 0, 0, 0)'});
            selectedPart = null;
        }
    }
})(jQuery);
