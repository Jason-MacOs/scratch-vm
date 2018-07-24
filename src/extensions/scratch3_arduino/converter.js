const ArduinoGenerator = require('./generator');
const LcdGenerator = require('../scratch3_lcd/generator');
const Blocks = require('../../engine/blocks');
const jsBeautifier = require('../../util/js-beautify');

class Converter {
    constructor(runtime) {
        this.runtime = runtime;
        this.arduinoCode = '';
        this.arduinoAmount = 0;        
        
        this.BlockToArduino = this.BlockToArduino.bind(this);
        this.getInputsValue = this.getInputsValue.bind(this);
        this.blockToArr = this.blockToArr.bind(this);
        this.getArduinoCode = this.getArduinoCode.bind(this)
    }

    getArduinoCode() {
        const blocks = this.runtime.getEditingTarget().blocks;
        this.BlockToArduino(blocks);
        
        return this.arduinoCode;
    }
    
    BlockToArduino(blocks) {
            this.initArduinoCode(blocks);
            this.initCheckout(blocks);
            this.arduinoHandleBlocks();
            
            // need to process arrays in order
            this.handleBlockArr(this.ReportBlockArr);
            this.handleBlockArr(this.globalArr1);
            this.handleBlockArr(this.setupArr);
            this.handleBlockArr(this.globalArr2)
            this.handleBlockArr(this.loopArr);
            
            this.handleVariable();
            this.handleDef();
            this.handlePinMode();
            this.arduinoCodeUpdate();
    }

    initArduinoCode(blocks) {
        this.arduinoAmount = 0;
        this.blocks = blocks;
        this._blocks = blocks._blocks;


        this.includeCode = '';
        this.macroCode = '';
        this.variableCode = '';
        this.defCode = '';
        this.arduinoCode = '';
        this.pinModeCode = '';
        this.setupCode = '';
        this.loopCode = '';

        this.variableArr = [
            {name: 'angle_rad', type: 'double', value: 'PI/180.0'},
            {name: 'angle_deg', type: 'double', value: '180.0/PI'},
            {name: `BEAT_DELAY`, type: 'int', value: `60 * 1000 / 60`}
        ];
        this.includeArr = [];
        this.macroArr = [];
        this.defArr = [];
        this.ReportBlockArr = [];
        this.pinModeArr = [];
        this.globalArr1 = [];
        this.setupArr = [];
        this.globalArr2 = [];
        this.loopArr = [];

        this.ArduinoGenerator = new ArduinoGenerator();
        this.LcdGenerator = new LcdGenerator();
        this.generatorMap = Object.assign(
            this.ArduinoGenerator.getPrimitives(),
            this.LcdGenerator.getPrimitives()
        );

        for(let key in this.generatorMap) {
            this.generatorMap[key] = this.generatorMap[key].bind(this);
        }

    }

    getInputsValue(block) {
        const inputs = block.inputs;
        const obj = {};
        for(const key in inputs) {
            const _block = this.blocks.getBlock(inputs[key].block);
            if(!_block) continue;
            const opcode =  _block.opcode;
         
            if(this.generatorMap[opcode] && opcode.includes('arduino') && !key.includes('SUBSTACK')) {
               const args = this.getInputsValue(_block);
               const _obj = this.generatorMap[opcode](args)
               obj[key] = _obj.work;
               _obj.work = '';
               this.ReportBlockArr.push(_obj);
               continue;
            }

            if(this.generatorMap[opcode] && opcode === 'data_variable') {
                const args = this.blocks._getBlockParams(_block);
                const _obj = this.generatorMap[opcode](args);
                obj[key] = _obj.work;
                _obj.work = '';
                this.variableArr.push(_obj.variable);
                continue;
            }

            if(this.generatorMap.hasOwnProperty(opcode)) {
                const args = this.getInputsValue(_block);
                obj[key] = this.generatorMap[opcode](args);
                continue;
            }
            const back = this.blocks._getBlockParams(_block);
            obj[key] = Object.values(back)[0];
        }


        return obj;
    }

    blockToArr(block, type) {
        const arr = [];
        const hasSubstack = block.inputs.hasOwnProperty('SUBSTACK');
        let nextBlock = hasSubstack ? this.blocks.getBlock(block.inputs.SUBSTACK.block) : null;
        
        while(nextBlock) {
            arr.push(this.generatorMap[nextBlock.opcode](nextBlock, type));
            nextBlock = nextBlock.next && this.blocks.getBlock(nextBlock.next);
        }
        
        return arr;
    }

    arduinoHandleBlocks() {
        const _blocks = Object.assign({}, this.blocks._blocks);

        for(let key in _blocks) {

            if(!this._isInArduinoStart(key)) continue;

            if(_blocks[key].opcode === 'arduino_start') {
                let startBlock = _blocks[_blocks[key].next];
                if(startBlock && 
                    startBlock.opcode !== 'arduino_setup' &&
                    startBlock.opcode !== 'arduino_loop' )
                    this.globalArr1 = this.handleGlobalBlock(startBlock);
                continue;
            }

            if(_blocks[key].opcode === 'arduino_setup') {
                this.setupArr = this.generatorMap.arduino_setup(_blocks[key]);

                let startBlock = _blocks[_blocks[key].next];
                if(startBlock && 
                    startBlock.opcode !== 'arduino_loop' )
                    this.globalArr2 = this.handleGlobalBlock(startBlock);
                continue;
            }

            if(_blocks[key].opcode === 'arduino_loop') {
                this.loopArr = this.generatorMap.arduino_loop(_blocks[key]);
                // this.handleBlockArr(this.loopArr);
                continue;
            }
        }
        this.ReportBlockArr = this.handleReportBlock();
    }

    _isInArduinoStart(id) {
       const topId = this.blocks.getTopLevelScript(id);
       return this.blocks._blocks[topId].opcode === 'arduino_start'; 
    }
 
    arduinoCodeUpdate() {
        if(this.arduinoAmount === 1) {
            this.arduinoCode = `${this.variableCode}${this.defCode}void setup(){${this.pinModeCode}${this.setupCode}}void loop(){${this.loopCode}}`;
            this.arduinoCodeTemplate();
        }else {
            this.arduinoCode = ``;
        }
    }

    arduinoCodeTemplate() {
        this.arduinoCode = jsBeautifier(this.arduinoCode);
        // Due to the jsBeautifier is unable to identify "#define #include"
        // Manual formatting
        this.handleMacro();
        this.handleInclude();
        this.arduinoCode = `${this.includeCode}${this.macroCode}` + this.arduinoCode;
    }
    
    handleReportBlock() {
        return this.ReportBlockArr;
    }

    handleGlobalBlock(startBlock) {
        return this.generatorMap.arduino_outsideBlocks(startBlock);
    }

    handleBlockArr(arr) {
        if(!arr || !arr.length) return;
        for(let i = 0, len = arr.length; i < len; i++) {
            this._handleData(arr[i])
        }

        return this;
    }

    _handleData(arg, t) {
        const type = arg.workType || t;
        if(typeof arg === 'string') {
            this[type + 'Code'] += arg;
        }

        if(Array.isArray(arg)) {
            // Prohibition of modification of original object
            const arr = Array.from(arg);
            while(arr.length > 0) {
                let data = arr.shift();
                this._handleData(data, arg.type);
            }
        }

        if(Object.prototype.toString.call(arg) === '[object Object]') {
            if(arg.includes) {
                arg.includes.map((value) => {
                    if(!this._hasSameInclude(value))
                        this.includeArr.push(value);
                })
            }
            if(arg.macros) {
                arg.macros.map((obj) => {
                    let key = this._hasSameMacro(obj)
                    if(!key && key !== 0) {
                        this.macroArr.push(Object.assign({}, obj));
                    }else {
                        this.macroArr.splice(key, 1, Object.assign({}, obj));
                    }
                });
            }
            if(arg.variables) {
                arg.variables.map((obj) => {
                    let key = this._hasSameVariable(obj)
                    if(!key && key !== 0) {
                        this.variableArr.push(Object.assign({}, obj));
                    }else {
                        this.variableArr.splice(key, 1, Object.assign({}, obj));
                    }
                });
            }
            if(arg.def) {
                arg.def.map((obj) => {
                    let key = this._hasSameDef(obj);
                    if(!key && key !== 0) {
                        this.defArr.push(Object.assign({}, obj));
                    }else {
                        this.defArr.splice(key, 1, Object.assign({}, obj));
                    }
                });
            }
            if(arg.pinMode) {
                arg.pinMode.map(obj => {
                    let key = this._hasSamePin(obj);
                    if(!key && key !== 0) {
                        this.pinModeArr.push(Object.assign({}, obj));
                    }
                });
            }
            if(arg.setup)
                this.setupCode += arg.setup;
            if(arg.loop)
                this.loopCode += arg.loop;
            if(arg.work)
                this[type + 'Code'] += arg.work;
        }
    }

    /**
     * 检查程序是否合法，初始化变量
     * @param  {Array} blocks 所有积木数组
     * @return {this}        [description]
     */
    initCheckout(blocks) {
        const _blocks = Object.assign(blocks._blocks);
        Object.values(_blocks).forEach(b => {
            if(!this.generatorMap.hasOwnProperty(b.opcode) && !b.shadow) {
                throw new Error('包含有非法积木！');
            }
    
            if(b.opcode === 'arduino_start') {
                this.arduinoAmount += 1;
            }

            if(this.arduinoAmount > 1) throw new Error('不允许有两个"Arduino"以上程序');

            if(b.opcode === 'data_variable') {
                const name = b.fields.VARIABLE.value;
                const type = b.fields.VARIABLE.variableType || 'int';
                const variable = {name, type};
                if(!this._hasSameVariable(variable))
                    this.variableArr.push({name, type});
            }
        });
        
        
        return this;
    }

    handlePinMode() {
        const arr = Array.from(this.pinModeArr);
        arr.map((obj) => {
            let str = `${obj.value}`;
            this.pinModeCode += str;
        });
    }

    handleInclude() {
        const arr = Array.from(this.includeArr);
        arr.map((value) => {
            let str = `#include <${value}>\n`;
            this.includeCode += str;
        });
    }
    
    handleMacro() {
        const arr = Array.from(this.macroArr);
        arr.map((obj) => {
            let str = `#define ${obj.name} ${obj.value}\n`;
            this.macroCode += str;
        });
    }

    handleVariable() {
        const arr = Array.from(this.variableArr);
        for(let i = 0, len = arr.length; i < len; i++) {
            let str = `${arr[i].type} ${arr[i].name}`;
            if(arr[i].value)
                str += ` = ${arr[i].value}`;
            str += `;`
            this.variableCode += str;
        }
    }

    handleDef() {
        const arr = Array.from(this.defArr);
        arr.map((obj) => {
           this.defCode += obj.value; 
        });
    }

    _hasSamePin(pinMode) {
        for(let key = this.pinModeArr.length; key--;) {
            if(this.pinModeArr[key].num === pinMode.num) {
                return key;
            }
        }
        return false;
    }

    _hasSameVariable(variable) {
        for(let key = this.variableArr.length; key--;) {
            if(this.variableArr[key].name === variable.name) {
                return key;
            }
        }
        return false;
    }

    _hasSameInclude(include) {
        return this.includeArr.indexOf(include) !== -1;
    }

    _hasSameMacro(macro) {
        for(let key = this.macroArr.length; key--;) {
            if(this.macroArr[key].name === macro.name) {
                return key;
            }
        }
        return false;
    }

    _hasSameDef(def) {
        for(let key = this.defArr.length; key--;) {
            if(this.defArr[key].name === def.name) {
                return key;
            }
        }
        return false;
    }

    
}

module.exports = Converter;
