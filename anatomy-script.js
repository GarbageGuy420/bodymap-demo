(function ($) {

    "use strict";

    function isTouchEnabled() {
        return (('ontouchstart' in window)
            || (navigator.MaxTouchPoints > 0)
            || (navigator.msMaxTouchPoints > 0));
    }

    $(document).ready(function () {
        $("path[id^=\"basic_\"]").each(function (i, e) {
            addEvent($(e).attr('id'));
        });
    });

    function addEvent(id) {
        var _obj = $('#' + id);
        $('#basic-wrapper').css({ 'opacity': '1' });

        _obj.attr({ 'fill': 'rgba(255, 0, 0, 0)', 'stroke': 'rgba(255, 102, 102, 1)' });
        _obj.attr({ 'cursor': 'default' });

        if (basic_config[id]['active'] === true) {
            if (isTouchEnabled()) {
                var touchmoved;
                _obj.on('touchend', function (e) {
                    if (!touchmoved) {
                        _obj.css({ 'fill': 'rgba(255, 0, 0, 0.7)' });
                    }
                }).on('touchmove', function (e) {
                    touchmoved = true;
                }).on('touchstart', function () {
                    touchmoved = false;
                });
            }
            _obj.attr({ 'cursor': 'pointer' });

            _obj.on('mouseenter', function () {
                $('#tip-basic').show().html(basic_config[id]['hover']);
                _obj.css({ 'fill': 'rgba(255, 0, 0, 0.3)' });
            }).on('mouseleave', function () {
                $('#tip-basic').hide();
                if (!_obj.hasClass('selected')) {
                    _obj.css({ 'fill': 'rgba(255, 0, 0, 0)' });
                }
            });

            _obj.on('mouseup touchend', function () {
                if (!_obj.hasClass('selected')) {
                    $("path[id^=\"basic_\"]").removeClass('selected').css({ 'fill': 'rgba(255, 0, 0, 0)' });
                    _obj.addClass('selected').css({ 'fill': 'rgba(255, 0, 0, 0.7)' });
                } else {
                    _obj.removeClass('selected').css({ 'fill': 'rgba(255, 0, 0, 0)' });
                }
                
                if (basic_config[id]['target'] === '_blank') {
                    window.open(basic_config[id]['url']);
                } else if (basic_config[id]['target'] === '_self') {
                    window.parent.location.href = basic_config[id]['url'];
                }
            });
        } else {
            _obj.hide();
        }
    }

})(jQuery);
