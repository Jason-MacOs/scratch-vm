const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
//const nets = require('nets');
const formatMessage = require('format-message');
const Note = require('./note');

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
            DOUBLE: { text: '2 beats', value: 2000 },
            FULL: { text: '1 beat', value: 1000 },
            HALF: { text: '1/2 beat', value: 500 },
            QUARTER: { text: '1/4 beat', value: 250 },
            EIGHTH: { text: '1/8 beat', value: 125 }
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
            menuIconURI: '', // TODO: Add the final icons.
            blockIconURI: '',
            blocks: [
                {
                    opcode: 'startArduino',
                    text: formatMessage({
                        id: 'arduino.block.startArduino',
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
                        id: 'arduino.block.setVarType',
                        default: 'Set variable [VARIABLE] as type [TYPE]',
                        description: 'Set variable type'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VARIABLE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'arduino.block.defaultVariableName',
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
                        id: 'arduino.block.readDigital',
                        default: 'Read digital pin [DIGITAL]',
                        description: 'Read digital from Pin'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        DIGITAL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'readAnalog',
                    text: formatMessage({
                        id: 'arduino.block.readAnalog',
                        default: 'Read analog pin [ANALOG]',
                        description: 'Read analog from Pin.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ANALOG: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'setDigitalPinOutput',
                    text: formatMessage({
                        id: 'arduino.block.setDigitalPinOutput',
                        default: 'Set digital pin [PIN] output as [OUTPUT]',
                        description: 'Set digital pin as output.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        OUTPUT: {
                            type: ArgumentType.STRING,
                            menu: 'digitalOutputs',
                            defaultValue: Scratch3ArduinoBlocks.DIGITAL_OUTPUT.HIGH
                        }
                    }
                },
                {
                    opcode: 'setPwmPinOutput',
                    text: formatMessage({
                        id: 'arduino.block.setPwmPinOutput',
                        default: 'Set PWM pin [PIN] output as [OUTPUT]',
                        description: 'Set PWM pin as output.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        OUTPUT: {
                            type: ArgumentType.NUMBER,
                            menu: 'pwmOutputs',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'playTonePin',
                    text: formatMessage({
                        id: 'arduino.block.playTonePin',
                        default: 'Play tone pin [PIN] on note [NOTE] beat [BEAT]',
                        description: 'Play tone pin.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
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
                    opcode: 'setServoPinAngle',
                    text: formatMessage({
                        id: 'arduino.block.setServoPinAngle',
                        default: 'Set servo pin [PIN] angle as [ANGLE]',
                        description: 'Set servo pin angle.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
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
                        id: 'arduino.block.writeTextToSerial',
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
                        id: 'arduino.block.readUltrasonic',
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
                }
            ],
            menus: {
                types: this._variables,
                digitalOutputs: this._digitalOutputs,
                pwmOutputs: this._pwmOutputs,
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

    setDigitalPinOutput(args) {
    }

    setPwmPinOutput(args) {
    }

    playTonePin(args) {
    }

    setServoPinAngle(args) {
    }

    writeTextToSerial(args) {
    }

    readUltrasonic(args) {
    }
}
module.exports = Scratch3ArduinoBlocks;
