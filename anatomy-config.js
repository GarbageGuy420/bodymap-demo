function sendSelection(bodyPart) {
    window.parent.postMessage({ selectedPlacement: bodyPart }, "*");
}

var basic_config = {
    "basic_1": {//head
        "hover": "HEAD",
        "url": "javascript:sendSelection('HEAD')",
        "target": "none",
        "active": true
    },
    "basic_2": {//neck
        "hover": "NECK",
        "url": "javascript:sendSelection('NECK')",
        "target": "none",
        "active": true
    },
    "basic_3": {//chest
        "hover": "CHEST",
        "url": "javascript:sendSelection('CHEST')",
        "target": "none",
        "active": true
    },
    "basic_4": {//abdomen
        "hover": "ABDOMEN",
        "url": "javascript:sendSelection('ABDOMEN')",
        "target": "none",
        "active": true
    },
    "basic_5": {//pelvis
        "hover": "PELVIS",
        "url": "javascript:sendSelection('PELVIS')",
        "target": "none",
        "active": true
    },
    "basic_6": {//arm-rt
        "hover": "ARM [RT]",
        "url": "javascript:sendSelection('ARM [RT]')",
        "target": "none",
        "active": true
    },
    "basic_7": {//arm-lt
        "hover": "ARM [LT]",
        "url": "javascript:sendSelection('ARM [LT]')",
        "target": "none",
        "active": true
    },
    "basic_8": {//leg-rt
        "hover": "LEG [RT]",
        "url": "javascript:sendSelection('LEG [RT]')",
        "target": "none",
        "active": true
    },
    "basic_9": {//leg-lt
        "hover": "LEG [LT]",
        "url": "javascript:sendSelection('LEG [LT]')",
        "target": "none",
        "active": true
    }
};
