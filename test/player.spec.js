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

    afterEach(()=>{
        jest.clearAllMocks();
        document.body.innerHTML = "";
        document.head.innerHTML = "";
    })

    it('should add script tag with Jquery', function () {
        require("../src/player");

        expect(document.head.innerHTML)
            .toBe('<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery-3.5.1.min.js\"></script>');
    });

    it('should call getJSON to get guided learning data', function () {
        const { getSteps, steps } = require("../src/player");
        getSteps();
        expect(window.jQuery.getJSON).toBeCalledTimes(1);
        expect(window.jQuery.getJSON).toHaveBeenCalledWith('https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=?', expect.anything());
    });

    it('should add tooltip & its stylesheet', function () {
        const { getSteps } = require("../src/player");
        getSteps();
        expect(document.head.innerHTML)
            .toBe('<link rel=\"stylesheet\" href=\"https://guidedlearning.oracle.com/player/latest/static/css/stTip.css\"><style>testCss</style>');
        expect(document.body.innerHTML).toBe('<div class="sttip" style="position: absolute; top: 0px; left: 0px;">' +
            ' <div class="tooltip in"> <div class="tooltip-arrow"></div>' +
            '<div class="tooltip-arrow second-arrow"></div>' +
            '<div class="popover-inner">testTip</div></div></div>')
    });

    it('should not add tooltip & its stylesheet oif no steps found', function () {
        jest.spyOn(window.jQuery, "getJSON").mockImplementation((url, callback) => callback({
            data: {
                css: 'testCss',
                structure: {
                    steps: null
                },
                tiplates: {
                    tip: 'testTip',
                    hoverTip: 'testHoverTip'
                }
            }
        }));
        const { getSteps } = require("../src/player");
        getSteps();
        expect(document.head.innerHTML)
            .toBe('');
        expect(document.body.innerHTML).toBe('')
    });

    it('should add content to tooltip', function () {
        const { getSteps } = require("../src/player");
        document.body.innerHTML =
            '<div data-iridize-id="content"></div>';
        getSteps();

        expect((window.jQuery)("div[data-iridize-id='content']").text()).toEqual('Welcome to Google!\n');
    });

    it('should add ending message content to tooltip if action type is closeScenario', function () {
        jest.spyOn(window.jQuery, "getJSON").mockImplementation((url, callback) => callback({
            data: {
                css: 'testCss',
                structure: {
                    steps: [{
                        "route": "0",
                        "id": "eol0",
                        "action": {
                            "type": "closeScenario",
                            "stepOrdinal": 5,
                            "onlyOneTip": false,
                            "watchSelector": false,
                            "warningTimeout": 3000,
                            "exposeType": "both",
                            "fixed": false
                        },
                        "followers": [],
                        "uid": "226-1"
                    }]
                },
                tiplates: {
                    tip: 'testTip',
                    hoverTip: 'testHoverTip'
                }
            }
        }));

        const { getSteps } = require("../src/player");
        document.body.innerHTML =
            '<div data-iridize-id="content"></div>';
        getSteps();

        expect((window.jQuery)("div[data-iridize-id='content']").text()).toEqual('You have completed guided learning. Happy Browsing !!');
    });

    it('should position tooltip on basis of selector and placement', function () {
        const { getSteps } = require("../src/player");

        document.body.innerHTML = "<div id='hplogo'></div>";

        const getBoundingClientRectSpy = jest.fn(() => ({ top: 100, right: 100 }));
        global.document.getElementById = jest.fn(() => ({
            getBoundingClientRect: getBoundingClientRectSpy  // <= add getBoundingClientRect
        }));

        getSteps();

        expect(document.querySelector(".sttip").style.position).toBe('absolute');
        expect(document.querySelector(".sttip").style.top).toBe('100px');
        expect(document.querySelector(".sttip").style.left).toBe('100px');
    });
});