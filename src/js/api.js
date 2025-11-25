
export async function fetchCars() {
    try {
        // fetch eldata mn el API 
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
export function filterCars(cars, filters = {}) {
    let result = [...cars];

    // Search by model
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

export async function getCarById(id) {
    const cars = await fetchCars();
    return cars.find(c => c.id === Number(id)) || null;
}
