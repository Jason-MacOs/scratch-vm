
class Generator {
    constructor() {
        
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            arduino_outsideBlocks: this.arduino_outsideBlocks,
            arduino_start: this.arduino_start,
            arduino_setup: this.arduino_setup,
            arduino_loop: this.arduino_loop,
            arduino_setVariableType: this.arduino_setVariableType,
            arduino_readDigital: this.arduino_readDigital,
            arduino_readAnalog: this.arduino_readAnalog,
            arduino_setServoAngle: this.arduino_setServoAngle,
            arduino_writeDigital: this.arduino_writeDigital,
            arduino_writePwm: this.arduino_writePwm,
            arduino_setSpeed: this.arduino_setSpeed,
            arduino_playAndWait: this.arduino_playAndWait,
            arduino_play: this.arduino_play,
            arduino_rest: this.arduino_rest,
            arduino_println: this.arduino_println,
            arduino_readUltrasonic: this.arduino_readUltrasonic,
            arduino_readTemperature: this.arduino_readTemperature,
            arduino_readRTC: this.arduino_readRTC,
            arduino_setTime: this.arduino_setTime,
            arduino_setTimeNow: this.arduino_setTimeNow,
            arduino_setTubeYear: this.arduino_setTubeYear,
            arduino_setTubeDate: this.arduino_setTubeDate,
            arduino_setTubeTime: this.arduino_setTubeTime,
            arduino_readGestureSensor: this.arduino_readGestureSensor,
            arduino_readRemoteData: this.arduino_readRemoteData,
            arduino_setMotorSpeed: this.arduino_setMotorSpeed,
            arduino_set2MotorsSpeed: this.arduino_set2MotorsSpeed,
            arduino_getKey: this.arduino_getKey,
            control_wait: this.control_wait,
            control_repeat: this.control_repeat,
            control_if: this.control_if,
            control_if_else: this.control_if_else,
            control_repeat_until: this.control_repeat_until,
            control_wait_until: this.control_wait_until,
            control_forever: this.control_forever,
            data_variable: this.data_variable,
            data_setvariableto: this.data_setvariableto,
            data_changevariableby: this.data_changevariableby,
            operator_add: this.add,
            operator_subtract: this.subtract,
            operator_multiply: this.multiply,
            operator_divide: this.divide,
            operator_lt: this.lt,
            operator_equals: this.equals,
            operator_gt: this.gt,
            operator_and: this.and,
            operator_or: this.or,
            operator_not: this.not,
            operator_random: this.random,
            operator_join: this.join,
            operator_letter_of: this.letterOf,
            operator_length: this.length,
            operator_contains: this.contains,
            operator_mod: this.mod,
            operator_round: this.round,
            operator_mathop: this.mathop
        }
    }

    arduino_outsideBlocks(startBlock) {
        startBlock = Object.assign({}, startBlock);
        let nextBlock = this.blocks.getBlock(startBlock.next);
        const type = 'setup';
        const arr = [];

        arr.push(this.generatorMap[startBlock.opcode](startBlock, type));

        while(
            nextBlock &&
            nextBlock.opcode !== 'arduino_setup' && 
            nextBlock.opcode !== 'arduino_loop') {

            arr.push(this.generatorMap[nextBlock.opcode](nextBlock, type))
            nextBlock = this._blocks[nextBlock.next];
        }

        return arr;
    }

    arduino_start() {

    }

    arduino_setup(block) {
        const type = 'setup';
        return this.blockToArr(block, type);
    }

    arduino_loop(block) {
        const type = 'loop';
        return this.blockToArr(block, type);
    }

    arduino_setVariableType(block, type) {
        const {TYPE, VARIABLE} = this.getInputsValue(block);
        const variables = [{name: `${VARIABLE}`, type: `${TYPE}`, value: ''}];
        return {variables};
    }

    arduino_readDigital(arg) {
       const {DIGITAL} = arg;

       const work = `digitalRead(${DIGITAL})`;
       const setup = `pinMode(${DIGITAL},INPUT);`;

       return {work, setup};
    }

    arduino_readAnalog(arg) {
        const {ANALOG} = arg;

        const work = `analogRead(${ANALOG})`;
        const setup = `pinMode(${ANALOG},INPUT);`;

        return {work, setup};
    }

    arduino_setServoAngle(block, type) {
        const obj = this.getInputsValue(block);
        const pin = obj.PIN;
        const angle = obj.ANGLE;
        
        const workType = type;
        const variables = [{name: `servo_${pin}`, type: 'Servo', value: ''}];
        const includes = ['Servo.h'];
        const work = `servo_${pin}.write(${angle});`
        const pinMode = [{
            num: `${pin}`,
            value: `servo_${pin}.attach(${pin});`
        }]

        return {workType, variables, includes, work, pinMode};
    }
    
    arduino_writeDigital(block, type) {
        const obj = this.getInputsValue(block);
        const pin = obj.PIN;
        const digitalOutputs = obj.OUTPUT;
        
        const workType = type;
        const work = `digitalWrite(${pin}, ${digitalOutputs});`;
        const pinMode =[{
            num: `${pin}`,
            value: `pinMode(${pin}, OUTPUT);`
        }];

        return {workType, work, pinMode};
    }
    
    arduino_writePwm(block, type) {
        const obj = this.getInputsValue(block);
        const pin = obj.PIN;
        const pwmOutputs = obj.OUTPUT;
        
        const workType = type;
        const work = `analogWrite(${pin}, ${pwmOutputs});`;
        const pinMode =[{
            num: `${pin}`,
            value: `pinMode(${pin}, OUTPUT);`
        }];


        return {workType, work, pinMode};
    }

    arduino_setSpeed(block, type) {
        const obj = this.getInputsValue(block);
        const bpm = obj.BPM;

        const variables = [
            {name: `BPM`, type: 'int', value: `${bpm}`},
            {name: `BEAT_DELAY`, type: 'int', value: `60 * 1000 / ${bpm}`}
        ];

        return {variables};
    }

    arduino_playAndWait(block, type) {
        const obj = this.getInputsValue(block);
        const {PIN, NOTE, BEAT} = obj;

        const includes = ['MeBuzzer.h'];
        const variables = [{name: `buzzer_${PIN}`, type: 'MeBuzzer'}];
        const workType = type;
        const work = `buzzer.tone(${PIN}, ${NOTE}, BEAT_DELAY*${BEAT});delay(BEAT_DELAY*${BEAT});`;
        const pinMode =[{
            num: `${PIN}`,
            value: `pinMode(${PIN}, OUTPUT);`
        }];


        return {includes, variables, work, workType, pinMode};
    }

    arduino_play(block, type) {
        const obj = this.getInputsValue(block);
        const {PIN, NOTE, BEAT} = obj;

        const includes = ['MeBuzzer.h'];
        const variables = [{name: `buzzer_${PIN}`, type: 'MeBuzzer'}];
        const workType = type;
        const work = `buzzer.tone(${PIN}, ${NOTE}, BEAT_DELAY*${BEAT});`;
        const pinMode =[{
            num: `${PIN}`,
            value: `pinMode(${PIN}, OUTPUT);`
        }];


        return {includes, variables, work, workType, pinMode};
    }

    arduino_rest(block, type) {
        const obj = this.getInputsValue(block);
        const {BEAT} = obj;

        const workType = type;
        const work = `delay(BEAT_DELAY*${BEAT});`;

        return {workType, work};
    }

    arduino_println(block, type) {
        const obj = this.getInputsValue(block);
        const {TEXT, PRINTLN} = obj;
        const speed = 115200;

        const setup = `Serial.begin(115200);`;
        const workType = type;
        const work = PRINTLN === '1' ? `Serial.println('${TEXT}');` : `Serial.print('${TEXT}');`

        return {setup, work, workType};
    }

    arduino_readUltrasonic(arg) {
        const {TRIG, ECHO} = arg;
        const def = [{name: 'getDistance', 
                    value: `float getDistance(int trig,int echo) {
                                pinMode(trig,OUTPUT);
                                digitalWrite(trig,LOW);
                                delayMicroseconds(2);
                                digitalWrite(trig,HIGH);
                                delayMicroseconds(10);
                                digitalWrite(trig,LOW);
                                pinMode(echo, INPUT);
                                return pulseIn(echo,HIGH,30000)/58.0;
                            }\n`
                    }];
        const work = `getDistance(${TRIG},${ECHO})`;

        return {def, work};
    }

    arduino_readTemperature(arg) {
        const {DAT} = arg;
        const includes = ['LiquidCrystal.h', 'DallasTemperature.h', 'OneWire.h'];
        const variables = [
            {name: `oneWire_${DAT}(${DAT})`, type: 'OneWire', value: ''},
            {name: `sensor_${DAT}(&oneWire_${DAT})`, type: 'DalasTemperature', value: ''},
        ];
        const def = [{
            name: 'readTemperature',
            value: `float readTemperature() {
                sensor_${DAT}.requestTemperatures();
                sensor_${DAT}.getTempCByIndex(0);
            }\n`

        }]
        const work = `readTemperature()`;
        const setup = `sensor_${DAT}.begin();`;

        return {includes, variables, work, setup, def};
    }

    arduino_readRTC(arg) {
        const {RTC} = arg;
        const includes = ['Wire.h', 'Sodaq_DS3231.h'];
        const macros = [
            {name: 'YEAR', value: '0'},
            {name: 'MONTH', value: '1'},
            {name: 'DATE', value: '2'},
            {name: 'HOUR', value: '3'},
            {name: 'MINUTE', value: '4'},
        ];
        const variables = [{name: 'now', type: 'DateTime', value: ''}];
        const def = [{name: 'readRTC', 
                    value: `int readRTC(int unit) {
                                switch(unit) {
                                    case YEAR:
                                        return now.year();
                                    case MONTH:
                                        return now.month();
                                    case DATE:
                                        return now.date();
                                    case HOUR:
                                        return now.hour();
                                    case MINUTE:
                                        return now.minute();
                                }
                            }\n`
                    }];
        const work = `readRTC(${RTC})`;
        const setup = `rtc.begin();`;
        const loop = `now = rtc.now();`;

        return {includes, macros, variables, def, work, setup, loop};
    }

    arduino_setTime(block, type) {
        const {YEAR, MONTH, MINUTE, HOUR, DATE} = this.getInputsValue(block);
        const includes = ['Wire.h', 'Sodaq_DS3231.h'];
        const macros = [
            {name: 'YEAR', value: '0'},
            {name: 'MONTH', value: '1'},
            {name: 'DATE', value: '2'},
            {name: 'HOUR', value: '3'},
            {name: 'MINUTE', value: '4'},
        ];
        const workType = type;
        const work = `DateTime dt = DateTime(${YEAR}, ${MONTH}, ${DATE}, ${HOUR}, ${MINUTE});rtc.setDateTime(dt);`
        const setup = `rtc.begin()`;
        
        return {includes, macros, workType, work, setup};
    }

    arduino_setTimeNow(block, type) {
        let d = new Date();
        const includes = ['Wire.h', 'Sodaq_DS3231.h'];
        const macros = [
            {name: 'YEAR', value: '0'},
            {name: 'MONTH', value: '1'},
            {name: 'DATE', value: '2'},
            {name: 'HOUR', value: '3'},
            {name: 'MINUTE', value: '4'},
        ];
        const setup = `rtc.begin();DateTime dt = DateTime(${d.getFullYear()}, ${d.getMonth()}, ${d.getDate()}, ${d.getHours()}, ${d.getMinutes()});rtc.setDateTime(dt);`;
        
        return {includes, macros, setup};
    }

    arduino_setTubeYear(block, type) {
        const {CLK, DIO, YEAR} = this.getInputsValue(block);
        const includes = ['TM1637.h'];
        const macros = [
            {name: 'YEAR', value: '0'},
            {name: 'MONTH', value: '1'},
            {name: 'DATE', value: '2'},
            {name: 'HOUR', value: '3'},
            {name: 'MINUTE', value: '4'},
        ];
        const variables = [
            {name: `tm_${CLK}_${DIO}(${CLK},${DIO})`, type: 'TM1637', value: ''}
        ];
        const def = [{name: 'displayYear', 
                    value: `void displayYear(TM1637 tm, int year) {
                                tm.point(false);
                                int b0 = year / 1000;
                                int b1 = year % 1000 / 100;
                                int b2 = year % 100 / 10;
                                int b4 = year % 10;
                                
                                tm.display(0, b0);
                                tm.display(1, b1);
                                tm.display(2, b2);
                                tm.display(3, b3);
                            }\n` 
                    }];
        const workType = type;
        const work = `displayYear(tm_${CLK}_${DIO}, now.year());`;
        const setup = `rtc.begin();`;
        const loop = `now = rtc.now();`;

        return {includes, macros, variables, def, work, workType, setup, loop};     
    }

    arduino_setTubeDate(block, type) {
        const {CLK, DIO, MONTH, DATE} = this.getInputsValue(block);
        const includes = ['TM1637.h'];
        const macros = [
            {name: 'YEAR', value: '0'},
            {name: 'MONTH', value: '1'},
            {name: 'DATE', value: '2'},
            {name: 'HOUR', value: '3'},
            {name: 'MINUTE', value: '4'},
        ];
        const variables = [
            {name: `tm_${CLK}_${DIO}(${CLK},${DIO})`, type: 'TM1637', value: ''}
        ];
        const def = [{name: 'displayDate', 
                    value: `void displayDate(TM1637 tm, int month, int date) {
                                tm.point(false);
                                
                                int b0 = month / 10;
                                int b1 = month % 10;
                                int b2 = date / 10;
                                int b4 = date % 10;
                                
                                tm.display(0, b0);
                                tm.display(1, b1);
                                tm.display(2, b2);
                                tm.display(3, b3);
                            }\n` 
                    }];
        const workType = type;
        const work = `displayDate(tm_${CLK}_${DIO}, now.month(), now.date());`;
        const setup = `rtc.begin();`;
        const loop = `now = rtc.now();`;

        return {includes, macros, variables, def, work, workType, setup, loop};       
    }
    
    arduino_setTubeTime(block, type) {
        const {CLK, DIO, HOUR, MINUTE} = this.getInputsValue(block);
        const includes = ['TM1637.h'];
        const macros = [
            {name: 'YEAR', value: '0'},
            {name: 'MONTH', value: '1'},
            {name: 'DATE', value: '2'},
            {name: 'HOUR', value: '3'},
            {name: 'MINUTE', value: '4'},
        ];
        const variables = [
            {name: `tm_${CLK}_${DIO}(${CLK},${DIO})`, type: 'TM1637', value: ''}
        ];
        const def = [{name: 'displayDate', 
                    value: `void displayTime(TM1637 tm, int hour, int minute) {
                            tm.point(ShowPoint);
                            ShowPoint = !ShowPoint;
                            
                            int b0 = hour / 10;
                            int b1 = hour % 10;
                            int b2 = minute / 10;
                            int b4 = minute % 10;
                            
                            tm.display(0, b0);
                            tm.display(1, b1);
                            tm.display(2, b2);
                            tm.display(3, b3);
                        }\n`
                    }];
        const workType = type;
        const work = `displayTime(tm_${CLK}_${DIO}, now.hour(), now.minute());`;
        const setup = `rtc.begin();`;
        const loop = `now = rtc.now();`;

        return {includes, macros, variables, def, work, workType, setup, loop};       
    }
    
    arduino_readGestureSensor(block, type) {
        const {PIN} = this.getInputsValue(block);
        const includes = ['Wire.h', 'SparkFun_APDS9960.h'];

        return {includes}; 
    }

    arduino_readRemoteData(arg) {
        const {PIN} = arg;
        const includes = ['IRremote.h'];
        const variables = [{
            name: `irrecv_${PIN}(${PIN})`,
            type: 'IRrecv',
            value: ''
        }, {
            name: `ircode_${PIN}[64]`,
            type: 'char',
            value: ' '
        }];
        const def = [{
            name: 'setupIrReceiver',
            value: `void setupIrReceiver(IRrecv irrecv) {
                    irrecv.enableIRIn();
                    irrecv.resume();
                }
                void charsToUpper(char *str) {
                    int p=0;
                    while(str[p] != 0) {
                        str[p] = toupper(str[p]);
                        ++p;
                    }
                }
                String getIrCommand(IRrecv irrecv, char *receivedCommand) {
                    decode_results result;
                    if (irrecv.decode(&result)) {
                        ltoa(result.value, receivedCommand, 16);
                        charsToUpper(receivedCommand);
                        irrecv.resume();
                    } else {
                        receivedCommand[0] = '\\0';
                    }
                    return String(receivedCommand);
                }\n`
        }];
        const work = `getIrCommand(IRrecv irrecv_${PIN}, ircode_${PIN})`;
        const setup = `setupIrReceiver(irrecv_${PIN});`;

        return {work, setup, def, includes, variables};
    }

    arduino_setMotorSpeed(block, type) {
        const {MOTOR, SPEED} = this.getInputsValue(block);
        const includes = ['BWBX_Robot.h'];
        const variables = [{name: 'robot', type: 'BWBX_Robot', value: ''}];
        const workType = type;
        const work = `robot.setRomeoMotor(${MOTOR},${SPEED})`;
        const setup = `digitalWrite(4, LOW);
                        digitalWrite(5, LOW);
                        digitalWrite(6, LOW);
                        digitalWrite(7, LOW);`;
        const pinMode =[{
            num: `4`,
            value: `pinMode(4, OUTPUT);`
        }, {
            num: `5`,
            value: `pinMode(5, OUTPUT);`
        }, {
            num: `6`,
            value: `pinMode(6, OUTPUT);`
        }, {
            num: `7`,
            value: `pinMode(7, OUTPUT);`
        }];

        return {includes, variables, work, workType, setup, pinMode};
    }

    arduino_set2MotorsSpeed(block, type) {
        const {SPEED1, SPEED2} = this.getInputsValue(block);
        const includes = ['BWBX_Robot.h'];
        const variables = [{name: 'robot', type: 'BWBX_Robot', value: ''}];
        const workType = type;
        const work = `robot.setRomeoMotor(1,${SPEED1});robot.setRomeoMotor(2,${SPEED2});`;
        const setup = `digitalWrite(4, LOW);
                        digitalWrite(5, LOW);
                        digitalWrite(6, LOW);
                        digitalWrite(7, LOW);`;
        const pinMode =[{
            num: `4`,
            value: `pinMode(4, OUTPUT);`
        }, {
            num: `5`,
            value: `pinMode(5, OUTPUT);`
        }, {
            num: `6`,
            value: `pinMode(6, OUTPUT);`
        }, {
            num: `7`,
            value: `pinMode(7, OUTPUT);`
        }];

        return {includes, variables, work, workType, setup, pinMode};
    }
    arduino_getKey() {
        const def = [{
            name: 'getkey', 
            value: `int getkey(){
                        for(int i=2;i<10;i++){
                            if(i<6){
                                pinMode(i,INPUT);
                                digitalWrite(i,HIGH);
                            }
                            else{
                                pinMode(i,OUTPUT);
                                digitalWrite(i,LOW);
                            }
                        }
                        int  x;
                        int  y;
                        for(int i=6;i<10;i++){
                            for(int j=2;j<6;j++){
                                digitalWrite(i,LOW);
                                int v=digitalRead(j);
                                if(v==0){
                                    x=i-6;
                                    y=j-2;
                                }
                            }
                            digitalWrite(i,HIGH);
                        }
                        char key[4][4]{
                        {'1','2','3','/'},
                        {'4','5','6','*'},
                        {'7','8','9','-'},
                        {'c','0','=','+'}
                        };
                        return key[y][x];
                    }\n`
            }];
        const setup = `pinMode(getkey(),OUTPUT);`;
        const work = `digitalWrite(getkey(),1)`

        return {def, setup, work};
    }

    control_wait(block, type) {
        const obj = this.getInputsValue(block);
        const delayTime = obj.DURATION;

        const delay = `delay(${delayTime} * 1000);`;
        const str = delay;

        return {[type]: str};
    }

    control_repeat(block, type) {
        const obj = this.getInputsValue(block);
        const queue = [];
        const math_whole_number = obj.TIMES;
        let substack = block.inputs && block.inputs.SUBSTACK && this._blocks[block.inputs.SUBSTACK.block];
        
        queue.push(`\tfor(int i=0;i<${math_whole_number};i++) {`);

        while(substack) {
            queue.push(this.generatorMap[substack.opcode](substack, type));
            substack = this._blocks[substack.next];
        }

        queue.push(`\t}`);
        queue.type = type;
        return queue;
    }

    control_if(block, type) {
        const obj = this.getInputsValue(block);
        const queue = [];
        const condition = obj.CONDITION || false;
        let substack = block.inputs && block.inputs.SUBSTACK && this._blocks[block.inputs.SUBSTACK.block];
        
        queue.push(`if(${condition}){`);

        while(substack) {
            queue.push(this.generatorMap[substack.opcode](substack, type));
            substack = this._blocks[substack.next];
        }

        queue.push(`}`);
        queue.type = type;
        return queue;
    }

    control_if_else(block, type) {
        const obj = this.getInputsValue(block);
        const queue = [];
        const condition = obj.CONDITION || false;
        let substack = block.inputs && block.inputs.SUBSTACK && this._blocks[block.inputs.SUBSTACK.block];
        let substack2 = block.inputs && block.inputs.SUBSTACK2 && this._blocks[block.inputs.SUBSTACK2.block];
        
        queue.push(`if(${condition}){`);

        while(substack) {
            queue.push(this.generatorMap[substack.opcode](substack, type));
            substack = this._blocks[substack.next];
        }

        queue.push(`}else {`)

        while(substack2) {
            queue.push(this.generatorMap[substack2.opcode](substack2, type));
            substack2 = this._blocks[substack2.next];
        }

        queue.push(`\t}`)
        queue.type = type;
        return queue;
    }

    control_repeat_until(block, type) {
        const obj = this.getInputsValue(block);
        const queue = [];
        const condition = obj.CONDITION || false;
        let substack = block.inputs && block.inputs.SUBSTACK && this._blocks[block.inputs.SUBSTACK.block];

        queue.push(`while(!(${condition})){`);

        while(substack) {
            queue.push(this.generatorMap[substack.opcode](substack, type));
            substack = this._blocks[substack.next];
        }

        queue.push(`}`)
        queue.type = type;
        return queue;
    }

    control_wait_until(block, type) {
        const obj = this.getInputsValue(block);
        const queue = [];
        const condition = obj.CONDITION || false;

        queue.push(`while(!(${condition}));`)
        queue.type = type;
        return queue;
    }

    control_forever(block) {
        let repeat_body = ``;
        let substack = block.inputs && block.inputs.SUBSTACK && this._blocks[block.inputs.SUBSTACK.block];

        while(substack) {
            repeat_body += this.generatorMap[substack.opcode](substack).setup;
            substack = this._blocks[substack.next];
        }
        const loop = repeat_body;

        return {loop};
    }

    data_variable(arg) {
        console.log(arg)
        const {VARIABLE} = arg;
        const variable = {name: `${VARIABLE}`, type: 'double', value: ''};
        const work = `${VARIABLE}`;

        return {work, variable};
        
    }

    data_setvariableto(block, type) {
        const {VALUE} = this.getInputsValue(block);
        const {VARIABLE} = this.blocks._getBlockParams(block);
        const work = `${VARIABLE}=${VALUE};`;
        const workType = type;

        return {work, workType};
    }

    data_changevariableby(block, type) {
        const {VALUE} = this.getInputsValue(block);
        const {VARIABLE} = this.blocks._getBlockParams(block);
        const work = `${VARIABLE}+=${VALUE};`;
        const workType = type;

        return {work, workType};
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    add (args) {
        return `(${args.NUM1})+(${args.NUM2})`;
    }

    subtract (args) {
        return `(${args.NUM1})-(${args.NUM2})`;
    }

    multiply (args) {
        return `(${args.NUM1})*(${args.NUM2})`;
    }

    divide (args) {
        return `(${args.NUM1})/(${args.NUM2})`;
    }

    lt (args) {
        return `(${args.OPERAND1})<(${args.OPERAND2})`;
    }

    equals (args) {
        return `(${args.OPERAND1})==(${args.OPERAND2})`;
    }

    gt (args) {
        return `(${args.OPERAND1})>(${args.OPERAND2})`;
    }

    and (args) {
        return `(${args.OPERAND1})&(${args.OPERAND2})`;
    }

    or (args) {
        return `(${args.OPERAND1})|(${args.OPERAND2})`;
    }

    not (args) {
        return `!(${args.OPERAND})`;
    }

    random (args) {
        return `random(${args.FROM},${args.TO})`;
    }

    join (args) {
        return `String("${args.STRING1}")+String("${args.STRING2}")`;
    }

    letterOf (args) {
        return `String("${args.STRING}").charAt(${args.LETTER}-1)`;
    }

    length (args) {
        return `String("${args.STRING}").length()`;
    }

    contains (args) {
        const format = function (string) {
            return Cast.toString(string).toLowerCase();
        };
        return format(args.STRING1).includes(format(args.STRING2));
    }

    mod (args) {
        return `fmod(${args.NUM1},${args.NUM2})`;
    }

    round (args) {
        return `round(${args.NUM})`;
    }

    mathop (args) {
        switch (operator) {
        case 'abs': return `abs(${args.NUM})`;
        case 'floor': return `floor(${args.NUM})`;
        case 'ceiling': return `ceil(${args.NUM})`;
        case 'sqrt': return `sqrt(${args.NUM})`;
        case 'sin': return `sin(angle_rad*${args.NUM})`;
        case 'cos': return `cos(angle_rad*${args.NUM})`;
        case 'tan': return `tan(angle_rad*${args.NUM})`;
        case 'asin': return `asin(angle_rad*${args.NUM})`;
        case 'acos': return `acos(angle_rad*${args.NUM})`;
        case 'atan': return `atan(angle_rad*${args.NUM})`;
        case 'ln': return `log(${args.NUM})`;
        case 'log': return `log10(${args.NUM})`;
        case 'e ^': return `exp(${args.NUM})`;
        case '10 ^': return `pwo(10,${args.NUM})`;
        }
        return 0;
    }
}

module.exports = Generator;

