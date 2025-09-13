export const mockInventoryData = [
  ...Array.from({ length: 25 }, (_, i) => ({
    isParent: true,
    product: {
      id: `prod_${i + 1}`,
      nombre: `Producto Mock ${i + 1}`,
      marca: `Marca ${i % 5 + 1}`,
      modelo: `Modelo ${i + 1}`,
      categoria: `Categoría ${i % 4 + 1}`,
      descripcion: `Descripción del producto mock ${i + 1}`,
      ubicacion: `Ubicación ${i % 3 + 1}`,
      fechaCreacion: `2024-01-${(i % 28) + 1}`,
      costo: Math.floor(Math.random() * 4500) + 500,
    },
    summary: {
      total: 1,
      disponible: 1,
      noDisponible: 0,
      estados: { disponible: 1 },
    },
    children: [
      {
        id: `asset_${i + 1}01`,
        numeroSerie: `SN-MOCK-${i + 1}01`,
        estado: 'Disponible',
        asignadoA: null,
        ubicacion: `Ubicación ${i % 3 + 1}`,
      },
    ],
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    isParent: true,
    product: {
      id: `prod_${i + 26}`,
      nombre: `Producto Sin Costo ${i + 26}`,
      marca: `Marca ${i % 5 + 1}`,
      modelo: `Modelo ${i + 26}`,
      categoria: `Categoría ${i % 4 + 1}`,
      descripcion: `Descripción del producto sin costo ${i + 26}`,
      ubicacion: `Ubicación ${i % 3 + 1}`,
      fechaCreacion: `2024-02-${(i % 28) + 1}`,
      costo: 0,
    },
    summary: {
      total: 1,
      disponible: 1,
      noDisponible: 0,
      estados: { disponible: 1 },
    },
    children: [
      {
        id: `asset_${i + 26}01`,
        numeroSerie: `SN-SINCOSTO-${i + 26}01`,
        estado: 'Disponible',
        asignadoA: null,
        ubicacion: `Ubicación ${i % 3 + 1}`,
      },
    ],
  })),
];

// Lista de usuarios mock para el ComboBox de asignación
export const mockUsers = [
    { value: "carlos.vera", label: "Carlos Vera (TI)" },
    { value: "ana.gomez", label: "Ana Gómez (Redes)" },
    { value: "pedro.ramirez", label: "Pedro Ramírez (Soporte)" },
    { value: "laura.diaz", label: "Laura Díaz (Gerencia)" },
    { value: "miguel.lopez", label: "Miguel López (Contabilidad)" },
    { value: "sandra.ruiz", label: "Sandra Ruiz (RRHH)" },
    { value: "roberto.silva", label: "Roberto Silva (Ventas)" },
    { value: "laura.martinez", label: "Laura Martínez (Diseño)" },
    { value: "otro", label: "Otro (especificar en notas)" },
];

export const mockRetireReasons = [
    { value: "dañado", label: "Dañado / No funcional" },
    { value: "obsoleto", label: "Tecnología Obsoleta" },
    { value: "extravio", label: "Extravío o Robo" },
    { value: "fin_vida_util", label: "Fin de Vida Útil Programado" },
    { value: "otro", label: "Otro (especificar en notas)" },
]; 