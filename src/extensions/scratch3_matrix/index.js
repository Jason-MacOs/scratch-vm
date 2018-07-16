const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjYgMjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI2IDI2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSI2LjMiIGN5PSI4LjciIHI9IjIuNSIvPg0KPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMTMuMSIgY3k9IjguNyIgcj0iMi41Ii8+DQo8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSIxOS43IiBjeT0iOC43IiByPSIyLjUiLz4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjYuMyIgY3k9IjE3LjMiIHI9IjIuNSIvPg0KPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMTMuMSIgY3k9IjE3LjMiIHI9IjIuNSIvPg0KPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMTkuNyIgY3k9IjE3LjMiIHI9IjIuNSIvPg0KPC9zdmc+DQo=';

// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjYgMjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI2IDI2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojNTg1Rjc1O30NCjwvc3R5bGU+DQo8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSI0LjkiIGN5PSI3LjgiIHI9IjMiLz4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjEzLjEiIGN5PSI3LjgiIHI9IjMiLz4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjIxLjEiIGN5PSI3LjgiIHI9IjMiLz4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjQuOSIgY3k9IjE4LjIiIHI9IjMiLz4NCjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjEzLjEiIGN5PSIxOC4yIiByPSIzIi8+DQo8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSIyMS4xIiBjeT0iMTguMiIgcj0iMyIvPg0KPC9zdmc+DQo=';

/**
 * Class for the Arduino block in Scratch 3.0.
 * @constructor
 */
class Scratch3MatrixBlocks {
    constructor () {
        this._direction = Object.entries(Scratch3MatrixBlocks.DIRECTION).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.matrix.direction.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'Directions(UP/DOWN/LEFT/RIGHT).',
                });
                return { text: label, value: item[1] };
            });

        this._brightness = Object.entries(Scratch3MatrixBlocks.BRIGHTNESS).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.matrix.brightness.${item[0]}`,
                    default: `${item[0]}`,
                    description: 'Brightness(QUARTER/HALF/FULL).',
                });
                return { text: label, value: item[1] };
            });
    }

    static get BRIGHTNESS() {
        return {
            QUARTER: 0,
            HALF: 3,
            FULL: 15
        };
    }

    static get DIRECTION() {
        return {
            UP: 0,
            DOWN: 1,
            LEFT: 2,
            RIGHT: 3
        };
    }

    /**
     * The key to load & store a target's translate state.
     * @return {string} The key.
     */
    static get STATE_KEY () {
        return 'Scratch.matrix';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'matrix',
            name: '点阵屏',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'display',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.matrix.display',
                        default: 'Display graphics[GRAPH]',
                        description: 'Display preset graphics.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GRAPH: {
                            type: ArgumentType.STRING,
                            defaultValue: '图案'
                        }
                    }
                },
                {
                    opcode: 'move',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.matrix.move',
                        default: 'Display graphics[GRAPH] and move to [DIRECTION] in [DURATION] second',
                        description: 'Display graphics and move'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GRAPH: {
                            type: ArgumentType.STRING,
                            defaultValue: '图案'
                        },
                        DIRECTION: {
                            type: ArgumentType.NUMBER,
                            menu: 'direction',
                            defaultValue: Scratch3MatrixBlocks.DIRECTION.LEFT
                        },
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'brightness',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.matrix.brightness',
                        default: 'Set brightness[BRIGHTNESS]',
                        description: 'Set brightness'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BRIGHTNESS: {
                            type: ArgumentType.NUMBER,
                            menu: 'brightness',
                            defaultValue: Scratch3MatrixBlocks.BRIGHTNESS.HALF
                        }
                    }
                },
                {
                    opcode: 'clear',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.matrix.clear',
                        default: 'Clear display',
                        description: 'Clear display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: { }
                },
                {
                    opcode: 'setPin',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.matrix.setPin',
                        default: 'Set DIN pin[DIN] CS pin[CS] CLK pin[CLK]',
                        description: 'Set pins'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 7
                        },
                        CS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 8
                        },
                        CLK: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        }
                    }
                },
                {
                    opcode: 'char2graph',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.matrix.char2graph',
                        default: 'Convert char [CHAR] to graph',
                        description: 'Convert char to graph'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        CHAR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'A'
                        }
                    }
                },
                {
                    opcode: 'makeGraph',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.matrix.makeGraph',
                        default: 'Make graphics[GRAPH]',
                        description: 'Make graphics'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        GRAPH: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                }
            ],
            menus: {
                brightness: this._brightness,
                direction: this._direction
            }
        };
    }

    idle() {
    }
}
module.exports = Scratch3MatrixBlocks;
