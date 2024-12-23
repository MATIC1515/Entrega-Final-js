document.getElementById('costForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const destination = document.getElementById('destination').value;
    const days = parseInt(document.getElementById('days').value);
    const dailyCost = parseFloat(document.getElementById('dailyCost').value);
    const foodCost = parseFloat(document.getElementById('foodCost').value);
    const flightCost = parseFloat(document.getElementById('flightCost').value);
    const activityCost = parseFloat(document.getElementById('activityCost').value);
    
    if (!destination || isNaN(days) || days <= 0 || isNaN(dailyCost) || dailyCost < 0 || 
        isNaN(foodCost) || foodCost < 0 || isNaN(flightCost) || flightCost < 0 || 
        isNaN(activityCost) || activityCost < 0) {
        alert('Por favor, introduce valores válidos.');
        return;
    }

    const trip = {
        destination,
        days,
        dailyCost,
        foodCost,
        flightCost,
        activityCost,
        totalCost: 0,
    };

    trip.totalCost = calculateTotalCost(trip);
    
    displayResult(trip);
});

function calculateTotalCost(trip) {
    const accommodationTotal = trip.dailyCost * trip.days;
    const foodTotal = trip.foodCost * trip.days;
    const activityTotal = trip.activityCost * trip.days;
    const totalCost = accommodationTotal + foodTotal + trip.flightCost + activityTotal;
    return totalCost;
}

function displayResult(trip) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `El costo total para viajar a ${trip.destination} por ${trip.days} días es: $${trip.totalCost.toFixed(2)}`;
}


loadData();