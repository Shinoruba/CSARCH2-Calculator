class MicroprogramGenerator {
    constructor() {
      this.instructions = {
        'MOV': this.handleMov,
        'ADD': this.handleAdd,
        'SUB': this.handleSub,
        'DEC': this.handleDec,
        'IMUL': this.handleImul,
        'MUL': this.handleMul,
        'XOR': this.handleXor,
        'AND': this.handleAnd,
        'OR': this.handleOr,
        'NOT': this.handleNot,
        'SHL': this.handleShl,
        'SHR': this.handleShr,
        'CMP': this.handleCmp,
        // Add more instructions here
      };
    }
  
    parseInstruction(instruction) {
      // Match instruction opcode, destination, and source
      const parts = instruction.match(/(\w+)\s+(\S+)(?:,\s*(\S+))?/);
      if (!parts) throw new Error('Invalid instruction format');
      return { opcode: parts[1], dest: parts[2], src: parts[3] };
    }
  
    generateMicroprogram(instruction) {
      const { opcode, dest, src } = this.parseInstruction(instruction);
      if (this.instructions[opcode]) {
        return this.instructions[opcode].call(this, dest, src);
      } else {
        throw new Error(`Unsupported instruction: ${opcode}`);
      }
    }
  
    handleMov(dest, src) {
      if (/^\d+/.test(src)) { // Immediate addressing
        return [`IRDFout, ${dest}in, END`];
      } else if (/\[/.test(src)) { // Memory addressing
        return [`IRAFout, MARin, READ, WMFC`, `MDRout, ${dest}in, END`];
      } else { // Register addressing
        return [`${src}out, ${dest}in, END`];
      }
    }
  
    handleAdd(dest, src) {
      if (/\[/.test(src)) { // Memory addressing
        return [`${src}out, Yin`, `IRAFout, SelectY, ADD, Zin`, `Zout, MARin, READ, WMFC`, `MDRout, SelectY, ADD, Zin`, `Zout, ${dest}in, END`];
      } else { // Register addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, ADD, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleSub(dest, src) {
      if (/\[/.test(src)) { // Memory addressing
        return [`${src}out, Yin`, `IRAFout, SelectY, SUB, Zin`, `Zout, MARin, READ, WMFC`, `MDRout, Set carry-in, SUB, Zin`, `Zout, ${dest}in, END`];
      } else { // Register addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, SUB, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleDec(dest) {
      // Handle DEC instruction
      return [`${dest}out, Set carry-in, SUB, Zin`, `Zout, ${dest}in, END`];
    }
  
    handleImul(dest, src) {
      if (/\[/.test(src)) { // Memory addressing
        return [`${src}out, MARin, READ, WMFC`, `MDRout, Yin`, `${dest}out, SelectY, MUL, Zin`, `Zout, ${dest}in, END`];
      } else { // Register addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, MUL, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleMul(dest, src) {
      if (/\[/.test(src)) { // Memory addressing
        return [`${src}out, MARin, READ, WMFC`, `MDRout, Yin`, `${dest}out, SelectY, MUL, Zin`, `Zout, ${dest}in, END`];
      } else { // Register addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, MUL, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleXor(dest, src) {
      if (/\[/.test(src)) { // Memory addressing
        return [`${src}out, Yin`, `IRAFout, SelectY, XOR, Zin`, `Zout, MARin, READ, WMFC`, `MDRout, SelectY, XOR, Zin`, `Zout, ${dest}in, END`];
      } else { // Register addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, XOR, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleAnd(dest, src) {
      if (/\[/.test(src)) { // Memory addressing
        return [`${src}out, Yin`, `IRAFout, SelectY, AND, Zin`, `Zout, MARin, READ, WMFC`, `MDRout, SelectY, AND, Zin`, `Zout, ${dest}in, END`];
      } else { // Register addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, AND, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleOr(dest, src) {
      if (/\[/.test(src)) { // Memory addressing
        return [`${src}out, Yin`, `IRAFout, SelectY, OR, Zin`, `Zout, MARin, READ, WMFC`, `MDRout, SelectY, OR, Zin`, `Zout, ${dest}in, END`];
      } else { // Register addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, OR, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleNot(dest) {
      // Handle NOT instruction
      return [`${dest}out, Set carry-in, NOT, Zin`, `Zout, ${dest}in, END`];
    }
  
    handleShl(dest, src) {
      // Handle SHL (Shift Left) instruction
      if (/^\d+$/.test(src)) { // Immediate value
        return [`${dest}out, Set carry-in, SHL ${src}, Zin`, `Zout, ${dest}in, END`];
      } else { // Register or memory addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, SHL, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleShr(dest, src) {
      // Handle SHR (Shift Right) instruction
      if (/^\d+$/.test(src)) { // Immediate value
        return [`${dest}out, Set carry-in, SHR ${src}, Zin`, `Zout, ${dest}in, END`];
      } else { // Register or memory addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, SHR, Zin`, `Zout, ${dest}in, END`];
      }
    }
  
    handleCmp(dest, src) {
      if (/\[/.test(src)) { // Memory addressing
        return [`${src}out, Yin`, `IRAFout, SelectY, SUB, Zin`, `Zout, MARin, READ, WMFC`];
      } else { // Register addressing
        return [`${src}out, Yin`, `${dest}out, SelectY, SUB, Zin`, `Zout, ${dest}in`];
      }
    }
  }
  
  // Example usage
  const generator = new MicroprogramGenerator();
  
  const instructions = [
    'MOV EAX, [ALPHA]',
    'ADD EAX, EBX',
    'SUB EAX, ECX',
    'DEC EAX',
    'IMUL EAX, [GAMMA + R14 + R15*4]',
    'MUL EAX, [GAMMA]',
    'XOR EAX, EBX',
    'AND EAX, ECX',
    'OR EAX, [ALPHA]',
    'NOT EAX',
    'SHL EAX, 1',
    'SHR EAX, 2',
    'CMP EAX, [GAMMA]'
  ];
  
  instructions.forEach(instruction => {
    try {
      const microprogram = generator.generateMicroprogram(instruction);
      console.log(`Microprogram for ${instruction}:`);
      console.log(microprogram.join('\n'));
      console.log('---');
    } catch (error) {
      console.error(error.message);
    }
  });
  