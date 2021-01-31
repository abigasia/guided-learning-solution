const GUIDED_LEARNING_DATA_URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?";
const ActionType = {
    TIP: 'tip',
    CLOSESCENARIO: 'closeScenario'
};

let steps;
let currStepIndex = 0;

function addToolTip(tooltipCss, tip) {
    var styleTag = document.createElement('link');
    styleTag.rel = 'stylesheet';
    styleTag.href = 'https://guidedlearning.oracle.com/player/latest/static/css/stTip.css';
    document.head.appendChild(styleTag);

    (window.jQuery)(document.body).append("<style>" + tooltipCss + "</style>");
    (window.jQuery)(document.body).append("<div  class='sttip'> " +
        "<div class='tooltip in'> " +
        "<div class='tooltip-arrow'></div>" +
        "<div class='tooltip-arrow second-arrow'></div>" +
        "<div class='popover-inner'>" +
        tip +
        "</div>" +
        "</div>" +
        "</div>");

    addTooltipContent();
}

function addTooltipContent(){
    let action = steps[currStepIndex].action;
    let content;
    if (action.type === ActionType.TIP) {
        content = action.contents["#content"];
    } else {
        content = '<p>You have completed guided learning. Happy Browsing !!</p>';
    }

    (window.jQuery)("div[data-iridize-id='content']").html(content);
}

function getSteps() {
    window.jQuery.getJSON(
        GUIDED_LEARNING_DATA_URL,
        (json) => {
            let guidedLearningData = json.data;
            steps = guidedLearningData.structure.steps;
            if(steps && steps.length>0)
                addToolTip(guidedLearningData.css, guidedLearningData.tiplates.tip );
        }
    );
}

(function startGuidedLearning(){
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
    document.head.appendChild(scriptTag);
    scriptTag.onload = getSteps;
})()

module.exports = {
    getSteps
}