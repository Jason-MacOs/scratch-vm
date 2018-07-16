const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
//const nets = require('nets');
const formatMessage = require('format-message');
const Note = require('./note');

// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgNDAgNDAiPg0KICAgIDxkZWZzPg0KICAgICAgICA8c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9PC9zdHlsZT4NCiAgICA8L2RlZnM+DQogICAgPHRpdGxlPuWunumqjDwvdGl0bGU+DQogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzguNzIsMjBhOS4wOCw5LjA4LDAsMCwwLTkuMjItOC45LDguNDksOC40OSwwLDAsMC0xLjQyLjExYy0zLjk1LjU1LTYuNiwzLjQtOC4wOCw1LjU4LTEuNDgtMi4xOC00LjEzLTUtOC4wOC01LjU4YTkuNyw5LjcsMCwwLDAtMS40Mi0uMTFBOS4wNyw5LjA3LDAsMCwwLDEuMjgsMjBhOS4wOCw5LjA4LDAsMCwwLDkuMjIsOC45LDguNjksOC42OSwwLDAsMCwxLjQzLS4xMWM0LS41Nyw2LjYtMy40MSw4LjA4LTUuNTksMS40OCwyLjE4LDQuMTMsNSw4LjA4LDUuNTlhOS43Myw5LjczLDAsMCwwLDEuNDMuMTEsOS4wOCw5LjA4LDAsMCwwLDkuMi04LjlNMTEuNDcsMjUuNjhhNi40NSw2LjQ1LDAsMCwxLTEsLjA2QTUuOTEsNS45MSwwLDAsMSw0LjQzLDIwYTUuOTEsNS45MSwwLDAsMSw2LjA3LTUuNzQsOC4wNiw4LjA2LDAsMCwxLDEsLjA2YzMuNzMuNTQsNiw0LjIxLDYuNzgsNS42OC0uNzksMS40OC0zLjA4LDUuMTQtNi43OSw1LjY4TTIxLjc0LDIwYy43Ny0xLjQ3LDMuMDUtNS4xNCw2Ljc4LTUuNjhhOC4wNiw4LjA2LDAsMCwxLDEtLjA2QTUuOTEsNS45MSwwLDAsMSwzNS41NiwyMGE1LjkyLDUuOTIsMCwwLDEtNi4wNiw1Ljc0LDguMDYsOC4wNiwwLDAsMS0xLS4wNmMtMy43My0uNTQtNi00LjIxLTYuNzgtNS42OCIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTgsMTkuMTNoNS41NHYxLjc4SDhabTIyLjE2LDEuNzlIMzJWMTkuMTNIMzAuMTFWMTcuMjZoLTEuOHYxLjg3SDI2LjQ0djEuNzloMS44N3YxLjg3aDEuOFoiLz4NCjwvc3ZnPg==';

// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPg0KICAgIDxkZWZzPg0KICAgICAgICA8c3R5bGU+LmNscy0xe2ZpbGw6IzU3NWU3NTt9PC9zdHlsZT4NCiAgICA8L2RlZnM+DQogICAgPHRpdGxlPuWunumqjDI8L3RpdGxlPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE5LjU0LDEwLjEzQTQuNjIsNC42MiwwLDAsMCwxNC44NSw1LjZhNS44MSw1LjgxLDAsMCwwLS43Mi4wNUE2LjIxLDYuMjEsMCwwLDAsMTAsOC41LDYuMjEsNi4yMSwwLDAsMCw1LjkxLDUuNjVhNS44MSw1LjgxLDAsMCwwLS43Mi0uMDVBNC42MSw0LjYxLDAsMCwwLC41LDEwLjEzYTQuNjEsNC42MSwwLDAsMCw0LjY5LDQuNTMsNC41OSw0LjU5LDAsMCwwLC43My0uMDZBNi4yNiw2LjI2LDAsMCwwLDEwLDExLjc1YTYuMjEsNi4yMSwwLDAsMCw0LjExLDIuODUsNC4yOCw0LjI4LDAsMCwwLC43Mi4wNiw0LjYyLDQuNjIsMCwwLDAsNC42OC00LjUzTTUuNjgsMTNhNC4xOSw0LjE5LDAsMCwxLS41LDBBMywzLDAsMCwxLDIuMSwxMC4xMywzLDMsMCwwLDEsNS4xOSw3LjIxYTQsNCwwLDAsMSwuNDksMGMxLjkuMjcsMy4wNiwyLjE0LDMuNDUsMi44OS0uNC43NS0xLjU2LDIuNjItMy40NSwyLjg5bTUuMjItMi44OWMuMzktLjc1LDEuNTYtMi42MiwzLjQ1LTIuODlhNC4xOSw0LjE5LDAsMCwxLC41LDAsMywzLDAsMCwxLDMuMDksMi45MiwzLDMsMCwwLDEtMy4wOSwyLjkyLDQuMTksNC4xOSwwLDAsMS0uNSwwYy0xLjg5LS4yNy0zLjA2LTIuMTQtMy40NS0yLjg5Ii8+DQogICAgPHJlY3QgY2xhc3M9ImNscy0xIiB4PSIzLjg5IiB5PSI5LjY5IiB3aWR0aD0iMi44MiIgaGVpZ2h0PSIwLjkxIi8+DQogICAgPHBvbHlnb24gY2xhc3M9ImNscy0xIiBwb2ludHM9IjE1LjE2IDEwLjYgMTYuMTEgMTAuNiAxNi4xMSA5LjY5IDE1LjE2IDkuNjkgMTUuMTYgOC43MyAxNC4yNSA4LjczIDE0LjI1IDkuNjkgMTMuMyA5LjY5IDEzLjMgMTAuNiAxNC4yNSAxMC42IDE0LjI1IDExLjU1IDE1LjE2IDExLjU1IDE1LjE2IDEwLjYiLz4NCjwvc3ZnPg==';

/**
 * Class for the Arduino block in Scratch 3.0.
 * @constructor
 */
class Scratch3ArduinoBlocks {
    constructor () {
        this._digitalOutputs = Object.entries(Scratch3ArduinoBlocks.DIGITAL_OUTPUT).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.digital.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'Digital output(HIGH/LOW)'
                });
                return { text: label, value: item[1] };
            });

        this._notes = Object.entries(Scratch3ArduinoBlocks.NOTE).map(
            (item, index) => {
                return { text: item[0], value: item[1] };
            });

        this._beats = Object.entries(Scratch3ArduinoBlocks.BEAT).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.beat.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'Beats'
                });
                return { text: label, value: item[1] };
            });

        this._motors = Object.entries({'first': 1, 'second': 2}).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.motor.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'Motor index'
                });
                return { text: label, value: item[1] };
            });

        this._digitalPins = Object.entries(Scratch3ArduinoBlocks.DIGITAL_PIN).map(
            (item, index) => {
                return { text: item[0], value: item[1] };
            });

        this._analogPins = Object.entries(Scratch3ArduinoBlocks.ANALOG_PIN).map(
            (item, index) => {
                return { text: item[0], value: item[1] };
            });

        this._pwmPins = Object.entries(Scratch3ArduinoBlocks.PWM_PIN).map(
            (item, index) => {
                return { text: item[0].split('_').pop()/*remove PWM_*/, value: item[1] };
            });

        this._println = Object.entries(Scratch3ArduinoBlocks.CHOICE).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.println.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'Auto new line.'
                });
                return { text: label, value: item[1] };
            });

        this._months = Object.entries(Scratch3ArduinoBlocks.MONTH).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.month.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'Month.'
                });
                return { text: label, value: item[1] };
            });

        this._rtc = Object.entries(Scratch3ArduinoBlocks.RTC).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.rtc.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'RTC unit.'
                });
                return { text: label, value: item[1] };
            });

        this._types = Object.entries(Scratch3ArduinoBlocks.TYPE).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.types.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'Variable type.'
                });
                return { text: label, value: item[1] };
            });
    }

    /**
     * Output of digital pin.
     * @type {Array.<object.<string, int>>}
     * @return [Array] Outputs.
     */
    static get DIGITAL_OUTPUT() {
        return {
            /** Digital output: HIGH **/
            'HIGH': 1,

            /** Digital output: LOW **/
            'LOW': 0
        };
    }

    static get NOTE() {
        return Note;
    }

    static get BEAT() {
        return {
            DOUBLE: 2,
            FULL: 1,
            HALF: 1 / 2,
            QUARTER: 1 / 4,
            EIGHTH: 1 / 8,
            ZERO: 0
        };
    }

    static get DIGITAL_PIN() {
        return {
            D0: 0,
            D1: 1,
            D2: 2,
            D3: 3,
            D4: 4,
            D5: 5,
            D6: 6,
            D7: 7,
            D8: 8,
            D9: 9,
            D10: 10,
            D11: 11,
            D12: 12,
            D13: 13,
            D14: 14,
            D15: 15,
            D16: 16,
            D17: 17,
            D18: 18,
            D19: 19
        };
    }

    static get ANALOG_PIN() {
        return {
            A0: 14,
            A1: 15,
            A2: 16,
            A3: 17,
            A4: 18,
            A5: 19
        };
    }

    static get PWM_PIN() {
        return {
            PWM_3: 3,
            PWM_5: 5,
            PWM_6: 6,
            PWM_9: 9,
            PWM_10: 10,
            PWM_11: 11
        };
    }

    static get CHOICE() {
        return {
            YES: 1,
            NO: 0
        }
    }

    static get MONTH() {
        return {
            'Jan.': 0,
            'Feb.': 1,
            'Mar.': 2,
            'Apr.': 3,
            'May.': 4,
            'Jun.': 5,
            'Jul.': 6,
            'Aug.': 7,
            'Sep.': 8,
            'Oct.': 9,
            'Nov.': 10,
            'Dec.': 11
        };
    }

    static get RTC() {
        return {
            'YEAR': 'year',
            'MONTH': 'month',
            'DATE': 'date',
            'HOUR': 'hour',
            'MINUTE': 'minute'
        };
    }

    static get TYPE() {
        return {
            DOUBLE: 'double',
            INT: 'int',
            POINTER_INT: 'int*',
            CHAR: 'char',
            POINTER_CHAR: 'char*',
            STRING: 'String'
        };
    }

    /**
     * The key to load & store a target's translate state.
     * @return {string} The key.
     */
    static get STATE_KEY () {
        return 'Scratch.arduino';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        const NOW = new Date();
        return {
            id: 'arduino',
            name: 'Arduino',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'start',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.start',
                        default: 'Arduino',
                        description: 'Start run arduino program'
                    }),
                    blockType: BlockType.HAT,
                    arguments: { }
                },
                {
                    opcode: 'setup',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.setup',
                        default: 'Initialize',
                        description: 'setup function of Arduino'
                    }),
                    blockType: BlockType.CONDITIONAL,
                    arguments: { }
                },
                {
                    opcode: 'loop',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.loop',
                        default: 'Loop',
                        description: 'Loop function of Arduino'
                    }),
                    blockType: BlockType.LOOP,
                    isTerminal: true,
                    arguments: { }
                },
                {
                    opcode: 'setVariableType',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.setVariableType',
                        default: 'Set variable[VARIABLE] type [TYPE]',
                        description: 'Set variable type.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VARIABLE: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        },
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'types',
                            defaultValue: Scratch3ArduinoBlocks.TYPE.INT
                        }
                    }
                },
                {
                    opcode: 'readDigital',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.readDigital',
                        default: 'Read digital pin [DIGITAL]',
                        description: 'Read digital from Pin'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        DIGITAL: {
                            type: ArgumentType.NUMBER,
                            //menu: 'digitalPins',
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D9
                        }
                    }
                },
                {
                    opcode: 'readAnalog',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.readAnalog',
                        default: 'Read analog pin(A) [ANALOG]',
                        description: 'Read analog from Pin.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ANALOG: {
                            type: ArgumentType.NUMBER,
                            menu: 'analogPins',
                            defaultValue: Scratch3ArduinoBlocks.ANALOG_PIN.A0
                        }
                    }
                },
                {
                    opcode: 'writeDigital',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.writeDigital',
                        default: 'Set digital pin [PIN] output as [OUTPUT]',
                        description: 'Set digital pin as output.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            //menu: 'digitalPins',
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D9
                        },
                        OUTPUT: {
                            type: ArgumentType.STRING,
                            menu: 'digitalOutputs',
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_OUTPUT.HIGH
                        }
                    }
                },
                {
                    opcode: 'writePwm',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.writePwm',
                        default: 'Write PWM pin [PIN] output as [OUTPUT]',
                        description: 'Write PWM pin as output.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'pwmPins',
                            defaultValue: Scratch3ArduinoBlocks.PWM_PIN.PWM_5
                        },
                        OUTPUT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setSpeed',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.setSpeed',
                        default: 'Set play speed [BPM] beats',
                        description: 'Set play speed to XX beats per minute.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BPM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60
                        }
                    }
                },
                {
                    opcode: 'playAndWait',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.playAndWait',
                        default: 'Play tone pin [PIN] on note [NOTE] beat [BEAT] till end',
                        description: 'Play tone pin till end.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        NOTE: {
                            type: ArgumentType.STRING,
                            menu: 'notes',
                            defaultValue: Scratch3ArduinoBlocks.NOTE.C4
                        },
                        BEAT: {
                            type: ArgumentType.NUMBER,
                            menu: 'beats',
                            defaultValue: Scratch3ArduinoBlocks.BEAT.HALF
                        }
                    }
                },
                {
                    opcode: 'play',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.play',
                        default: 'Play tone pin [PIN] on note [NOTE] beat [BEAT]',
                        description: 'Play tone pin.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        NOTE: {
                            type: ArgumentType.STRING,
                            menu: 'notes',
                            defaultValue: Scratch3ArduinoBlocks.NOTE.C4
                        },
                        BEAT: {
                            type: ArgumentType.NUMBER,
                            menu: 'beats',
                            defaultValue: Scratch3ArduinoBlocks.BEAT.HALF
                        }
                    }
                },
                {
                    opcode: 'rest',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.rest',
                        default: 'Rest for [BEAT] beats',
                        description: 'Rest for XX beats.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BEAT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.25
                        }
                    }
                },
                {
                    opcode: 'setServoAngle',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.setServoAngle',
                        default: 'Set servo pin [PIN] angle as [ANGLE]',
                        description: 'Set servo pin angle.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        ANGLE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'println',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.println',
                        default: 'Write text [TEXT] to serial [PRINTLN]',
                        description: 'Write text to serial.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        PRINTLN: {
                            type: ArgumentType.STRING,
                            menu: 'println',
                            defaultValue: Scratch3ArduinoBlocks.CHOICE.YES
                        }
                    }
                },
                {
                    opcode: 'readUltrasonic',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.readUltrasonic',
                        default: 'Read Ultrasonic sensor trig pin [TRIG] echo pin [ECHO]',
                        description: 'Read ultrasonic sensor trig pin .'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TRIG: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ''
                        },
                        ECHO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'readTemperature',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.readTemperature',
                        default: 'Read temperature from pin [DAT]',
                        description: 'Read temperature from pin.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        DAT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D9
                        }
                    }
                },
                {
                    opcode: 'readRTC',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.readRTC',
                        default: 'Read [RTC] from RTC',
                        description: 'Read year/month/date/hour/minute from RTC.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        RTC: {
                            type: ArgumentType.NUMBER,
                            menu: 'rtc',
                            defaultValue: Scratch3ArduinoBlocks.RTC.YEAR
                        }
                    }
                },
                {
                    opcode: 'setTime',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.setTime',
                        default: 'Set time with year[YEAR] month[MONTH] date[DATE] hour[HOUR] minute[MINUTE]',
                        description: 'Set time with year month date hour minute.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        YEAR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: NOW.getFullYear()
                        },
                        MONTH: {
                            type: ArgumentType.NUMBER,
                            //menu: 'months',
                            defaultValue: NOW.getMonth() + 1
                        },
                        DATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: NOW.getDate()
                        },
                        HOUR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: NOW.getHours()
                        },
                        MINUTE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: NOW.getMinutes()
                        }
                    }
                },
                {
                    opcode: 'setTimeNow',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.setTimeNow',
                        default: 'Set time now',
                        description: 'Set time now.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: { }
                },
                {
                    opcode: 'setTubeYear',
                    func: 'idle',
                    text:formatMessage({
                        id: 'arduino.setTubeYear',
                        default: 'Set tube CLK[CLK] DIO[DIO] display year [YEAR]',
                        description: 'Set tube display year YYYY.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CLK: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D7
                        },
                        DIO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D8
                        },
                        YEAR: {
                            type: ArgumentType.STRING,
                            defaultValue: NOW.getFullYear()
                        }
                    }
                },
                {
                    opcode: 'setTubeDate',
                    func: 'idle',
                    text:formatMessage({
                        id: 'arduino.setTubeDate',
                        default: 'Set tube CLK[CLK] DIO[DIO] display month[MONTH] date[DATE]',
                        description: 'Set tube display month and date MMDD.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CLK: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D7
                        },
                        DIO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D8
                        },
                        MONTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: NOW.getMonth()
                        },
                        DATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: NOW.getDate()
                        }
                    }
                },
                {
                    opcode: 'setTubeTime',
                    func: 'idle',
                    text:formatMessage({
                        id: 'arduino.setTubeTime',
                        default: 'Set tube CLK[CLK] DIO[DIO] display hour[HOUR] minute[MINUTE]',
                        description: 'Set tube display time HH:mm.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CLK: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D7
                        },
                        DIO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D8
                        },
                        HOUR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: NOW.getHours()
                        },
                        MINUTE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: NOW.getMinutes()
                        }
                    }
                },
                {
                    opcode: 'readGestureSensor',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.readGestureSensor',
                        default: 'Read direction gesture sensor on pin INT[PIN]',
                        description: 'Read direction from gesture sensor.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: { 
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D9
                        }
                    }
                },
                {
                    opcode: 'setRemotePin',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.setRemotePin',
                        default: 'Set remote pin[PIN]',
                        description: 'Set remote pin.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_PIN.D3
                        }
                    }
                },
                {
                    opcode: 'readRemoteData',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.readRemoteData',
                        default: 'Read remote',
                        description: 'Set remote pin.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: { }
                },
                {
                    opcode: 'setMotorSpeed',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.setMotorSpeed',
                        default: 'Set motor[MOTOR] speed[SPEED]',
                        description: 'Set motor speed.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MOTOR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: 'motors'
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'set2MotorsSpeed',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.set2MotorsSpeed',
                        default: 'Set motor1 speed[SPEED1] and motor2 speed[SPEED2]',
                        description: 'Set motor speed.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEED1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        SPEED2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                }
            ],
            menus: {
                digitalOutputs: this._digitalOutputs,
                motors: this._motors,
                notes: this._notes,
                digitalPins: this._digitalPins,
                analogPins: this._analogPins,
                pwmPins: this._pwmPins,
                println: this._println,
                months: this._months,
                rtc: this._rtc,
                beats: this._beats,
                types: this._types
            }
        };
    }

    idle() {
    }
}
module.exports = Scratch3ArduinoBlocks;
