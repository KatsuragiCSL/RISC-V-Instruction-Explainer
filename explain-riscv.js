var OperandType;
(function (OperandType) {
    OperandType["Register"] = "register";
    OperandType["Immediate"] = "immediate";
    OperandType["Memory"] = "memory";
    OperandType["Label"] = "label";
})(OperandType || (OperandType = {}));
var REGISTERS = ["zero", "ra", "sp", "gp", "tp", "t0", "t1", "t2", "s0", "s1", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "t3", "t4", "t5", "t6"];
var INSTRUCTIONS = {
    // R
    add: {
        type: 'R',
        explain: function (ops) { return "Add ".concat(ops[2].value, " to ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    sub: {
        type: 'R',
        explain: function (ops) { return "Subtract ".concat(ops[2].value, " from ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    xor: {
        type: 'R',
        explain: function (ops) { return "XOR ".concat(ops[2].value, " to ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    or: {
        type: 'R',
        explain: function (ops) { return "OR ".concat(ops[2].value, " to ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    and: {
        type: 'R',
        explain: function (ops) { return "AND ".concat(ops[2].value, " to ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    sll: {
        type: 'R',
        explain: function (ops) { return "".concat(ops[1].value, " << ").concat(ops[2].value, " and store result in ").concat(ops[0].value); }
    },
    srl: {
        type: 'R',
        explain: function (ops) { return "".concat(ops[1].value, " >> ").concat(ops[2].value, " and store result in ").concat(ops[0].value); }
    },
    // I
    addi: {
        type: 'I',
        explain: function (ops) { return "Add ".concat(ops[2].value, " to ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    xori: {
        type: 'I',
        explain: function (ops) { return "XOR ".concat(ops[2].value, " to ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    ori: {
        type: 'I',
        explain: function (ops) { return "OR ".concat(ops[2].value, " to ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    andi: {
        type: 'I',
        explain: function (ops) { return "AND ".concat(ops[2].value, " to ").concat(ops[1].value, " and store result in ").concat(ops[0].value); }
    },
    // let's call them all S type
    lw: {
        type: 'S',
        explain: function (ops) { return "Load word from memory[".concat(ops[1].baseRegister, " + ").concat(ops[1].offset, "] \u2192 ").concat(ops[0].value); }
    },
    ld: {
        type: 'S',
        explain: function (ops) { return "Load dword from memory[".concat(ops[1].baseRegister, " + ").concat(ops[1].offset, "] \u2192 ").concat(ops[0].value); }
    },
    sw: {
        type: 'S',
        explain: function (ops) { return "Store word ".concat(ops[0].value, " \u2192 memory[").concat(ops[1].baseRegister, " + ").concat(ops[1].offset, "]"); }
    },
    sd: {
        type: 'S',
        explain: function (ops) { return "Store dword ".concat(ops[0].value, " \u2192 memory[").concat(ops[1].baseRegister, " + ").concat(ops[1].offset, "]"); }
    },
    // B
    beq: {
        type: 'B',
        explain: function (ops) { return "Branch to ".concat(ops[2].value, " if ").concat(ops[0].value, " == ").concat(ops[1].value); }
    },
    bne: {
        type: 'B',
        explain: function (ops) { return "Branch to ".concat(ops[2].value, " if ").concat(ops[0].value, " != ").concat(ops[1].value); }
    },
    blt: {
        type: 'B',
        explain: function (ops) { return "Branch to ".concat(ops[2].value, " if ").concat(ops[0].value, " < ").concat(ops[1].value); }
    },
    bge: {
        type: 'B',
        explain: function (ops) { return "Branch to ".concat(ops[2].value, " if ").concat(ops[0].value, " >= ").concat(ops[1].value); }
    },
    // special kid...
    jalr: {
        type: 'B',
        explain: function (ops) { return ops[2].type == 'label' ? "Jump to label ".concat(ops[1].value, " + ").concat(ops[2].value, " and store return address in ").concat(ops[0].value) : "Jump to offset ".concat(ops[1].value, " + ").concat(ops[2].value, " and store return address in ").concat(ops[0].value); }
    },
    // J
    jal: {
        type: 'J',
        explain: function (ops) { return ops[1].type == 'label' ? "Jump to label ".concat(ops[1].value, " and store return address in ").concat(ops[0].value) : "Jump to offset ".concat(ops[1].value, " and store return address in ").concat(ops[0].value); }
    },
    // U
    lui: {
        type: 'U',
        explain: function (ops) { return "Save ".concat(ops[1].value, " << 12 to ").concat(ops[0].value); }
    },
    auipc: {
        type: 'U',
        explain: function (ops) { return "Save PC + (".concat(ops[1].value, " << 12) to ").concat(ops[0].value); }
    },
    // E
    ecall: {
        type: 'E',
        explain: function (ops) { return "Environment call"; }
    },
    ebreak: {
        type: 'E',
        explain: function (ops) { return "Environment break"; }
    }
};
// check if the type of the operands match the type of the instr
// throw error message if not
function validFMT(instr, operands) {
    if (!INSTRUCTIONS[instr]) {
        throw new Error("Unknown instruction ".concat(instr));
    }
    var instr_type = INSTRUCTIONS[instr].type;
    console.log(instr_type);
    switch (instr_type) {
        case 'R':
            if (operands.length != 3) {
                throw new Error("".concat(instr.toUpperCase(), ": Incorrect number of operands}"));
            }
            for (var i = 0; i < 3; i++) {
                if (operands[i].type != OperandType.Register) {
                    throw new Error("".concat(instr.toUpperCase(), ": Expect register at operand ").concat(i, ", got ").concat(operands[i].type));
                }
            }
            return;
        case 'I':
            if (operands.length != 3) {
                throw new Error("".concat(instr.toUpperCase(), ": Incorrect number of operands}"));
            }
            for (var i = 0; i < 2; i++) {
                if (operands[i].type != OperandType.Register) {
                    throw new Error("".concat(instr.toUpperCase(), ": Expect register at operand ").concat(i, ", got ").concat(operands[i].type));
                }
            }
            if (operands[2].type != OperandType.Immediate) {
                throw new Error("".concat(instr.toUpperCase(), ": Expect immediate at operand 2, got ").concat(operands[2].type));
            }
            return;
        case 'B':
            if (operands.length != 3) {
                throw new Error("".concat(instr.toUpperCase(), ": Incorrect number of operands}"));
            }
            for (var i = 0; i < 2; i++) {
                if (operands[i].type != OperandType.Register) {
                    throw new Error("".concat(instr.toUpperCase(), ": Expect register at operand ").concat(i, ", got ").concat(operands[i].type));
                }
            }
            if (operands[2].type != OperandType.Immediate && operands[2].type != OperandType.Label) {
                throw new Error("".concat(instr.toUpperCase(), ": Expect immediate or label at operand 2, got ").concat(operands[2].type));
            }
            return;
        case 'J':
            if (operands.length != 2) {
                throw new Error("".concat(instr.toUpperCase(), ": Incorrect number of operands}"));
            }
            if (operands[0].type != OperandType.Register) {
                throw new Error("".concat(instr.toUpperCase(), ": Expect register at operand 0, got ").concat(operands[0].type));
            }
            if (operands[1].type != OperandType.Immediate && operands[1].type != OperandType.Label) {
                throw new Error("".concat(instr.toUpperCase(), ": Expect immediate or label at operand 1, got ").concat(operands[1].type));
            }
            return;
        case 'U':
            if (operands.length != 2) {
                throw new Error("".concat(instr.toUpperCase(), ": Incorrect number of operands}"));
            }
            if (operands[0].type != OperandType.Register) {
                throw new Error("".concat(instr.toUpperCase(), ": Expect register at operand 0, got ").concat(operands[0].type));
            }
            if (operands[1].type != OperandType.Immediate) {
                throw new Error("".concat(instr.toUpperCase(), ": Expect immediate at operand 1, got ").concat(operands[1].type));
            }
        case 'S':
            if (operands.length != 2) {
                throw new Error("".concat(instr.toUpperCase(), ": Incorrect number of operands}"));
            }
            if (operands[0].type != OperandType.Register) {
                throw new Error("".concat(instr.toUpperCase(), ": Expect register at operand 0, got ").concat(operands[0].type));
            }
            if (operands[1].type != OperandType.Memory) {
                throw new Error("".concat(instr.toUpperCase(), ": Expect memory at operand 1, got ").concat(operands[1].type));
            }
            return;
        case 'E':
            if (operands.length > 0) {
                throw new Error("".concat(instr.toUpperCase(), ": Incorrect number of operands}"));
            }
            return;
    }
}
function parseMemoryOperand(operand) {
    var match = operand.match(/([\d+]+)\((\w+)\)/);
    if (!match)
        throw new Error("Invalid memory operand: ".concat(operand));
    return {
        type: OperandType.Memory,
        value: operand,
        offset: match[1],
        baseRegister: match[2]
    };
}
function parseOperand(op) {
    op = op.trim();
    // offset 
    if (op.includes('('))
        return parseMemoryOperand(op);
    // Register
    if (REGISTERS.includes(op)) {
        return { type: OperandType.Register, value: op };
    }
    // assume no one is using a label that looks like a number
    // we cannot assume the type by the mnemonic, since branching instructions can take both
    if (!isNaN(parseInt(op))) {
        return { type: OperandType.Immediate, value: op };
    }
    // default as label
    return { type: OperandType.Label, value: op };
}
function explainInstruction(line) {
    var clean_line = line.trim().replace(/,/g, ' ');
    var _a = clean_line.split(/\s+/).filter(Boolean), raw_instr = _a[0], raw_operands = _a.slice(1);
    if (!raw_instr)
        return 'Empty line';
    var instr = raw_instr.toLowerCase();
    var operands = raw_operands.map(parseOperand);
    try {
        validFMT(instr, operands);
    }
    catch (error) {
        return "Error in ".concat(line, ": ").concat(error.message);
    }
    return INSTRUCTIONS[instr].explain(operands);
}
