import fs from 'fs';
import path from 'path';

export type Ruta = {
  id: number;
  nombre: string;
  descripcion?: string;
  origen?: string;
  destino?: string;
  coordenadasOrigen?: { lat:number; lng:number };
  coordenadasDestino?: { lat:number; lng:number };
  sincronizado?: boolean;
};

// 📍 Ruta al archivo JSON
const dataFile = path.join(process.cwd(), 'src/app/api/sync/data.json');

// 📥 Leer datos
function loadData(): Ruta[] {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// 💾 Guardar datos
function saveData(rutas: Ruta[]) {
  fs.writeFileSync(dataFile, JSON.stringify(rutas, null, 2));
}

export function getRutas() {
  return loadData();
}

export function addRuta(r: Ruta) {
  const rutas = loadData();
  rutas.push(r);
  saveData(rutas);
}

export function updateRuta(id: number, data: Partial<Ruta>) {
  const rutas = loadData();
  const index = rutas.findIndex((r) => r.id === id);
  if (index === -1) return null;
  rutas[index] = { ...rutas[index], ...data, sincronizado: false };
  saveData(rutas);
  return rutas[index];
}

export function deleteRuta(id: number) {
  let rutas = loadData();
  rutas = rutas.filter((r) => r.id !== id);
  saveData(rutas);
}
