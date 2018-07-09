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
        this._variables = Object.entries(Scratch3ArduinoBlocks.VARIABLE_TYPE).map(
            (item, index) => {
                return { text: item[0], value: item[1] };
            });

        this._digitalOutputs = Object.entries(Scratch3ArduinoBlocks.DIGITAL_OUTPUT).map(
            (item, index) => {
                return { text: item[0], value: item[1] };
            });

        this._pwmOutputs = Object.entries(Scratch3ArduinoBlocks.PWM_OUTPUT).map(
            (item, index) => {
                return { text: item[0], value: item[1] };
            });

        this._notes = Object.entries(Scratch3ArduinoBlocks.NOTE).map(
            (item, index) => {
                return { text: item[0], value: item[1] };
            });

        this._beats = Object.entries(Scratch3ArduinoBlocks.BEAT).map(
            (item, index) => {
                return item[1];
            });
    }

    /**
     * Types of variables.
     * @type {Array.<object.<string, string>>}
     * @return [Array] Variable types.
     */
    static get VARIABLE_TYPE() { 
        return {
            /** Type: double **/
            DOUBLE: 'double',

            /** Type: int **/
            INT: 'int',

            /** Type: int* **/
            INT_POINTER: 'int*',

            /** Type: char **/
            CHAR: 'char',

            /** Type: char* **/
            CHAR_POINTER: 'char*',

            /** Type: String **/
            STRING: 'String'
        };
    }
    /**
     * Output of digital pin.
     * @type {Array.<object.<string, int>>}
     * @return [Array] Outputs.
     */
    static get DIGITAL_OUTPUT() {
        return {
            /** Output: HIGH **/
            HIGH: 1,

            /** Output: LOW **/
            LOW: 0
        };
    }

    /**
     * Output of PWM pin.
     * @type {Array.<object.<string, int>>}
     * @return [Array] Outputs.
     */
    static get PWM_OUTPUT() {
        return {
            '0': 0,
            '50': 50,
            '100': 100,
            '150': 150,
            '255': 255
        };
    }

    static get NOTE() {
        return Note;
    }

    static get BEAT() {
        return {
            DOUBLE: { text: '2', value: 2000 },
            FULL: { text: '1', value: 1000 },
            HALF: { text: '1/2', value: 500 },
            QUARTER: { text: '1/4', value: 250 },
            EIGHTH: { text: '1/8', value: 125 }
        }
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
        return {
            id: 'arduino',
            name: 'Arduino',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'startArduino',
                    text: formatMessage({
                        id: 'arduino.startArduino',
                        default: 'Arduino Program',
                        description: 'Start run arduino program'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {}
                },
                /*
                {
                    opcode: 'setVarTypeAs',
                    text: formatMessage({
                        id: 'arduino.setVarType',
                        default: 'Set variable [VARIABLE] as type [TYPE]',
                        description: 'Set variable type'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VARIABLE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'arduino.defaultVariableName',
                                default: 'var1',
                                description: 'Variable name'
                            })
                        },
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'types',
                            defaultValue: Scratch3ArduinoBlocks.VARIABLE_TYPE.INT
                        }
                    }
                },
                */
                {
                    opcode: 'readDigital',
                    text: formatMessage({
                        id: 'arduino.readDigital',
                        default: 'Read digital pin [DIGITAL]',
                        description: 'Read digital from Pin'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        DIGITAL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        }
                    }
                },
                {
                    opcode: 'readAnalog',
                    text: formatMessage({
                        id: 'arduino.readAnalog',
                        default: 'Read analog pin(A) [ANALOG]',
                        description: 'Read analog from Pin.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ANALOG: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setDigitalOutput',
                    text: formatMessage({
                        id: 'arduino.setDigitalOutput',
                        default: 'Set digital pin [PIN] output as [OUTPUT]',
                        description: 'Set digital pin as output.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        OUTPUT: {
                            type: ArgumentType.STRING,
                            menu: 'digitalOutputs',
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_OUTPUT.HIGH
                        }
                    }
                },
                {
                    opcode: 'setPwmOutput',
                    text: formatMessage({
                        id: 'arduino.setPwmOutput',
                        default: 'Set PWM pin [PIN] output as [OUTPUT]',
                        description: 'Set PWM pin as output.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        },
                        OUTPUT: {
                            type: ArgumentType.NUMBER,
                            //menu: 'pwmOutputs',
                            defaultValue: 0,
                            minValue: 0,
                            maximum: 255
                        }
                    }
                },
                {
                    opcode: 'setPlaySpeed',
                    text: formatMessage({
                        id: 'arduino.setPlaySpeed',
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
                    opcode: 'rest',
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
                    opcode: 'playToneTillEnd',
                    text: formatMessage({
                        id: 'arduino.playToneTillEnd',
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
                            defaultValue: 500
                        }
                    }
                },
                {
                    opcode: 'playTone',
                    text: formatMessage({
                        id: 'arduino.playTone',
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
                            defaultValue: 500
                        }
                    }
                },
                {
                    opcode: 'setServoAngle',
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
                    opcode: 'writeTextToSerial',
                    text: formatMessage({
                        id: 'arduino.writeTextToSerial',
                        default: 'Write text [TEXT] to serial',
                        description: 'Write text to serial.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    }
                },
                {
                    opcode: 'readUltrasonic',
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
                    text: formatMessage({
                        id: 'arduino.readTemperature',
                        default: 'Read temperature from pin [DAT]',
                        description: 'Read temperature from pin.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        DAT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        }
                    }
                },
                {
                    opcode: 'readTime',
                    text: formatMessage({
                        id: 'arduino.readTime',
                        default: 'Read time now',
                        description: 'Read current time.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: { }
                },
                {
                    opcode: 'setTime',
                    text: formatMessage({
                        id: 'arduino.setTime',
                        default: 'Set time now',
                        description: 'Set current time.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: { }
                },
                {
                    opcode: 'set4DigitalTube',
                    text:formatMessage({
                        id: 'arduino.set4DigitalTube',
                        default: 'Set tube CLK[CLK] DIO[DIO] display time [TIME]',
                        description: 'Set tube display time XX:XX.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CLK: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ''
                        },
                        DIO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ''
                        },
                        TIME: {
                            type: ArgumentType.STRING,
                            defaultValue: '00:00'
                        }
                    }
                },
                {
                    opcode: 'readGestureSensor',
                    text: formatMessage({
                        id: 'arduino.readGestureSensor',
                        default: 'Read direction gesture sensor on pin [PIN]',
                        description: 'Read direction from gesture sensor.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: { 
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        }
                    }
                }
            ],
            menus: {
                types: this._variables,
                digitalOutputs: this._digitalOutputs,
                //pwmOutputs: this._pwmOutputs,
                notes: this._notes,
                beats: this._beats
            }
        };
    }

    /**
     * Run Arduino 
     * @param {object} args - the block arguments.
     * @return {boolean} - true if the button is pressed.
     */
    startArduino (args) {
        //console.debug(args);
    }

    setVarTypeAs(args) {
        console.debug(args);
    }

    readDigital(args) {
    }

    readAnalog(args) {
    }

    setDigitalOutput(args) {
    }

    setPwmOutput(args) {
    }

    setPlaySpeed(args) {
    }

    rest(args) {
    }

    playToneTillEnd(args) {
    }

    playTone(args) {
    }

    setServoAngle(args) {
    }

    writeTextToSerial(args) {
    }

    readUltrasonic(args) {
    }

    readTemperature(args) {
    }

    readTime(args) {
    }

    setTime(args) {
    }

    set4DigitalTube(args) {
    }

    readGestureSensor(args) {
    }
}
module.exports = Scratch3ArduinoBlocks;
