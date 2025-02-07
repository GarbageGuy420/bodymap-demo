(function ($) {
    "use strict";

    // ✅ Detect if the device supports touch
    function isTouchEnabled() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    $(document).ready(function () {
        console.log("Document ready, initializing body map...");
        updateBodyMap(); // ✅ Ensuring this function is properly defined and called

        // ✅ Ensure JotForm API is available before calling it
        if (typeof window.JFCustomWidget !== "undefined") {
            console.log("Jotform Widget API loaded.");
            initializeJotformIntegration();
        } else {
            console.warn("JFCustomWidget not found. Ensure you're running inside JotForm.");
        }
    });

    // ✅ Initialize and update the body map
    function updateBodyMap() {
        $("path[id^='basic_']").each(function (i, e) {
            let id = $(e).attr('id');
            if (typeof basic_config !== "undefined" && basic_config[id] && basic_config[id]['active'] === true) {
                addEvent(id);
            } else {
                $(e).hide(); // ✅ Hide disabled body parts
            }
        });
    }

    function addEvent(id) {
        var _obj = $('#' + id);
        $('#basic-wrapper').css({'opacity': '1'});

        _obj.attr({'fill': 'rgba(255, 0, 0, 0)', 'stroke': 'rgba(255, 102, 102, 1)'});
        _obj.attr({'cursor': 'default'});

        if (typeof basic_config !== "undefined" && basic_config[id]['active'] === true) {
            _obj.attr({'cursor': 'pointer'});

            _obj.on('mouseenter', function () {
                $('#tip-basic').show().html(basic_config[id]['hover']);
                _obj.css({'fill': 'rgba(255, 0, 0, 0.3)'});
            }).on('mouseleave', function () {
                $('#tip-basic').hide();
                _obj.css({'fill': 'rgba(255, 0, 0, 0)'});
            });

            _obj.on('mouseup touchend', function () {
                _obj.css({'fill': 'rgba(255, 0, 0, 0.3)'});
                sendPlacement(basic_config[id]['hover']); // ✅ Send selected body part to JotForm
            });

            _obj.on('mousemove touchmove', function (e) {
                let x = (e.pageX || e.originalEvent.touches[0].pageX) + 10;
                let y = (e.pageY || e.originalEvent.touches[0].pageY) + 15;
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
        if (typeof window.JFCustomWidget !== "undefined") {
            window.JFCustomWidget.sendData({ value: selection });

            // ✅ Also update the "Placement Selection" field in JotForm
            window.JFCustomWidget.sendData({ placementSelection: selection });

        } else {
            console.warn("JFCustomWidget not found - running outside Jotform.");
        }
    }

    // ✅ Initialize Jotform API communication
    function initializeJotformIntegration() {
        if (typeof window.JFCustomWidget === "undefined") {
            console.warn("JFCustomWidget is not defined. Ensure you're inside JotForm.");
            return;
        }

        window.JFCustomWidget.subscribe("ready", function () {
            console.log("Widget Ready. Requesting data from parent form...");

            // ✅ Listen for "First Tattoo" updates
            window.JFCustomWidget.subscribe("change", function (data) {
                if (data && data.name === "typeA") {
                    console.log("First Tattoo Field Updated:", data.value);
                    handleFirstTattooRestriction(data.value);
                }
            });

            // ✅ Request initial state
            window.JFCustomWidget.getWidgetSetting("previousPlacement", function (value) {
                if (value) {
                    console.log("Previous Placement from form:", value);
                    highlightPreviousSelection(value);
                }
            });

            // ✅ Fetch "First Tattoo" answer dynamically
            fetchFirstTattooStatus();
        });
    }

    function highlightPreviousSelection(placement) {
        $("path[id^='basic_']").each(function () {
            if ($(this).attr('id') === placement) {
                $(this).css({'fill': 'rgba(0, 0, 255, 0.3)'}); // Highlight in blue
            }
        });
    }

    function fetchFirstTattooStatus() {
        let formID = "{myFormID}"; // ✅ Replace this dynamically
        $.ajax({
            url: `https://api.jotform.com/form/${formID}/submissions?apiKey=2875655dc082f4f5b4566a3477e9cc6b`,
            method: "GET",
            success: function (response) {
                if (response.content.length > 0) {
                    const submission = response.content[0]; // Get the latest submission
                    const firstTattooAnswer = submission.answers["3"].answer; // ID 3 is "First Tattoo"
                    console.log("Fetched First Tattoo Status:", firstTattooAnswer);
                    handleFirstTattooRestriction(firstTattooAnswer);
                }
            },
            error: function (err) {
                console.error("Error fetching first tattoo status:", err);
            }
        });
    }

    function handleFirstTattooRestriction(value) {
        const isFirstTattoo = value.toLowerCase() === "yes";

        // ✅ Find torso parts dynamically from `basic_config`
        const torsoParts = Object.keys(basic_config).filter(key => {
            return basic_config[key]['hover'] === "CHEST" || basic_config[key]['hover'] === "ABDOMEN";
        });

        torsoParts.forEach(partID => {
            if (isFirstTattoo) {
                basic_config[partID]['active'] = false; // ✅ Disable body part in config
                $('#' + partID).hide();
                console.log(`Disabled: ${basic_config[partID]['hover']}`);
            } else {
                basic_config[partID]['active'] = true; // ✅ Re-enable body part in config
                $('#' + partID).show();
                addEvent(partID);
                console.log(`Enabled: ${basic_config[partID]['hover']}`);
            }
        });

        updateBodyMap(); // ✅ Refresh body map
    }

})(jQuery);
