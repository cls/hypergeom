function binomialCoefficient(n, k) {
    if (k < 0 || k > n) {
        return 0;
    }
    if (k == 0 || k == n) {
        return 1;
    }
    if (k > n - k) {
        k = n - k;
    }
    let c = 1;
    for (let i = 0; i < k; i++) {
        c = c * (n - i) / (i + 1);
    }
    return c;
}

function probabilityMassFunction(populationSize, successesInPopulation, sampleSize) {
    failuresInPopulation = populationSize - successesInPopulation;
    sampledPopulation = binomialCoefficient(populationSize, sampleSize);
    return function(successesInSample) {
        failuresInSample = sampleSize - successesInSample;
        sampledSuccesses = binomialCoefficient(successesInPopulation, successesInSample);
        sampledFailures = binomialCoefficient(failuresInPopulation, failuresInSample);
        return (sampledSuccesses * sampledFailures) / sampledPopulation;
    }
}

function scaleByAttempts(probability, attempts) {
    let cumulative = 0;
    for (let i = 0; i < attempts; i++) {
        cumulative = (cumulative + probability) - (cumulative * probability);
    }
    return cumulative;
}

function formatPercentage(probability) {
    return (probability * 100).toFixed(2) + '%';
}

function insertLabelledRow(table, labels, values) {
    let row = table.insertRow();
    for (let i = 0; i < labels.length; i++) {
        let labelCell = row.insertCell();
        let valueCell = row.insertCell();
        labelCell.classList.add('label');
        labelCell.appendChild(document.createTextNode(labels[i]));
        valueCell.appendChild(document.createTextNode(formatPercentage(values[i])));
    }
}

function onClickSubmit() {
    let populationSize = parseInt(document.getElementById('populationSize').value);
    let successesInPopulation = parseInt(document.getElementById('successesInPopulation').value);
    let sampleSize = parseInt(document.getElementById('sampleSize').value);
    let sampleAttempts = parseInt(document.getElementById('sampleAttempts').value);
    let probabilityMass = probabilityMassFunction(populationSize, successesInPopulation, sampleSize);
    let probabilityDistribution = [];
    for (let i = 0; i <= sampleSize; i++) {
        let probability = probabilityMass(i);
        probabilityDistribution[i] = probability;
    }
    let cumulative = 0;
    let cumulativeDistribution = [];
    for (let i = 0; i <= sampleSize; i++) {
        cumulative += probabilityDistribution[i];
        cumulativeDistribution[i] = cumulative;
    }
    let inverseCumulative = 0;
    let inverseCumulativeDistribution = [];
    for (let i = sampleSize; i >= 0; i--) {
        inverseCumulative += probabilityDistribution[i];
        inverseCumulativeDistribution[i] = inverseCumulative;
    }
    let newResult = document.createElement('table');
    for (let i = 0; i <= sampleSize; i++) {
        let labels = [`\u2264 ${i}`, `= ${i}`, `\u2265 ${i}`];
        let values = [
            scaleByAttempts(cumulativeDistribution[i], sampleAttempts),
            scaleByAttempts(probabilityDistribution[i], sampleAttempts),
            scaleByAttempts(inverseCumulativeDistribution[i], sampleAttempts)
        ];
        insertLabelledRow(newResult, labels, values)
    }
    let oldResult = document.getElementById('result');
    oldResult.parentNode.replaceChild(newResult, oldResult);
    newResult.id = 'result';
}

function onLoadWindow() {
    document.getElementById('submit').addEventListener('click', onClickSubmit);
}

window.onload = onLoadWindow;
