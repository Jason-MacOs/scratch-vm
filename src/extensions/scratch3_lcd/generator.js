class Generator {
    constructor() {
        
    }

    getPrimitives () {
        return {
            lcd_declear: this.declear,
            lcd_begin: this.begin,
            lcd_clear: this.clear,
            lcd_resetCursor: this.resetCursor,
            lcd_setCursor: this.setCursor,
            lcd_write: this.write,
            lcd_print: this.print,
            lcd_printBase: this.printBase,
            lcd_cursorVisible: this.cursorVisible,
            lcd_cursorBlink: this.cursorBlink,
            lcd_display: this.display,
            lcd_scrollSide: this.scrollSide,
            lcd_autoScroll: this.autoScroll,
        }
    }

    declear(block, type) {
        const obj = this.getInputsValue(block);
        
        const {RS, E, D4, D5, D6, D7} = obj;
        const includes = ['LiquidCrystal.h'];
        const variables = [{
            name: 'lcd',
            type: `LiquidCrystal(${RS},${E},${D4},${D5},${D6},${D7})`,
            value: ''
        }];

        return {includes, variables};
    }

    begin(block, type) {
        const obj = this.getInputsValue(block);
        
        const {COLS, ROWS} = obj;
        const includes = ['LiquidCrystal.h'];
        const setup = `lcd.begin(${COLS},${ROWS});`;

        return {includes, setup};
    }

    clear(block, type) {
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        const work = `lcd.clear();`;

        return {workType, work, includes};   
    }

    resetCursor(block, type) {
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        const work = `lcd.home();`;

        return {includes, workType, work};
    }

    setCursor(block, type) {
        const obj = this.getInputsValue(block);
        
        const {COL, ROW} = obj;
        const includes = ['LiquidCrystal.h'];
        const work = `lcd.setCursor(${COL},${ROW});`;
        const workType = type;

        return {includes, workType, work};
    }
    
    write(block, type) {
        const obj = this.getInputsValue(block);

        const {DATA} = obj;
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        const work = `lcd.write(${DATA});`;

        return {includes, workType, work};
    }

    print(block, type) {
        const obj = this.getInputsValue(block);

        const {DATA} = obj;
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        const work = `lcd.print(${DATA});`;

        return {includes, workType, work};
    }

    printBase(block, type) {
        const obj = this.getInputsValue(block);
        
        const {BASE, DATA} = obj;
        const includes = ['LiquidCrystal.h'];
        const work = `lcd.print(${BASE},${DATA});`;
        const workType = type;

        return {includes, workType, work};
    }

    cursorVisible(block, type) {
        const obj = this.getInputsValue(block);
        
        const {VISIBLE} = obj;
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        let work = ``;
        if(VISIBLE === '1') {
            work = `lcd.cursor();`;
        }else {
            work = `lcd.noCursor();`;
        }

        return {includes, workType, work};
    }

    cursorBlink(block, type) {
        const obj = this.getInputsValue(block);
        
        const {BLINK} = obj;
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        let work = ``;
        if(BLINK === '1') {
            work = `lcd.blink();`;
        }else {
            work = `lcd.noBlink();`;
        }

        return {includes, workType, work}
    }

    display(block, type) {
        const obj = this.getInputsValue(block);
        
        const {DISPLAY} = obj;
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        let work = ``;
        if(DISPLAY === '1') {
            work = `lcd.display();`;
        }else {
            work = `lcd.noDisplay();`;
        }

        return {includes, workType, work}
    }

    scrollSide(block, type) {
        const obj = this.getInputsValue(block);
        
        const {SIDE} = obj;
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        let work = ``;
        if(SIDE === '1') {
            work = `lcd.scrollDisplayRight();`;
        }else {
            work = `lcd.scrollDisplayLeft();`;
        }

        return {includes, workType, work}
    }

    autoScroll(block, type) {
        const obj = this.getInputsValue(block);
        
        const {ENABLED} = obj;
        const includes = ['LiquidCrystal.h'];
        const workType = type;
        let work = ``;
        if(ENABLED === '1') {
            work = `lcd.autoScroll();`;
        }else {
            work = `lcd.noAutoScroll();`;
        }

        return {includes, workType, work}
    }
}

module.exports = Generator;