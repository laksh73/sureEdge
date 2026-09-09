const odds1Input = document.getElementById("odds1");
const odds2Input = document.getElementById("odds2");
const stakeInput = document.getElementById("stake");


const calculateBtn = document.getElementById("calculateBtn");

const resetBtn = document.getElementById("resetBtn");

const addBetBtn = document.getElementById("addBetBtn");
let betCount = 2;

const betStakesResults = document.getElementById("betStakesResults");

const totalPayoutOutput = document.getElementById("totalPayout");
const profitLossOutput = document.getElementById("profitLoss");
const roiOutput = document.getElementById("roi");

const errorMessage = document.getElementById("errorMessage");

const arbitrageStatus = document.getElementById("arbitrageStatus");

addBetBtn.addEventListener("click", function() {
    betCount++;

    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    // using backtick, template literals, and ${betCount} to dynamically create the label and input field for the new bet
    inputGroup.innerHTML = `
        <label for="odds${betCount}">Bet ${betCount} Odds</label>
        <input type="number" id="odds${betCount}" placeholder="Enter odds" step="0.01" min="1.01">
    `;

    stakeInput.parentElement.before(inputGroup);
});


calculateBtn.addEventListener("click", function() {

    const oddsInputs = document.querySelectorAll('input[id^="odds"]'); // Select all input fields with ids starting with "odds"

    const odds = Array.from(oddsInputs).map(function(input) { // Convert NodeList to Array and map to get the values
        return Number(input.value);
    });

    const stake = Number(stakeInput.value);

    if (odds.some(function(odd) { // Check if any of the odds are less than or equal to 1 || Check if any of the odds are not finite numbers
        return !Number.isFinite(odd) || odd <= 1;
    }) || !Number.isFinite(stake) || stake <= 0 || odds.length < 2) { // Check if stake is not a number or if there are atleast 2 odds provided
        errorMessage.textContent = "Please enter valid odds and stake.";
        arbitrageStatus.textContent = "";
        arbitrageStatus.className = "";
        return;
    }

    errorMessage.textContent = "";

    const arbitragePercentage = odds.reduce(function(total, odd) {
        return total + (1 / odd);
    }, 0);


    if (arbitragePercentage < 1) {

        arbitrageStatus.textContent = "Arbitrage opportunity found!";
        arbitrageStatus.className = "arbitrage"; //assign a class for different styling with different colors

    } else if (Math.abs(arbitragePercentage - 1) < 0.000001) { // Check for break-even condition with a small tolerance && This avoids the floating-point problem

        arbitrageStatus.textContent = "Break-even";
        arbitrageStatus.className = "break-even"; //assign a class for different styling with different colors

    } else {

        arbitrageStatus.textContent = "No arbitrage opportunity";
        arbitrageStatus.className = "no-arbitrage"; //assign a class for different styling with different colors

    }

    const totalPayout = stake / arbitragePercentage;
    totalPayoutOutput.textContent = totalPayout.toFixed(2); // Display Total Payout in the output element up to 2 decimal places


    const betStakes = odds.map(function(odd) { // Calculate the stake for each bet, based on the total payout and the odds
        return totalPayout / odd;
    });

    betStakesResults.innerHTML = "";

    betStakes.forEach(function(betStake, index) {
        const resultBox = document.createElement("div");
        resultBox.className = "result-box";

        resultBox.innerHTML = `
            <p>Bet ${index + 1} Stake</p>
            <strong>${betStake.toFixed(2)}</strong>
        `;

        betStakesResults.appendChild(resultBox);
    });

    const profitLoss = totalPayout - stake;

    if (profitLoss > 0) {
        profitLossOutput.className = "profit";
    } else if (profitLoss < 0) {
        profitLossOutput.className = "loss";
    } else {
        profitLossOutput.className = "";
    }
    
    profitLossOutput.textContent = profitLoss.toFixed(2); // Display Profit/Loss in the output element up to 2 decimal places

    const roi = (profitLoss / stake) * 100;
    roiOutput.textContent = roi.toFixed(2) + "%"; // Display ROI in the output element up to 2 decimal places

});


resetBtn.addEventListener("click", function() {

    odds1Input.value = "";
    odds2Input.value = "";
    stakeInput.value = "";

    document.querySelectorAll('input[id^="odds"]').forEach(function(input, index) {
        if (index >= 2) {
            input.parentElement.remove();
        }
    });

    betStakesResults.innerHTML = "";
    totalPayoutOutput.textContent = "0.00";
    profitLossOutput.textContent = "0.00";
    roiOutput.textContent = "0.00%";

    errorMessage.textContent = "";

    arbitrageStatus.textContent = "";
    arbitrageStatus.className = ""; // Reset the class name to remove any styling

    profitLossOutput.className = ""; // Reset the class name to remove any styling

    betCount = 2; // Reset the bet count to 2 since we are removing all additional bets

});