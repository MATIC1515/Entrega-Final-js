const form = document.getElementById('costForm');
const resultDiv = document.getElementById('result');
const historyKey = 'tripHistory';

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
        const trip = getTripData();
        const totalCost = calculateTotalCost(trip);
        trip.totalCost = totalCost;

        displayResult(trip);

        saveToHistory(trip);
        
        updateHistoryView();

        await confirmItinerary(trip);
        
        } catch (error) {
            console.error("Error detectado:", error);
            alert("Ocurrió un error al procesar los datos. Intenta de nuevo.");
        }
});
   
function getTripData() {
    const destination = document.getElementById('destination').value;
    const days = parseInt(document.getElementById('days').value);
    const dailyCost = parseFloat(document.getElementById('dailyCost').value);
    const foodCost = parseFloat(document.getElementById('foodCost').value);
    const flightCost = parseFloat(document.getElementById('flightCost').value);
    const activityCost = parseFloat(document.getElementById('activityCost').value);

    if (!destination || isNaN(days) || days <= 0 || isNaN(dailyCost) || dailyCost < 0 ||
        isNaN(foodCost) || foodCost < 0 || isNaN(flightCost) || flightCost < 0 ||
        isNaN(activityCost) || activityCost < 0) {
        throw new Error('Valores inválidos en el formulario.');
    }

    return { destination, days, dailyCost, foodCost, flightCost, activityCost };
}

function calculateTotalCost(trip) {
    const accommodationTotal = trip.dailyCost * trip.days;
    const foodTotal = trip.foodCost * trip.days;
    const activityTotal = trip.activityCost * trip.days;
    return accommodationTotal + foodTotal + trip.flightCost + activityTotal;
}

function displayResult(trip) {
    resultDiv.innerHTML = `
        <p>El costo total para viajar a <strong>${trip.destination}</strong> por 
        <strong>${trip.days}</strong> días es: <strong>$${trip.totalCost.toFixed(2)}</strong></p>`;
}

function saveToHistory(trip) {
    const history = getHistory();
    history.push(trip);
    localStorage.setItem(historyKey, JSON.stringify(history));
}

function getHistory() {
    const history = localStorage.getItem(historyKey);
    return history ? JSON.parse(history) : [];
}

function updateHistoryView() {
    const history = getHistory();
    let historyDiv = document.getElementById('history');
    
    if (historyDiv) {
        historyDiv.remove();
    }

    historyDiv = document.createElement('div');
    historyDiv.id = 'history';
    historyDiv.innerHTML = '<h2>Historial de Cálculos</h2>';

    history.forEach((trip, index) => {
        const tripDiv = document.createElement('div');
        tripDiv.innerHTML = `
            <p>${index + 1}. Destino: ${trip.destination}, Días: ${trip.days}, Total: $${trip.totalCost.toFixed(2)}</p>
            <button onclick="editTrip(${index})">Editar</button>
            <button onclick="deleteTrip(${index})">Eliminar</button>`;
        historyDiv.appendChild(tripDiv);
    });

    resultDiv.appendChild(historyDiv);
}


function editTrip(index) {
    const history = getHistory();
    const trip = history[index];

    document.getElementById('destination').value = trip.destination;
    document.getElementById('days').value = trip.days;
    document.getElementById('dailyCost').value = trip.dailyCost;
    document.getElementById('foodCost').value = trip.foodCost;
    document.getElementById('flightCost').value = trip.flightCost;
    document.getElementById('activityCost').value = trip.activityCost;
}

function deleteTrip(index) {
    const history = getHistory();
    history.splice(index, 1);
    localStorage.setItem(historyKey, JSON.stringify(history));
    updateHistoryView();
}

async function confirmItinerary(trip) {
    const { value: name } = await Swal.fire({
        title: 'Confirma tu itinerario',
        input: 'text',
        inputLabel: 'Tu nombre',
        inputPlaceholder: 'Ingresa tu nombre para el itinerario'
    });

    if (name) {
        Swal.fire(`Gracias, ${name}! Tu itinerario para ${trip.destination} está confirmado.`);
    } else {
        Swal.fire('Itinerario no confirmado.');
    }
}

(function loadData() {
    updateHistoryView();
})();