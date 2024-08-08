// To calculate using the Non-Restoring Division Process.
function binToDec(bin)
{
    return parseInt(bin, 2);
}

function decToBin(dec, length)
{
    let bin = (dec >>> 0).toString(2);
    return bin.padStart(length, '0');
}

function nonRestoringDivision(dividend, divisor)
{
    let n = dividend.length;
    let A = '0'.repeat(n);
    let Q = dividend;
    let M = divisor;
    let cycles = [];

    console.log("Non-Restoring Division Process");
    console.log("Dividend (Q): " + dividend);
    console.log("Divisor (M): " + divisor);
    console.log("\nCycle | A" + ' '.repeat(n-1) + "| Q");

    for(let i = 0; i < n; i++)
    {
        cycles.push({ A, Q });

        A = A.substring(1) + Q[0];
        Q = Q.substring(1) + '0';

        // Check if A is negative
        if(A[0] === '1')
        {
            A = decToBin(binToDec(A) + binToDec(M), n + 1);
        } 
        else 
        {
            A = decToBin(binToDec(A) - binToDec(M), n + 1);
        }

        
        Q = Q.slice(0, -1) + (A[0] === '0' ? '1' : '0'); // Set Q[0] as complement of MSB of A

        console.log(`${i + 1}${i + 1 < 10 ? ' ' : ''} | ${A} | ${Q}`);
    }

    // Final restoration if necessary
    if(A[0] === '1')
        A = decToBin(binToDec(A) + binToDec(M), n + 1);
    
    cycles.push({ A, Q });

    console.log("\nFinal Result:");
    console.log("Quotient (Q): " + Q);
    console.log("Remainder (A): " + A);
    console.log("Quotient (Q) in Decimal: " + binToDec(Q));
    console.log("Remainder (A) in Decimal: " + binToDec(A));

    const tableBody = document.getElementById('simulation-table');
    tableBody.innerHTML = '';

    cycles.forEach((cycle, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border border-gray-400 px-4 py-2">${index + 1}</td>
            <td class="border border-gray-400 px-4 py-2">A: ${cycle.A}, Q: ${cycle.Q}</td>
        `;
        tableBody.appendChild(row);
    });

    const finalResultDiv = document.getElementById('final-result');
    finalResultDiv.innerHTML = `
        <h3 class="text-xl font-semibold mt-4">Final Result:</h3>
        <p>Quotient (Q): ${Q}</p>
        <p>Remainder (A): ${A}</p>
    `;

    document.getElementById('result').classList.remove('hidden');
}

document.getElementById('division-form').addEventListener('submit', function(event)
{
    event.preventDefault();
    const dividend = document.getElementById('dividend').value;
    const divisor = document.getElementById('divisor').value;
    nonRestoringDivision(dividend, divisor);
});