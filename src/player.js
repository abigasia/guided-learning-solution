const GUIDED_LEARNING_DATA_URL = "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?";

function getSteps() {
    window.jQuery.getJSON(
        GUIDED_LEARNING_DATA_URL,
        (json) => {
            let guidedLearningData = json.data;
        }
    );
}
(function addJQueryScript(){
    var scriptTag = document.createElement('script');
    scriptTag.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
    scriptTag.type = 'text/javascript';
    document.head.appendChild(scriptTag);
    scriptTag.onload = getSteps;
})()
