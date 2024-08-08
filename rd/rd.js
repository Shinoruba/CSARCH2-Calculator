// To calculate using the Non-Restoring Division Process.
function binaryToDecimal(binaryStr)
{
    return parseInt(binaryStr, 2);
}

function decimalToBinary(decimal, bits)
{
    let binaryStr = (decimal >>> 0).toString(2);
    while(binaryStr.length < bits)
    {
        binaryStr = '0' + binaryStr;
    }
    return binaryStr;
}

function restoringDivision(Q, M)
{
    let dividend = binaryToDecimal(Q);
    let divisor = binaryToDecimal(M);
    let n = Q.length;
    
    let A = 0;
    let Q_val = dividend;
    let M_val = divisor;
    let cycleResults = [];

    for (let i = 0; i < n; i++) {
        A = A << 1;
        A = A | ((Q_val & (1 << (n - 1))) >> (n - 1)); // bring the MSB of Q to A's LSB
        Q_val = Q_val << 1; 
        Q_val = Q_val & ((1 << n) - 1); 
        
        A = A - M_val;

        // If A is negative, restore A and set Q's LSB to 0
        if(A < 0)
        {
            A = A + M_val;
            Q_val = Q_val & ~(1 << 0); 
        } 
        else 
        {
            Q_val = Q_val | (1 << 0); 
        }

        cycleResults.push({
            cycle: i + 1,
            A: decimalToBinary(A, n + 1),
            Q: decimalToBinary(Q_val, n)
        });
    }
    let finalRemainder = decimalToBinary(A, n + 1);

    return {
        quotient: decimalToBinary(Q_val, n),
        remainder: finalRemainder,
        cycles: cycleResults
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("division-form");
    const resultDiv = document.getElementById("result");
    const simulationTable = document.getElementById("simulation-table");
    const finalResultDiv = document.getElementById("final-result");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const Q = document.getElementById("dividend").value;
        const M = document.getElementById("divisor").value;

        const result = restoringDivision(Q, M);

        simulationTable.innerHTML = "";

        result.cycles.forEach(cycle => {
            const row = document.createElement("tr");
            row.innerHTML = `<td class="border border-gray-400 px-4 py-2">${cycle.cycle}</td>
                             <td class="border border-gray-400 px-4 py-2">A: ${cycle.A}, Q: ${cycle.Q}</td>`;
            simulationTable.appendChild(row);
        });

        finalResultDiv.innerHTML = `
            <h3 class="text-lg font-bold mt-4">Final Result:</h3>
            <p>Quotient (Q): ${result.quotient}</p>
            <p>Remainder (A): ${result.remainder}</p>
        `;

        resultDiv.classList.remove("hidden");
    });
});