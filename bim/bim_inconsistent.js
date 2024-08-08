// Function to determine the number of bits required to represent a number in 2's complement
function calculateBits(n) {
    return n === 0 ? 1 : Math.floor(Math.log2(Math.abs(n))) + 2;
}

// Function to convert a number to its 2's complement binary representation
function toBinary(n, bits) {
    let binary = n.toString(2);
    if (n < 0) {
        binary = (binary >>> 0).toString(2).slice(-bits);
    } else {
        binary = binary.padStart(bits, '0');
    }
    return binary;
}

// Function to compute Booth's equivalent
function boothsAlgorithm(multiplier) {
    let extendedMultiplier = multiplier + '0'; // Append 0 at the LSb side
    let boothsEquivalent = [];
    for (let i = 0; i < extendedMultiplier.length - 1; i++) {
        let pair = extendedMultiplier.slice(i, i + 2);
        if (pair === '01') boothsEquivalent.push('+1');
        else if (pair === '10') boothsEquivalent.push('-1');
        else boothsEquivalent.push('0');
    }
    return boothsEquivalent;
}

// Function to compute Extended Booth's equivalent
function extendedBoothsAlgorithm(multiplier) {
    if (multiplier.length % 2 !== 0) {
        multiplier = multiplier[0] + multiplier; // Sign-extend if odd number of bits
    }
    let extendedMultiplier = multiplier + '0'; // Append 0 at the LSb side
    let extendedBoothsEquivalent = [];
    for (let i = 0; i < extendedMultiplier.length - 1; i += 2) {
        let pair = extendedMultiplier.slice(i, i + 3);
        if (pair === '001' || pair === '010') extendedBoothsEquivalent.push('+1');
        else if (pair === '011') extendedBoothsEquivalent.push('+2');
        else if (pair === '100') extendedBoothsEquivalent.push('-2');
        else if (pair === '101' || pair === '110') extendedBoothsEquivalent.push('-1');
        else extendedBoothsEquivalent.push('0');
    }
    return extendedBoothsEquivalent;
}

// Function to convert a product to its binary representation considering 2's complement
function toProductBinary(product, bits) {
    let maxVal = Math.pow(2, bits);
    if (product < 0) {
        product = maxVal + product;
    }
    let binary = product.toString(2);
    return binary.padStart(bits, '0');
}

// Hardcoded inputs
const multiplicand =33;
const multiplier =-14;

// Determine the number of bits required for representation
const multiplicandBits = calculateBits(multiplicand);
const multiplierBits = calculateBits(multiplier);
const bits = Math.max(multiplicandBits, multiplierBits);

// Compute 2's complement binary representations
const multiplicandBinary = toBinary(multiplicand, bits);
const multiplierBinary = toBinary(multiplier, bits);

// Compute Booth's and Extended Booth's equivalents
const boothsEquivalent = boothsAlgorithm(multiplierBinary);
const extendedBoothsEquivalent = extendedBoothsAlgorithm(multiplierBinary);

// Compute product (for demonstration, we'll simply multiply in decimal)
const product = multiplicand * multiplier;
const productBinary = toProductBinary(product, bits * 2);

// Output the question and answers
console.log(`Given the following operands: Multiplicand = ${multiplicand}; Multiplier = ${multiplier}.`);
console.log(`a.) What is the Booth's equivalent of the multiplier?`);
console.log(`ans: ${boothsEquivalent.join(' ')}`);
console.log(`b.) What is the Extended Booth's equivalent of the multiplier?`);
console.log(`ans: ${extendedBoothsEquivalent.join(' ')}`);
console.log(`c.) What is the product (Should be exact number bits):`);
console.log(`ans: ${productBinary}`);