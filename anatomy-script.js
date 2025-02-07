(function ($) {
    "use strict";

    const JOTFORM_API_KEY = "2875655dc082f4f5b4566a3477e9cc6b";
    const FORM_ID = "{myFormID}"; // JotForm will replace this dynamically

    function isTouchEnabled() {
        return (('ontouchstart' in window) ||
            (navigator.MaxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    $(document).ready(function () {
        updateBodyMap();

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
                $(e).hide();
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
                sendPlacement(anatomy_config[id]['hover']);
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
            JFCustomWidget.sendData({ placementSelection: selection });
        } else {
            console.warn("JFCustomWidget not found - running outside Jotform.");
        }
    }

    function initializeJotformIntegration() {
        JF.initialize({ apiKey: JOTFORM_API_KEY });

        JFCustomWidget.subscribe("ready", function () {
            console.log("Widget Ready. Requesting data from parent form...");

            JFCustomWidget.subscribe("change", function(data) {
                if (data && data.name === "typeA") {
                    console.log("First Tattoo Field Updated:", data.value);
                    handleFirstTattooRestriction(data.value);
                }
            });

            JFCustomWidget.getWidgetSetting("previousPlacement", function(value) {
                if (value) {
                    console.log("Previous Placement from form:", value);
                    highlightPreviousSelection(value);
                }
            });

            fetchFormSubmissions();
        });

        JFCustomWidget.subscribe("submit", function () {
            console.log("Submitting widget data");
            JFCustomWidget.sendSubmit({
                placementSelection: $("path[fill='rgba(255, 0, 0, 0.3)']").attr('id')
            });
        });
    }

    function fetchFormSubmissions() {
        JF.getFormSubmissions(FORM_ID, function(response) {
            if (response.length > 0) {
                const submission = response[0];
                const firstTattooAnswer = submission.answers["3"].answer;

                console.log("Fetched First Tattoo Status:", firstTattooAnswer);
                handleFirstTattooRestriction(firstTattooAnswer);
            }
        });
    }

    function highlightPreviousSelection(placement) {
        $("path[id^='basic_']").each(function () {
            if ($(this).attr('id') === placement) {
                $(this).css({'fill': 'rgba(0, 0, 255, 0.3)'}); // Highlight in blue
            }
        });
    }

    function handleFirstTattooRestriction(value) {
        const isFirstTattoo = value.toLowerCase() === "yes";

        const torsoParts = Object.keys(anatomy_config).filter(key => {
            return anatomy_config[key]['hover'] === "CHEST" || anatomy_config[key]['hover'] === "ABDOMEN";
        });

        torsoParts.forEach(partID => {
            if (isFirstTattoo) {
                anatomy_config[partID]['active'] = false;
                $('#' + partID).hide();
                console.log(`Disabled: ${anatomy_config[partID]['hover']}`);
            } else {
                anatomy_config[partID]['active'] = true;
                $('#' + partID).show();
                addEvent(partID);
                console.log(`Enabled: ${anatomy_config[partID]['hover']}`);
            }
        });

        updateBodyMap();
    }

})(jQuery);
