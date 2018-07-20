class ArduinoOperators {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
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
        };
    }

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

module.exports = ArduinoOperators;
