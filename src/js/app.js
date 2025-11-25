import { getTheme, setTheme, isFavorite, toggleFavorite, getFavorites } from './storage.js';
import { fetchCars, filterCars, getCarById } from './api.js';
import { createCarCard, renderCarDetails, showSkeleton } from './ui.js';

// Initialize Theme
const currentTheme = getTheme();
document.documentElement.setAttribute('data-theme', currentTheme);

// Theme Toggle Logic
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        updateToggleBtnState(toggleBtn, getTheme());
        toggleBtn.addEventListener('click', () => {
            const current = getTheme();
            const newTheme = current === 'eco' ? 'sport' : 'eco';
            setTheme(newTheme);
            updateToggleBtnState(toggleBtn, newTheme);
        });
    }
}

function updateToggleBtnState(btn, theme) {
    if (theme === 'sport') {
        btn.textContent = 'Switch to Eco Mode';
        btn.classList.remove('bg-green-600');
        btn.classList.add('bg-red-600');
    } else {
        btn.textContent = 'Switch to Sport Mode';
        btn.classList.remove('bg-red-600');
        btn.classList.add('bg-green-600');
    }
}

// Page Routing Logic
async function initPage() {
    const path = window.location.pathname;

    if (path.includes('cars.html')) {
        initCarsPage();
    } else if (path.includes('details.html')) {
        initDetailsPage();
    } else if (path.includes('favorites.html')) {
        initFavoritesPage();
    }
}

// --- Cars Page Logic ---
async function initCarsPage() {
    const grid = document.getElementById('cars-grid');
    const skeleton = document.getElementById('loading-skeleton');
    const noResults = document.getElementById('no-results');
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const sortFilter = document.getElementById('sort-filter');
    const resetBtn = document.getElementById('reset-filters');

    if (!grid) return;

    let allCars = [];
    let currentFilters = { search: '', type: 'All', sort: '' };

    // Show skeleton
    skeleton.classList.remove('hidden');
    grid.classList.add('hidden');
    showSkeleton(skeleton);

    // Fetch data
    try {
        allCars = await fetchCars();
        // Simulate delay
        setTimeout(() => {
            skeleton.classList.add('hidden');
            render();
        }, 500);
    } catch (e) {
        console.error(e);
    }

    function render() {
        const filtered = filterCars(allCars, currentFilters);
        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.classList.add('hidden');
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
            grid.classList.remove('hidden');
            filtered.forEach(car => {
                grid.appendChild(createCarCard(car));
            });
        }
    }

    // Events
    searchInput?.addEventListener('input', (e) => { currentFilters.search = e.target.value; render(); });
    typeFilter?.addEventListener('change', (e) => { currentFilters.type = e.target.value; render(); });
    sortFilter?.addEventListener('change', (e) => { currentFilters.sort = e.target.value; render(); });
    resetBtn?.addEventListener('click', () => {
        currentFilters = { search: '', type: 'All', sort: '' };
        if (searchInput) searchInput.value = '';
        if (typeFilter) typeFilter.value = 'All';
        if (sortFilter) sortFilter.value = '';
        render();
    });

    window.addEventListener('favorites-updated', render);
}

// --- Details Page Logic ---
async function initDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const content = document.getElementById('car-content');

    if (!id) {
        loading.classList.add('hidden');
        error.classList.remove('hidden');
        return;
    }

    const car = await getCarById(id);
    if (!car) {
        loading.classList.add('hidden');
        error.classList.remove('hidden');
        return;
    }

    loading.classList.add('hidden');
    content.classList.remove('hidden');

    const els = {
        image: document.getElementById('car-image'),
        type: document.getElementById('car-type'),
        title: document.getElementById('car-title'),
        price: document.getElementById('car-price'),
        year: document.getElementById('car-year'),
        hp: document.getElementById('car-hp'),
        features: document.getElementById('car-features'),
        idDisplay: document.getElementById('car-id-display')
    };

    renderCarDetails(car, els);

    const favBtn = document.getElementById('fav-btn');
    const favText = document.getElementById('fav-text');
    const favIcon = document.getElementById('fav-icon');

    function updateBtn() {
        const isFav = isFavorite(car.id);
        if (isFav) {
            favText.textContent = 'Remove from Favorites';
            favIcon.setAttribute('fill', 'currentColor');
        } else {
            favText.textContent = 'Add to Favorites';
            favIcon.setAttribute('fill', 'none');
        }
    }

    updateBtn();
    favBtn.addEventListener('click', () => {
        toggleFavorite(car.id);
        updateBtn();
    });
}

// --- Favorites Page Logic ---
async function initFavoritesPage() {
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('empty-state');

    if (!grid) return;

    async function render() {
        const favIds = getFavorites();
        if (favIds.length === 0) {
            grid.classList.add('hidden');
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        grid.classList.remove('hidden');
        grid.innerHTML = '';

        for (const id of favIds) {
            const car = await getCarById(id);
            if (car) {
                grid.appendChild(createCarCard(car));
            }
        }
    }

    render();
    window.addEventListener('favorites-updated', render);
}

// Global Init
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initPage();
});
