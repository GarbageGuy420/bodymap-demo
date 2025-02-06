( function( $ ) {

    "use strict";

    // Load Jotform Widget API
    (function() {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = '//js.jotform.com/JotFormCustomWidget.min.js?onload=onLoadCallback';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();

    function isTouchEnabled() {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
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
        _obj.attr({'cursor': 'pointer'});

        if (basic_config[id]['active'] === true) {
            if (isTouchEnabled()) {
                _obj.on('touchend', function (e) {
                    handleSelection(id, e);
                });
            } else {
                _obj.on('click', function (e) {
                    handleSelection(id, e);
                });
            }
        }
    }

    function handleSelection(id, event) {
        var selectedRegion = basic_config[id]['hover'];
        console.log("Selected region:", selectedRegion);

        // Highlight the selected area
        $('[id^="basic_"]').css({'fill': 'rgba(255, 0, 0, 0)'}); // Reset others
        $('#' + id).css({'fill': 'rgba(255, 0, 0, 0.7)'});

        // Send selected body region data to Jotform
        sendSelectionToJotform(selectedRegion);
    }

    // Function to send the selected body region to Jotform
    function sendSelectionToJotform(region) {
        if (typeof JFCustomWidget !== 'undefined' && JFCustomWidget.sendData) {
            JFCustomWidget.sendData({
                valid: true,
                value: region
            });
        } else {
            console.error("JFCustomWidget is not available.");
        }
    }

    $(document).on("mouseenter", "path[id^='basic_']", function() {
        $(this).css({'fill': 'rgba(255, 0, 0, 0.5)'});
    });

    $(document).on("mouseleave", "path[id^='basic_']", function() {
        if (!$(this).hasClass("selected")) {
            $(this).css({'fill': 'rgba(255, 0, 0, 0)'});
        }
    });

    $(document).on("click", "#reset-selection", function() {
        $("path[id^='basic_']").removeClass("selected").css({'fill': 'rgba(255, 0, 0, 0)'});
        JFCustomWidget.sendData({ valid: false, value: "" });
        console.log("Selection reset");
    });

})(jQuery);
