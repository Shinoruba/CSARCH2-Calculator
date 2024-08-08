document.getElementById('calculate').addEventListener('click', () => {
    const multiplicand = document.getElementById('multiplicand').value;
    const multiplier = document.getElementById('multiplier').value;
    
    if(multiplicand && multiplier) 
    {
        sequentialCircuitBinaryMultiplier(multiplicand, multiplier);
    } 
    else 
    {
        alert('Please enter both multiplicand and multiplier.');
    }
});

function sequentialCircuitBinaryMultiplier(multiplicand, multiplier) 
{
    let M = multiplicand;
    let Q = multiplier;
    let A = "0".repeat(M.length);
    let Q_1 = "0";
    let cycles = Q.length;
    let resultDiv = document.getElementById('result');

    let tableHTML = "<h2 class='text-xl font-bold mb-4'>Process:</h2>";
    tableHTML += "<table class='w-full border border-gray-300'><thead><tr>";
    tableHTML += "<th>Cycle</th><th>A</th><th>Q</th><th>Q(-1)</th></tr></thead><tbody>";

    for(let i = 0; i < cycles; i++) 
    {
        let Q0 = Q[Q.length - 1];
        
        if(Q0 + Q_1 === "01")
        {
            A = addBinary(A, M);
        } 
        else if(Q0 + Q_1 === "10") 
        {
            A = subtractBinary(A, M);
        }

        let shiftedOut = A[A.length - 1];
        A = A[0] + A.slice(0, -1);
        Q_1 = Q[Q.length - 1];
        Q = shiftedOut + Q.slice(0, -1);

        tableHTML += `<tr><td>${i + 1}</td><td>${A}</td><td>${Q}</td><td>${Q_1}</td></tr>`;
    }

    let product = A + Q;
    let isNegative = product[0] === "1";
    let absProduct = isNegative ? twosComplement(product) : product;

    tableHTML += "</tbody></table>";
    tableHTML += "<h2 class='text-xl font-bold mt-4'>Final Result:</h2>";
    tableHTML += `<p>(Q): ${Q}</p>`;
    tableHTML += `<p>(A): ${A}</p>`;
    tableHTML += `<p>Product in binary: ${product}</p>`;
    tableHTML += `<p>Product in Integer: ${isNegative ? "-" : ""}${parseInt(absProduct, 2)}</p>`;

    resultDiv.innerHTML = tableHTML;
}

function addBinary(a, b) 
{
    let result = "";
    let carry = 0;
    for(let i = a.length - 1; i >= 0; i--) 
    {
        let sum = parseInt(a[i]) + parseInt(b[i]) + carry;
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
    }
    return result;
}

function subtractBinary(a, b) 
{
    return addBinary(a, twosComplement(b));
}

function twosComplement(binary) 
{
    let complement = "";
    let foundOne = false;
    
    for(let i = binary.length - 1; i >= 0; i--) 
    {
        if(!foundOne) 
        {
            complement = binary[i] + complement;
            if (binary[i] === "1") foundOne = true;
        } 
        else 
        {
            complement = (binary[i] === "0" ? "1" : "0") + complement;
        }
    }
    
    return complement;
}