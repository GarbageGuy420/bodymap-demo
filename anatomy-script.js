(function ($) {
    "use strict";

    function isTouchEnabled() {
        return (('ontouchstart' in window) ||
            (navigator.MaxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    $(document).ready(function () {
        $("path[id^='basic_']").each(function (i, e) {
            addEvent($(e).attr('id'));
        });
    });

    function addEvent(id) {
        var _obj = $('#' + id);
        $('#basic-wrapper').css({'opacity': '1'});

        _obj.attr({'fill': 'rgba(255, 0, 0, 0)', 'stroke': 'rgba(255, 102, 102, 1)'});
        _obj.attr({'cursor': 'default'});

        if (basic_config[id]['active'] === true) {
            _obj.attr({'cursor': 'pointer'});

            _obj.on('mouseenter', function () {
                $('#tip-basic').show().html(basic_config[id]['hover']);
                _obj.css({'fill': 'rgba(255, 0, 0, 0.3)'});
            }).on('mouseleave', function () {
                $('#tip-basic').hide();
                _obj.css({'fill': 'rgba(255, 0, 0, 0)'});
            });

            _obj.on('mouseup', function () {
                _obj.css({'fill': 'rgba(255, 0, 0, 0.3)'});
                sendPlacement(basic_config[id]['hover']); // ✅ Send selected body part to Jotform
            });

            _obj.on('mousemove', function (e) {
                let x = e.pageX + 10, y = e.pageY + 15;
                let $abasic = $('#tip-basic');
                let basicanatomytipw = $abasic.outerWidth(), basicanatomytiph = $abasic.outerHeight();

                x = (x + basicanatomytipw > $(document).scrollLeft() + $(window).width()) ?
                    x - basicanatomytipw - (20 * 2) : x;
                y = (y + basicanatomytiph > $(document).scrollTop() + $(window).height()) ?
                    $(document).scrollTop() + $(window).height() - basicanatomytiph - 10 : y;

                $abasic.css({left: x, top: y});
            });
        } else {
            _obj.hide();
        }
    }

    function sendPlacement(selection) {
        console.log("Sending selected placement:", selection);
        if (typeof JFCustomWidget !== "undefined") {
            JFCustomWidget.sendData({ value: selection });
        } else {
            console.warn("JFCustomWidget not found - running outside Jotform.");
        }
    }

    // ✅ Fetch data from the parent form when the widget loads
    JFCustomWidget.subscribe("ready", function () {
        console.log("Widget Ready. Requesting data from parent form...");

        // ✅ Example: Fetching a form setting (like previous placement)
        JFCustomWidget.getWidgetSetting("previousPlacement", function(value) {
            if (value) {
                console.log("Previous Placement from form:", value);
                highlightPreviousSelection(value);
            }
        });

        // ✅ Example: Requesting a field value (like if it's the first tattoo)
        JFCustomWidget.subscribe("change", function(data) {
            if (data && data.name === "typeA") {
                console.log("First Tattoo Field Updated:", data.value);
                handleFirstTattooRestriction(data.value);
            }
        });
    });

    function highlightPreviousSelection(placement) {
        $("path[id^='basic_']").each(function () {
            if ($(this).attr('id') === placement) {
                $(this).css({'fill': 'rgba(0, 0, 255, 0.3)'}); // Highlight in blue
            }
        });
    }

    function handleFirstTattooRestriction(value) {
        const isFirstTattoo = value.toLowerCase() === "yes";
        const torsoOption = $('#basic_torso');

        if (isFirstTattoo) {
            torsoOption.css({'fill': 'rgba(100, 100, 100, 0.5)', 'cursor': 'not-allowed'});
            torsoOption.off("mouseup"); // Disable clicking torso
            console.log("Torso selection disabled for first tattoo.");
        } else {
            torsoOption.css({'fill': '', 'cursor': 'pointer'});
            addEvent("basic_torso"); // Re-enable torso selection
            console.log("Torso selection enabled.");
        }
    }

})(jQuery);
