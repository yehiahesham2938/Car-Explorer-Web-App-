import { getFavorites, removeFavorite } from './storage.js';
import { getCarById } from './api.js';

const loading = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const container = document.getElementById('compare-container');
const headerRow = document.getElementById('header-row');
const tbody = document.getElementById('compare-body');

async function init() {
    const favoriteIds = getFavorites();

    if (favoriteIds.length === 0) {
        showEmpty();
        return;
    }

    // Fetch elfavorite by their ids 
    const cars = [];
    for (const id of favoriteIds) {
        const car = await getCarById(id);
        if (car) cars.push(car);
    }

    if (cars.length === 0) {
        showEmpty();
        return;
    }

    renderComparison(cars);
}

function renderComparison(cars) {
    loading.classList.add('hidden');
    emptyState.classList.add('hidden');
    container.classList.remove('hidden');

    // remove existing headers except the first one
    while (headerRow.children.length > 1) {
        headerRow.removeChild(headerRow.lastChild);
    }

    cars.forEach(car => {
        const th = document.createElement('th');
        th.className = 'p-4 min-w-[250px] border-b border-primary/20 align-bottom';
        th.innerHTML = `
      <div class="relative group">
        <div class="h-40 rounded-xl overflow-hidden mb-3 border border-primary/10">
          <img src="${car.image}" alt="${car.brand}" class="w-full h-full object-cover">
        </div>
        <h3 class="text-xl font-bold">${car.brand} ${car.model}</h3>
        <p class="text-primary font-bold mb-2">${car.price.toLocaleString()} EGP</p>
        <button class="remove-btn text-xs text-red-500 hover:underline" data-id="${car.id}">Remove</button>
        <a href="/src/pages/details.html?id=${car.id}" class="block mt-2 text-sm text-text/60 hover:text-primary">View Details &rarr;</a>
      </div>
    `;
        headerRow.appendChild(th);
    });

    // Render elcomparision table
    const features = [
        { label: 'Type', key: 'type' },
        { label: 'Year', key: 'year' },
        { label: 'Horsepower', key: 'horsepower',format: horsepower => `${horsepower} HP`},
        { label: 'Key Features', key: 'features', format: features => features.join(', ') }
    ];

    tbody.innerHTML = '';
    features.forEach(feature => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-primary/10 hover:bg-surface/30 transition-colors';

    
        const tdLabel = document.createElement('td');
        tdLabel.className = 'p-4 font-semibold text-text/70 bg-surface/50 sticky left-0 backdrop-blur-md';
        tdLabel.textContent = feature.label;
        tr.appendChild(tdLabel);

        // data bta3t elcar 
        cars.forEach(car => {
            const td = document.createElement('td');
            td.className = 'p-4';
            let value = car[feature.key];
            if (feature.format) value = feature.format(value);
            td.textContent = value;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    // Attach event listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            removeFavorite(id);
            init();
        });
    });
}

function showEmpty() {
    loading.classList.add('hidden');
    container.classList.add('hidden');
    emptyState.classList.remove('hidden');
}

init();
