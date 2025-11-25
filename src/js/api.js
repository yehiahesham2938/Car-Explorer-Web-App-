/**
 * Fetches car data from the local JSON file.
 * @returns {Promise<Array>} List of cars
 */
export async function fetchCars() {
    try {
        // In a real app, this would be an API endpoint.
        // Using absolute path from root for Vite
        const response = await fetch('/src/data/cars.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cars:', error);
        return [];
    }
}

/**
 * Filters and sorts cars based on criteria.
 * @param {Array} cars - The list of cars to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered and sorted cars
 */
export function filterCars(cars, filters = {}) {
    let result = [...cars];

    // Search by brand or model
    if (filters.search) {
        const term = filters.search.toLowerCase();
        result = result.filter(car =>
            car.brand.toLowerCase().includes(term) ||
            car.model.toLowerCase().includes(term)
        );
    }

    // Filter by type
    if (filters.type && filters.type !== 'All') {
        result = result.filter(car => car.type === filters.type);
    }

    // Sort
    if (filters.sort) {
        result.sort((a, b) => {
            if (filters.sort === 'price-asc') return a.price - b.price;
            if (filters.sort === 'price-desc') return b.price - a.price;
            if (filters.sort === 'hp-desc') return b.horsepower - a.horsepower;
            if (filters.sort === 'hp-asc') return a.horsepower - b.horsepower;
            return 0;
        });
    }

    return result;
}

/**
 * Get a single car by ID
 * @param {number} id 
 * @returns {Promise<Object|null>}
 */
export async function getCarById(id) {
    const cars = await fetchCars();
    return cars.find(c => c.id === Number(id)) || null;
}
