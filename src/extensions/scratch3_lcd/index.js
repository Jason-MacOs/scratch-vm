// Module: LCD Blocks
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
//const nets = require('nets');
const formatMessage = require('format-message');

// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjYgMjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI2IDI2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNC42LDIuOWMtMC41LDAtMC44LDAuNC0wLjgsMC44djEuN2gxLjdWMy44QzUuNSwzLjMsNS4xLDIuOSw0LjYsMi45eiBNOCwyLjljLTAuNSwwLTAuOCwwLjQtMC44LDAuOHYxLjdoMS43DQoJVjMuOEM4LjgsMy4zLDguNCwyLjksOCwyLjl6IE0xMS4zLDIuOWMtMC41LDAtMC44LDAuNC0wLjgsMC44djEuN2gxLjdWMy44QzEyLjIsMy4zLDExLjgsMi45LDExLjMsMi45eiBNMTQuNywyLjkNCgljLTAuNSwwLTAuOCwwLjQtMC44LDAuOHYxLjdoMS43VjMuOEMxNS41LDMuMywxNS4xLDIuOSwxNC43LDIuOXogTTE4LDIuOWMtMC41LDAtMC44LDAuNC0wLjgsMC44djEuN2gxLjdWMy44DQoJQzE4LjksMy4zLDE4LjUsMi45LDE4LDIuOXogTTIxLjQsMi45Yy0wLjUsMC0wLjgsMC40LTAuOCwwLjh2MS43aDEuN1YzLjhDMjIuMiwzLjMsMjEuOCwyLjksMjEuNCwyLjl6IE0yLjgsNi4zDQoJQzIuNCw2LjQsMi4xLDYuNywyLjEsNy4xdjExLjdjMCwwLjUsMC40LDAuOCwwLjgsMC44aDIwLjFjMC41LDAsMC44LTAuNCwwLjgtMC44VjcuMWMwLTAuNS0wLjQtMC44LTAuOC0wLjhoLTguM0gyLjkNCglDMi45LDYuMywyLjksNi4zLDIuOCw2LjNDMi44LDYuMywyLjgsNi4zLDIuOCw2LjN6IE0zLjgsOGgxMWg3LjVWMThIMy44Vjh6IE0xMy4xLDkuNmMtMS4zLDAtMi43LDEtMi43LDMuNWMwLDEuOSwwLjgsMy4zLDIuNSwzLjMNCgljMC40LDAsMC44LTAuMSwxLTAuMmwtMC4xLTEuMWMtMC4yLDAtMC40LDAuMS0wLjYsMC4xYy0wLjgsMC0xLjQtMC42LTEuNC0yLjJjMC0xLjcsMC42LTIuMywxLjQtMi4zYzAuMywwLDAuNSwwLjEsMC42LDAuMUwxNCw5LjgNCglDMTMuOCw5LjcsMTMuNSw5LjYsMTMuMSw5LjZ6IE0xNi44LDkuNmMtMC41LDAtMSwwLjEtMS4zLDAuMXY2LjZjMC4zLDAsMC43LDAuMSwxLjEsMC4xYzAuOSwwLDEuNi0wLjIsMi0wLjcNCgljMC42LTAuNSwwLjktMS41LDAuOS0yLjhjMC0xLjMtMC4zLTIuMi0wLjktMi43QzE4LjMsOS44LDE3LjcsOS42LDE2LjgsOS42eiBNNi4zLDkuNnY2LjdoM3YtMS4xSDcuNlY5LjZINi4zeiBNMTcuMSwxMC42DQoJYzAuOCwwLDEuMiwwLjksMS4yLDIuMmMwLDEuOS0wLjYsMi41LTEuMiwyLjVjLTAuMSwwLTAuMiwwLTAuMiwwdi00LjdDMTYuOSwxMC42LDE3LDEwLjYsMTcuMSwxMC42eiBNMy44LDIwLjV2MS43DQoJYzAsMC41LDAuNCwwLjgsMC44LDAuOHMwLjgtMC40LDAuOC0wLjh2LTEuN0gzLjh6IE03LjEsMjAuNXYxLjdjMCwwLjUsMC40LDAuOCwwLjgsMC44czAuOC0wLjQsMC44LTAuOHYtMS43SDcuMXogTTEwLjUsMjAuNXYxLjcNCgljMCwwLjUsMC40LDAuOCwwLjgsMC44YzAuNSwwLDAuOC0wLjQsMC44LTAuOHYtMS43SDEwLjV6IE0xMy44LDIwLjV2MS43YzAsMC41LDAuNCwwLjgsMC44LDAuOGMwLjUsMCwwLjgtMC40LDAuOC0wLjh2LTEuN0gxMy44eg0KCSBNMTcuMiwyMC41djEuN2MwLDAuNSwwLjQsMC44LDAuOCwwLjhzMC44LTAuNCwwLjgtMC44di0xLjdIMTcuMnogTTIwLjUsMjAuNXYxLjdjMCwwLjUsMC40LDAuOCwwLjgsMC44czAuOC0wLjQsMC44LTAuOHYtMS43SDIwLjUNCgl6Ii8+DQo8L3N2Zz4NCg==';

// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjYgMjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI2IDI2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojNTg1Rjc1O30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNC42LDIuOWMtMC41LDAtMC44LDAuNC0wLjgsMC44djEuN2gxLjdWMy44QzUuNSwzLjMsNS4xLDIuOSw0LjYsMi45eiBNOCwyLjljLTAuNSwwLTAuOCwwLjQtMC44LDAuOHYxLjdoMS43DQoJVjMuOEM4LjgsMy4zLDguNCwyLjksOCwyLjl6IE0xMS4zLDIuOWMtMC41LDAtMC44LDAuNC0wLjgsMC44djEuN2gxLjdWMy44QzEyLjIsMy4zLDExLjgsMi45LDExLjMsMi45eiBNMTQuNywyLjkNCgljLTAuNSwwLTAuOCwwLjQtMC44LDAuOHYxLjdoMS43VjMuOEMxNS41LDMuMywxNS4xLDIuOSwxNC43LDIuOXogTTE4LDIuOWMtMC41LDAtMC44LDAuNC0wLjgsMC44djEuN2gxLjdWMy44DQoJQzE4LjksMy4zLDE4LjUsMi45LDE4LDIuOXogTTIxLjQsMi45Yy0wLjUsMC0wLjgsMC40LTAuOCwwLjh2MS43aDEuN1YzLjhDMjIuMiwzLjMsMjEuOCwyLjksMjEuNCwyLjl6IE0yLjgsNi4zDQoJQzIuNCw2LjQsMi4xLDYuNywyLjEsNy4xdjExLjdjMCwwLjUsMC40LDAuOCwwLjgsMC44aDIwLjFjMC41LDAsMC44LTAuNCwwLjgtMC44VjcuMWMwLTAuNS0wLjQtMC44LTAuOC0wLjhoLTguM0gyLjkNCglDMi45LDYuMywyLjksNi4zLDIuOCw2LjNDMi44LDYuMywyLjgsNi4zLDIuOCw2LjN6IE0zLjgsOGgxMWg3LjVWMThIMy44Vjh6IE0xMy4xLDkuNmMtMS4zLDAtMi43LDEtMi43LDMuNWMwLDEuOSwwLjgsMy4zLDIuNSwzLjMNCgljMC40LDAsMC44LTAuMSwxLTAuMmwtMC4xLTEuMWMtMC4yLDAtMC40LDAuMS0wLjYsMC4xYy0wLjgsMC0xLjQtMC42LTEuNC0yLjJjMC0xLjcsMC42LTIuMywxLjQtMi4zYzAuMywwLDAuNSwwLjEsMC42LDAuMUwxNCw5LjgNCglDMTMuOCw5LjcsMTMuNSw5LjYsMTMuMSw5LjZ6IE0xNi44LDkuNmMtMC41LDAtMSwwLjEtMS4zLDAuMXY2LjZjMC4zLDAsMC43LDAuMSwxLjEsMC4xYzAuOSwwLDEuNi0wLjIsMi0wLjcNCgljMC42LTAuNSwwLjktMS41LDAuOS0yLjhjMC0xLjMtMC4zLTIuMi0wLjktMi43QzE4LjMsOS44LDE3LjcsOS42LDE2LjgsOS42eiBNNi4zLDkuNnY2LjdoM3YtMS4xSDcuNlY5LjZINi4zeiBNMTcuMSwxMC42DQoJYzAuOCwwLDEuMiwwLjksMS4yLDIuMmMwLDEuOS0wLjYsMi41LTEuMiwyLjVjLTAuMSwwLTAuMiwwLTAuMiwwdi00LjdDMTYuOSwxMC42LDE3LDEwLjYsMTcuMSwxMC42eiBNMy44LDIwLjV2MS43DQoJYzAsMC41LDAuNCwwLjgsMC44LDAuOHMwLjgtMC40LDAuOC0wLjh2LTEuN0gzLjh6IE03LjEsMjAuNXYxLjdjMCwwLjUsMC40LDAuOCwwLjgsMC44czAuOC0wLjQsMC44LTAuOHYtMS43SDcuMXogTTEwLjUsMjAuNXYxLjcNCgljMCwwLjUsMC40LDAuOCwwLjgsMC44YzAuNSwwLDAuOC0wLjQsMC44LTAuOHYtMS43SDEwLjV6IE0xMy44LDIwLjV2MS43YzAsMC41LDAuNCwwLjgsMC44LDAuOGMwLjUsMCwwLjgtMC40LDAuOC0wLjh2LTEuN0gxMy44eg0KCSBNMTcuMiwyMC41djEuN2MwLDAuNSwwLjQsMC44LDAuOCwwLjhzMC44LTAuNCwwLjgtMC44di0xLjdIMTcuMnogTTIwLjUsMjAuNXYxLjdjMCwwLjUsMC40LDAuOCwwLjgsMC44czAuOC0wLjQsMC44LTAuOHYtMS43SDIwLjUNCgl6Ii8+DQo8L3N2Zz4NCg==';

/**
 * Class for the LCD blocks in Scratch 3.0.
 * @constructor
 */
class Scratch3LCDBlocks {
    constructor () {
        this._bases = Object.entries(Scratch3LCDBlocks.BASES).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.lcd.${item[0]}`,
                    default: item[0],
                    description: `Base: ${item[0]}`
                });
                return { text: label, value: String(item[1]) };
            });

        this._visible = Object.entries(Scratch3LCDBlocks.VISIBLE).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.lcd.visible.${item[0]}`,
                    default: item[0],
                    description: ''
                });
                return { text: label, value: String(item[1]) };
            });

        this._blink = Object.entries(Scratch3LCDBlocks.VISIBLE).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.lcd.blink.${item[0]}`,
                    default: item[0],
                    description: ''
                });
                return { text: label, value: String(item[1]) };
            });

        this._display = Object.entries(Scratch3LCDBlocks.VISIBLE).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.lcd.display.${item[0]}`,
                    default: item[0],
                    description: ''
                });
                return { text: label, value: String(item[1]) };
            });

        this._enabled = Object.entries(Scratch3LCDBlocks.VISIBLE).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.lcd.enabled.${item[0]}`,
                    default: item[0],
                    description: ''
                });
                return { text: label, value: String(item[1]) };
            });

        this._sides = Object.entries(Scratch3LCDBlocks.SIDES).map(
            (item, index) => {
                let label = formatMessage({
                    id: `arduino.lcd.sides.${item[0]}`,
                    default: item[0],
                    description: ''
                });
                return { text: label, value: String(item[1]) };
            });
    }

    /**
     * Bases
     * @type {Array.<object.<string, int>>}
     * @return [Array] Bases.
     */
    static get BASES() {
        return {
            'BIN': 2,
            'OCT': 8,
            'DEC': 10,
            'HEX': 16,
        };
    }

    static get VISIBLE() {
        return {
            'no': 0,
            'yes': 1
        };
    }

    static get SIDES() {
        return {
            'left': 0,
            'right': 1
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
        return {
            id: 'lcd',
            name: 'LCD',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'declear',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.create',
                        default: 'Create LCD RS pin[RS] E pin[E] D4 pin[D4] D5 pin[D5] D6 pin [D6] D7 pin[D7]',
                        description: 'Declear a LCD variable'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        RS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        E: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        D4: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        D5: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        D6: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        D7: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        }
                    }
                },
                {
                    opcode: 'begin',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.begin',
                        default: 'LCD begin with cols [COLS] rows [ROWS]',
                        description: 'Begin LCD display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        ROWS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 9
                        }
                    }
                },
                {
                    opcode: 'clear',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.clear',
                        default: 'LCD clear',
                        description: 'Clear LCD.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: { }
                },
                {
                    opcode: 'resetCursor',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.resetCursor',
                        default: 'LCD reset cursor',
                        description: 'Reset LCD cursor'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: { }
                },
                {
                    opcode: 'setCursor',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.setCursor',
                        default: 'LCD set cursor location col [COL] row [ROW]',
                        description: 'Set LCD cursor to location (col, row).'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        ROW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'write',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.write',
                        default: 'LCD write data [DATA]',
                        description: 'Write data to LCD cursor.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'print',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.print',
                        default: 'LCD print data [DATA]',
                        description: 'Print data to LCD cursor.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'printBase',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.printBase',
                        default: 'LCD print data [DATA] with base [BASE]',
                        description: 'Print data to LCD cursor with base.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        BASE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            menu: 'bases'
                        }
                    }
                },
                {
                    opcode: 'cursorVisible',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.cursorVisible',
                        default: 'LCD [VISIBLE] cursor',
                        description: 'Show LCD cursor.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VISIBLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: 'visible'
                        }
                    }
                },
                {
                    opcode: 'cursorBlink',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.cursorBlink',
                        default: 'LCD [BLINK] cursor',
                        description: 'Make LCD cursor blink.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BLINK: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: 'blink'
                        }
                    }
                },
                {
                    opcode: 'display',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.display',
                        default: 'LCD [DISPLAY]',
                        description: 'Make LCD display.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DISPLAY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: 'display'
                        }
                    }
                },
                {
                    opcode: 'scrollSide',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.scrollSide',
                        default: 'LCD scroll to [SIDE]',
                        description: 'Scroll LCD to side.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SIDE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            menu: 'sides'
                        }
                    }
                },
                {
                    opcode: 'autoScroll',
                    func: 'idle',
                    text: formatMessage({
                        id: 'arduino.lcd.autoScroll',
                        default: 'LCD make auto scroll [ENABLED]',
                        description: 'Make LCD auto scroll.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ENABLED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: 'enabled'
                        }
                    }
                }
            ],
            menus: {
                bases: this._bases,
                blink: this._blink,
                display: this._display,
                enabled: this._enabled,
                sides: this._sides,
                visible: this._visible
            }
        };
    }

    idle() {
    }
}
module.exports = Scratch3LCDBlocks;
