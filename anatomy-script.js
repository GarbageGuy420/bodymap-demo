(function ($) {
    "use strict";

    function isTouchEnabled() {
        return (('ontouchstart' in window) ||
            (navigator.MaxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    $(document).ready(function () {
        console.log("Document Ready: Initializing body map...");
        updateBodyMap(); // ✅ Load Body Map

        // ✅ Ensure JotForm API is available before calling it
        if (typeof JFCustomWidget !== "undefined") {
            console.log("Jotform Widget API loaded.");
            initializeJotformIntegration();
        } else {
            console.warn("JFCustomWidget not found. Make sure you're testing inside Jotform.");
        }
    });

    function updateBodyMap() {
        $("path[id^='basic_']").each(function (i, e) {
            let id = $(e).attr('id');
            if (anatomy_config[id] && anatomy_config[id]['active'] === true) {
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

        if (anatomy_config[id]['active'] === true) {
            _obj.attr({'cursor': 'pointer'});

            _obj.on('mouseenter', function () {
                $('#tip-basic').show().html(anatomy_config[id]['hover']);
                _obj.css({'fill': 'rgba(255, 0, 0, 0.3)'});
            }).on('mouseleave', function () {
                $('#tip-basic').hide();
                _obj.css({'fill': 'rgba(255, 0, 0, 0)'});
            });

            _obj.on('mouseup', function () {
                _obj.css({'fill': 'rgba(255, 0, 0, 0.3)'});
                sendPlacement(anatomy_config[id]['hover']); // ✅ Send selected body part to Jotform
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
            _obj.hide(); // ✅ Hide elements if disabled
        }
    }

    function sendPlacement(selection) {
        console.log("Sending selected placement:", selection);
        if (typeof JFCustomWidget !== "undefined") {
            JFCustomWidget.sendData({ value: selection });

            // ✅ Also update the "Placement Selection" field in Jotform
            JFCustomWidget.sendData({ placementSelection: selection });

        } else {
            console.warn("JFCustomWidget not found - running outside Jotform.");
        }
    }

    // ✅ Initialize Jotform API communication
    function initializeJotformIntegration() {
        JFCustomWidget.subscribe("ready", function () {
            console.log("Widget Ready. Requesting data from parent form...");

            // ✅ Listen for "First Tattoo" updates
            JFCustomWidget.subscribe("change", function(data) {
                if (data && data.name === "typeA") {
                    console.log("First Tattoo Field Updated:", data.value);
                    handleFirstTattooRestriction(data.value);
                }
            });

            // ✅ Request initial state
            JFCustomWidget.getWidgetSetting("previousPlacement", function(value) {
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
        console.log("Fetching 'First Tattoo' status from form...");

        JF.getFormSubmissions("250346801308047", function(response) {
            if (response.length > 0) {
                const submission = response[0]; // Get the latest submission
                const firstTattooAnswer = submission.answers["3"].answer; // ID 3 is "First Tattoo"

                console.log("Fetched First Tattoo Status:", firstTattooAnswer);
                handleFirstTattooRestriction(firstTattooAnswer);
            } else {
                console.log("No submissions found for this form.");
            }
        });
    }

    function handleFirstTattooRestriction(value) {
        console.log("Handling tattoo restriction for:", value);
        const isFirstTattoo = value.toLowerCase() === "yes";

        // ✅ Find torso parts dynamically from `anatomy-config.js`
        const torsoParts = Object.keys(anatomy_config).filter(key => {
            return anatomy_config[key]['hover'] === "CHEST" || anatomy_config[key]['hover'] === "ABDOMEN";
        });

        torsoParts.forEach(partID => {
            let partElement = $('#' + partID);

            if (isFirstTattoo) {
                console.log(`Disabling ${anatomy_config[partID]['hover']}`);
                partElement.css({fill: "rgba(100, 100, 100, 0.5)", pointerEvents: "none"});
                partElement.off(); // ✅ Remove all click/mouse events
            } else {
                console.log(`Enabling ${anatomy_config[partID]['hover']}`);
                partElement.css({fill: "rgba(255, 0, 0, 0)", pointerEvents: "auto"});
                addEvent(partID); // ✅ Reattach events
            }
        });

        updateBodyMap(); // ✅ Refresh body map
    }

})(jQuery);
