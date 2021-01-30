const {describe, it} = require("@jest/globals");

describe('Player', function () {
    const mockGuidedLearningData = {
        data: {
            css: 'testCss',
            structure: {
                steps: [
                    {
                        route: "0",
                        id: "1",
                        uid: "985-1",
                        action: {
                            type: "tip",
                            contents: {
                                "#content": "<p>Welcome to <em><strong>Google</strong></em>!</p>\n"
                            },
                            roleTexts: {},
                            placement: "right",
                            classes: "showPrevBt",
                            selector: "#hplogo",
                            stepOrdinal: 1,
                            onlyOneTip: true,
                            watchSelector: true,
                            warningTimeout: 3000,
                            exposeType: "both",
                            fixed: false,
                            watchDog: true,
                            wdInterval: 400
                        },
                        followers: [
                            {
                                condition: "true",
                                next: "3"
                            }
                        ]
                    }]
            },
            tiplates: {
                tip: 'testTip',
                hoverTip: 'testHoverTip'
            }
        }
    }
    beforeEach(()=>{
        window.jQuery = require('jquery');
        jest.spyOn(window.jQuery, "getJSON").mockImplementation((url, callback) => callback(mockGuidedLearningData));
    })

    it('should add script tag with Jquery', function () {
        require("../src/player");

        expect(document.head.innerHTML)
            .toBe('<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery-3.5.1.min.js\"></script>');
    });

    it('should call getJSON to get guided learning data', function () {
        require("../src/player");

        expect(window.jQuery.getJSON).toBeCalledTimes(1);
        expect(window.jQuery.getJSON).toHaveBeenCalledWith('https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?', expect.anything());
    });
});