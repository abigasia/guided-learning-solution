const GUIDED_LEARNING_DATA_URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?";

function addToolTip(guidedLearningData) {
    var styleTag = document.createElement('link');
    styleTag.rel = 'stylesheet';
    styleTag.href = 'https://guidedlearning.oracle.com/player/latest/static/css/stTip.css';
    document.head.appendChild(styleTag);

    (window.jQuery)(document.body).append("<style>" + guidedLearningData.css + "</style>");
    (window.jQuery)(document.body).append("<div  class='sttip'> " +
        "<div class='tooltip in'> " +
        "<div class='tooltip-arrow'></div>" +
        "<div class='tooltip-arrow second-arrow'></div>" +
        "<div class='popover-inner'>" +
        guidedLearningData.tiplates.tip +
        "</div>" +
        "</div>" +
        "</div>");
}

function getSteps() {
    window.jQuery.getJSON(
        GUIDED_LEARNING_DATA_URL,
        (json) => {
            let guidedLearningData = json.data;
            addToolTip(guidedLearningData);
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