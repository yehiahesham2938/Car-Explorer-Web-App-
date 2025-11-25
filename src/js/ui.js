import { isFavorite, toggleFavorite } from './storage.js';

export function createCarCard(car) {
    const div = document.createElement('div');
    div.className = 'car-card group relative flex flex-col h-full';

    const isFav = isFavorite(car.id);
    const heartClass = isFav ? 'text-red-500 fill-current' : 'text-white stroke-current fill-none';

    div.innerHTML = `
    <div class="relative h-48 overflow-hidden">
      <img src="${car.image}" alt="${car.brand} ${car.model}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <button class="fav-btn absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors" data-id="${car.id}">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ${heartClass} transition-colors" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <div class="absolute bottom-3 left-3">
        <span class="px-2 py-1 text-xs font-bold uppercase tracking-wider text-white bg-primary/80 rounded-md backdrop-blur-sm">${car.type}</span>
      </div>
    </div>
    <div class="p-5 flex-1 flex flex-col">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-lg font-bold leading-tight">${car.brand} ${car.model}</h3>
          <p class="text-sm text-text/60">${car.year}</p>
        </div>
        <p class="text-lg font-bold text-primary">${car.price.toLocaleString()} EGP</p>
      </div>
      
      <div class="grid grid-cols-2 gap-2 my-4 text-sm text-text/70">
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          ${car.horsepower} HP
        </div>
      </div>

      <div class="mt-auto pt-4 border-t border-primary/10">
        <a href="/src/pages/details.html?id=${car.id}" class="block w-full text-center btn-primary py-2 text-sm">View Details</a>
      </div>
    </div>
  `;

    const favBtn = div.querySelector('.fav-btn');
    favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(car.id);
        const newIsFav = isFavorite(car.id);
        const svg = favBtn.querySelector('svg');
        if (newIsFav) {
            svg.classList.remove('text-white', 'stroke-current', 'fill-none');
            svg.classList.add('text-red-500', 'fill-current');
        } else {
            svg.classList.remove('text-red-500', 'fill-current');
            svg.classList.add('text-white', 'stroke-current', 'fill-none');
        }
    });

    return div;
}

export function renderCarDetails(car, els) {
    els.image.src = car.image;
    els.image.alt = `${car.brand} ${car.model}`;
    els.type.textContent = car.type;
    els.title.textContent = `${car.brand} ${car.model}`;
    els.price.textContent = `${car.price.toLocaleString()} EGP`;
    els.year.textContent = car.year;
    els.hp.textContent = `${car.horsepower} HP`;
    els.idDisplay.textContent = `ID: ${car.id}`;

    els.features.innerHTML = car.features.map(feature => `
    <li class="flex items-center gap-2 text-text/80 bg-surface/50 p-2 rounded-lg">
      <svg class="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      ${feature}
    </li>
  `).join('');
}

export function showSkeleton(container) {
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const div = document.createElement('div');
        div.className = 'bg-surface rounded-xl shadow-lg overflow-hidden h-96 animate-pulse border border-primary/5';
        div.innerHTML = `
      <div class="h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div class="p-5 space-y-3">
        <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="h-20 bg-gray-300 dark:bg-gray-700 rounded w-full mt-4"></div>
      </div>
    `;
        container.appendChild(div);
    }
}
