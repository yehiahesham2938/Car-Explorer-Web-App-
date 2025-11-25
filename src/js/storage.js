const STORAGE_KEY_FAVORITES = 'car_explorer_favorites';
const STORAGE_KEY_THEME = 'car_explorer_theme';

/**
 * Get favorite cars IDs
 * @returns {Array<number>} List of favorite car IDs
 */
export function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Add a car to favorites
 * @param {number} carId 
 */
export function addFavorite(carId) {
    const favorites = getFavorites();
    if (!favorites.includes(carId)) {
        favorites.push(carId);
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('favorites-updated'));
    }
}

/**
 * Remove a car from favorites
 * @param {number} carId 
 */
export function removeFavorite(carId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== carId);
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent('favorites-updated'));
}

/**
 * Toggle favorite status
 * @param {number} carId 
 * @returns {boolean} True if added, false if removed
 */
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

/**
 * Check if a car is favorite
 * @param {number} carId 
 * @returns {boolean}
 */
export function isFavorite(carId) {
    const favorites = getFavorites();
    return favorites.includes(carId);
}

/**
 * Get current theme
 * @returns {string} 'eco' or 'sport'
 */
export function getTheme() {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'eco';
}

/**
 * Set theme
 * @param {string} theme 'eco' or 'sport'
 */
export function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
}
