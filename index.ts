type Operand = {
    type: OperandType;
    value: string;
    baseRegister?: string;
    offset?: string;
};

enum OperandType {
    Register = "register",
    Immediate = "immediate",
    Memory = "memory",
    Label = "label",
  }

type Instruction = {
    type: 'R' | 'I' | 'S' | 'B' | 'J' | 'U' | 'E';
    explain: (ops: Operand[]) => string;
};

const REGISTERS = ["zero", "ra", "sp", "gp", "tp", "t0", "t1", "t2", "s0", "s1", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "t3", "t4", "t5", "t6"];

const INSTRUCTIONS: {[key: string]: Instruction} = {
    // R
    add: {
        type: 'R',
        explain: (ops) => `Add ${ops[2].value} to ${ops[1].value} and store result in ${ops[0].value}`
    },
    sub: {
        type: 'R',
        explain: (ops) => `Subtract ${ops[2].value} from ${ops[1].value} and store result in ${ops[0].value}`
    },
    xor: {
        type: 'R',
        explain: (ops) => `XOR ${ops[2].value} to ${ops[1].value} and store result in ${ops[0].value}`
    },
    or: {
        type: 'R',
        explain: (ops) => `OR ${ops[2].value} to ${ops[1].value} and store result in ${ops[0].value}`
    },
    and: {
        type: 'R',
        explain: (ops) => `AND ${ops[2].value} to ${ops[1].value} and store result in ${ops[0].value}`
    },
    sll: {
        type: 'R',
        explain: (ops) => `${ops[1].value} << ${ops[2].value} and store result in ${ops[0].value}`
    },
    srl: {
        type: 'R',
        explain: (ops) => `${ops[1].value} >> ${ops[2].value} and store result in ${ops[0].value}`
    },
    // I
    addi: {
        type: 'I',
        explain: (ops) => `Add ${ops[2].value} to ${ops[1].value} and store result in ${ops[0].value}`
    },
    xori: {
        type: 'I',
        explain: (ops) => `XOR ${ops[2].value} to ${ops[1].value} and store result in ${ops[0].value}`
    },
    ori: {
        type: 'I',
        explain: (ops) => `OR ${ops[2].value} to ${ops[1].value} and store result in ${ops[0].value}`
    },
    andi: {
        type: 'I',
        explain: (ops) => `AND ${ops[2].value} to ${ops[1].value} and store result in ${ops[0].value}`
    },
    // let's call them all S type
    lw: {
        type: 'S',
        explain: (ops) => `Load word from memory[${ops[1].baseRegister} + ${ops[1].offset}] → ${ops[0].value}`
    },
    ld: {
        type: 'S',
        explain: (ops) => `Load dword from memory[${ops[1].baseRegister} + ${ops[1].offset}] → ${ops[0].value}`
    },
    sw: {
        type: 'S',
        explain: (ops) => `Store word ${ops[0].value} → memory[${ops[1].baseRegister} + ${ops[1].offset}]`
    },
    sd: {
        type: 'S',
        explain: (ops) => `Store dword ${ops[0].value} → memory[${ops[1].baseRegister} + ${ops[1].offset}]`
    },
    // B
    beq: {
        type: 'B',
        explain: (ops) => `Branch to ${ops[2].value} if ${ops[0].value} == ${ops[1].value}`
    },
    bne: {
        type: 'B',
        explain: (ops) => `Branch to ${ops[2].value} if ${ops[0].value} != ${ops[1].value}`
    },
    blt: {
        type: 'B',
        explain: (ops) => `Branch to ${ops[2].value} if ${ops[0].value} < ${ops[1].value}`
    },
    bge: {
        type: 'B',
        explain: (ops) => `Branch to ${ops[2].value} if ${ops[0].value} >= ${ops[1].value}`
    },
    // special kid...
    jalr: {
        type: 'B',
        explain: (ops) => ops[2].type == 'label' ? `Jump to label ${ops[1].value} + ${ops[2].value} and store return address in ${ops[0].value}`: `Jump to offset ${ops[1].value} + ${ops[2].value} and store return address in ${ops[0].value}`
    },
    // J
    jal: {
        type: 'J',
        explain: (ops) => ops[1].type == 'label' ? `Jump to label ${ops[1].value} and store return address in ${ops[0].value}`: `Jump to offset ${ops[1].value} and store return address in ${ops[0].value}`
    },
    // U
    lui: {
        type: 'U',
        explain: (ops) => `Save ${ops[1].value} << 12 to ${ops[0].value}`
    },
    auipc: {
        type: 'U',
        explain: (ops) => `Save PC + (${ops[1].value} << 12) to ${ops[0].value}`
    },
    // E
    ecall: {
        type: 'E',
        explain: (ops) => `Environment call`
    },
    ebreak: {
        type: 'E',
        explain: (ops) => `Environment break`
    }
    
};

// check if the type of the operands match the type of the instr
// throw error message if not
function validFMT(instr: string, operands: Operand[]): void {
    if (!INSTRUCTIONS[instr]) {
        throw new Error(`Unknown instruction ${instr}`);
    }
    const instr_type = INSTRUCTIONS[instr].type;
    console.log(instr_type);
    switch (instr_type) {
        case 'R':
            if (operands.length != 3) {
                throw new Error(`${instr.toUpperCase()}: Incorrect number of operands}`);
            }
            for (let i = 0; i < 3; i++) {
                if (operands[i].type != OperandType.Register) {
                    throw new Error(`${instr.toUpperCase()}: Expect register at operand ${i}, got ${operands[i].type}`);
                }
            }
            return;
        case 'I':
            if (operands.length != 3) {
                throw new Error(`${instr.toUpperCase()}: Incorrect number of operands}`);
            }
            for (let i = 0; i < 2; i++) {
                if (operands[i].type != OperandType.Register) {
                    throw new Error(`${instr.toUpperCase()}: Expect register at operand ${i}, got ${operands[i].type}`);
                }
            }
            if (operands[2].type != OperandType.Immediate) {
                throw new Error(`${instr.toUpperCase()}: Expect immediate at operand 2, got ${operands[2].type}`);
            }
            return;
        case 'B':
            if (operands.length != 3) {
                throw new Error(`${instr.toUpperCase()}: Incorrect number of operands}`);
            }
            for (let i = 0; i < 2; i++) {
                if (operands[i].type != OperandType.Register) {
                    throw new Error(`${instr.toUpperCase()}: Expect register at operand ${i}, got ${operands[i].type}`);
                }
            }
            if (operands[2].type != OperandType.Immediate && operands[2].type != OperandType.Label) {
                throw new Error(`${instr.toUpperCase()}: Expect immediate or label at operand 2, got ${operands[2].type}`);
            }
            return;
        case 'J':
            if (operands.length != 2) {
                throw new Error(`${instr.toUpperCase()}: Incorrect number of operands}`);
            }
            if (operands[0].type != OperandType.Register) {
                throw new Error(`${instr.toUpperCase()}: Expect register at operand 0, got ${operands[0].type}`);
            }
            if (operands[1].type != OperandType.Immediate && operands[1].type != OperandType.Label) {
                throw new Error(`${instr.toUpperCase()}: Expect immediate or label at operand 1, got ${operands[1].type}`);
            }
            return;
        case 'U':
            if (operands.length != 2) {
                throw new Error(`${instr.toUpperCase()}: Incorrect number of operands}`);
            }
            if (operands[0].type != OperandType.Register) {
                throw new Error(`${instr.toUpperCase()}: Expect register at operand 0, got ${operands[0].type}`);
            }
            if (operands[1].type != OperandType.Immediate) {
                throw new Error(`${instr.toUpperCase()}: Expect immediate at operand 1, got ${operands[1].type}`);
            }
        case 'S':
            if (operands.length != 2) {
                throw new Error(`${instr.toUpperCase()}: Incorrect number of operands}`);
            }
            if (operands[0].type != OperandType.Register) {
                throw new Error(`${instr.toUpperCase()}: Expect register at operand 0, got ${operands[0].type}`);
            }
            if (operands[1].type != OperandType.Memory) {
                throw new Error(`${instr.toUpperCase()}: Expect memory at operand 1, got ${operands[1].type}`);
            }
            return;
        case 'E':
            if (operands.length > 0) {
                throw new Error(`${instr.toUpperCase()}: Incorrect number of operands}`);
            }
            return;

    }
}


function parseMemoryOperand(operand: string): Operand {
    const match = operand.match(/([\d+]+)\((\w+)\)/);
    if (!match) throw new Error(`Invalid memory operand: ${operand}`);
    return {
        type: OperandType.Memory,
        value: operand,
        offset: match[1],
        baseRegister: match[2]
    };
}

function parseOperand(op: string): Operand {
    op = op.trim();
    
    // offset 
    if (op.includes('(')) return parseMemoryOperand(op);
    
    // Register
    if (REGISTERS.includes(op)) {
        return { type: OperandType.Register, value: op };
    }

    // assume no one is using a label that looks like a number
    // we cannot assume the type by the mnemonic, since branching instructions can take both
    if (!isNaN(parseInt(op))) {
        return { type: OperandType.Immediate, value: op};
    }
    
    // default as label
    return { type: OperandType.Label, value: op };
}

export function explainInstruction(line: string): string {
    const clean_line = line.trim().replace(/,/g, ' ');
    const [raw_instr, ...raw_operands] = clean_line.split(/\s+/).filter(Boolean);
    
    if (!raw_instr) return 'Empty line';
    const instr = raw_instr.toLowerCase();
    const operands = raw_operands.map(parseOperand);

    try {
        validFMT(instr, operands);
    } catch (error) {
        return `Error in ${line}: ${(error as Error).message}`;
    }

    return INSTRUCTIONS[instr].explain(operands);
}

