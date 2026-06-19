// 1. Definimos los estados posibles de un producto usando Union Types
type StockStatus = "DISPONIBLE" | "BAJO_STOCK" | "AGOTADO";

// 2. Creamos el contrato para nuestros productos
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status?: StockStatus; // El signo de interrogación hace que esta propiedad sea opcional
}

// 3. Simulamos nuestra base de datos inicial con algunos artículos
const inventory: Product[] = [
  {
    id: "P-001",
    name: "Filtro de Gasolina (Ford Fiesta)",
    price: 15.5,
    stock: 4,
  },
  { id: "P-002", name: "Citrato de Magnesio + B6", price: 22.0, stock: 15 },
  { id: "P-003", name: "Té Masala Chai (Granel 500g)", price: 8.5, stock: 2 },
  { id: "P-004", name: "Refrigerante Motor", price: 12.0, stock: 0 },
];

// 4. Lógica de Negocio: Función para actualizar el estado del stock
const updateStockStatus = (items: Product[]): Product[] => {
  // Usamos .map() de JavaScript para transformar cada elemento del array
  return items.map((item) => {
    let currentStatus: StockStatus = "DISPONIBLE";

    if (item.stock === 0) {
      currentStatus = "AGOTADO";
    } else if (item.stock < 5) {
      currentStatus = "BAJO_STOCK";
    }

    // Retornamos un nuevo objeto copiando el anterior y agregando el estado
    return { ...item, status: currentStatus };
  });
};

// 5. Lógica de Negocio: Obtener el valor total del inventario
const calculateTotalValue = (items: Product[]): number => {
  // Usamos .reduce() para sumar el valor (precio * stock) de todos los items
  return items.reduce((total, item) => total + item.price * item.stock, 0);
};

// --- EJECUCIÓN ---
const processedInventory = updateStockStatus(inventory);

console.log("📊 Reporte de Inventario SmartAdmin:");
console.table(processedInventory); // console.table dibuja una tabla hermosa en la terminal
console.log(
  `💰 Valor total del inventario: $${calculateTotalValue(processedInventory)}`,
);

// 6. Definimos un contrato para nuestros criterios de búsqueda.
// Todas las propiedades son opcionales (?), así el usuario puede filtrar por lo que quiera.
interface FilterCriteria {
  searchTerm?: string;
  status?: StockStatus;
  maxPrice?: number;
}

// 7. Lógica de Negocio: El Filtro Avanzado
const filterProducts = (
  items: Product[],
  criteria: FilterCriteria,
): Product[] => {
  return items.filter((item) => {
    // Asumimos que el producto cumple, a menos que un filtro diga lo contrario
    let isMatch = true;

    // A. Filtro por término de búsqueda (texto)
    if (criteria.searchTerm) {
      // Pasamos todo a minúsculas para que "Filtro" y "filtro" sean iguales
      const term = criteria.searchTerm.toLowerCase();
      const productName = item.name.toLowerCase();

      // Si el nombre del producto NO incluye el término, lo descartamos
      if (!productName.includes(term)) {
        isMatch = false;
      }
    }

    // B. Filtro por estado del inventario
    if (criteria.status) {
      if (item.status !== criteria.status) {
        isMatch = false;
      }
    }

    // C. Filtro por precio máximo
    if (criteria.maxPrice) {
      if (item.price > criteria.maxPrice) {
        isMatch = false;
      }
    }

    return isMatch;
  });
};

// --- PRUEBAS DEL FILTRO ---
// Recuerda usar el inventario que ya pasamos por updateStockStatus() para que tenga el estado
console.log("\n🔍 Buscando productos que incluyan 'magnesio':");
const searchResult = filterProducts(processedInventory, {
  searchTerm: "magnesio",
});
console.table(searchResult);

console.log("\n⚠️ Buscando productos en estado 'BAJO_STOCK':");
const lowStockResult = filterProducts(processedInventory, {
  status: "BAJO_STOCK",
});
console.table(lowStockResult);

console.log("\n💸 Buscando productos por debajo de $15:");
const budgetResult = filterProducts(processedInventory, { maxPrice: 15.0 });
console.table(budgetResult);
