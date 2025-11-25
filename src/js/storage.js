const STORAGE_KEY_FAVORITES = 'car_explorer_favorites';
const STORAGE_KEY_THEME = 'car_explorer_theme';
 
export function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return stored ? JSON.parse(stored) : [];
}

export function addFavorite(carId) {
    const favorites = getFavorites();
    if (!favorites.includes(carId)) {
        favorites.push(carId);
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent('favorites-updated'));
    }
}

export function removeFavorite(carId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== carId);
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent('favorites-updated'));
}

export function toggleFavorite(carId) {
    const favorites = getFavorites();
    if (favorites.includes(carId)) {
        removeFavorite(carId);
        return false;
    } else {
        addFavorite(carId);
        return true;
    }
}

export function isFavorite(carId) {
    const favorites = getFavorites();
    return favorites.includes(carId);
}

export function getTheme() {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'eco';
}

export function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
}
