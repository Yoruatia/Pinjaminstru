

const API_BASE = "http://localhost:3000/api";
const USE_MOCK = true;

const MOCK_INSTRUMENTS = [
  { instrument_id: 1, instrument_code: "MET-WND-001", instrument_name: "Anemometer", category_name: "Wind Measurement", brand: "Young", model: "05103", condition: "good", status: "available", description: "Mengukur kecepatan dan arah angin." },
  { instrument_id: 2, instrument_code: "MET-WND-002", instrument_name: "Anemometer", category_name: "Wind Measurement", brand: "Young", model: "05103", condition: "good", status: "borrowed", description: "Mengukur kecepatan dan arah angin." },
  { instrument_id: 3, instrument_code: "MET-PRS-001", instrument_name: "Barometer Digital", category_name: "Atmospheric Pressure", brand: "Vaisala", model: "PTB330", condition: "good", status: "available", description: "Mengukur tekanan udara." },
  { instrument_id: 4, instrument_code: "MET-RNG-001", instrument_name: "Rain Gauge", category_name: "Precipitation Measurement", brand: "Davis", model: "7852", condition: "good", status: "available", description: "Mengukur curah hujan (tipping bucket)." },
  { instrument_id: 5, instrument_code: "MET-RNG-002", instrument_name: "Rain Gauge", category_name: "Precipitation Measurement", brand: "Davis", model: "7852", condition: "fair", status: "deployed", description: "Terpasang di stasiun ARG-001." },
  { instrument_id: 6, instrument_code: "MET-TMP-001", instrument_name: "Termometer Digital", category_name: "Temperature Measurement", brand: "Campbell", model: "HMP60", condition: "good", status: "available", description: "Mengukur suhu udara." },
  { instrument_id: 7, instrument_code: "MET-HYG-001", instrument_name: "Hygrometer", category_name: "Humidity Measurement", brand: "Vaisala", model: "HMP155", condition: "fair", status: "maintenance", description: "Sedang dikalibrasi ulang." },
  { instrument_id: 8, instrument_code: "MET-RAD-001", instrument_name: "Pyranometer", category_name: "Radiation Measurement", brand: "Kipp & Zonen", model: "CMP3", condition: "good", status: "borrowed", description: "Mengukur radiasi matahari." },
  { instrument_id: 9, instrument_code: "MET-AWS-001", instrument_name: "Automatic Weather Station", category_name: "Atmospheric Pressure", brand: "Davis", model: "Vantage Pro2", condition: "good", status: "deployed", description: "Terpasang di AWS-001, Kampus." }
];

const STATUS_LABEL = {
  available: "Tersedia",
  borrowed: "Dipinjam",
  maintenance: "Perawatan",
  deployed: "Terpasang di stasiun"
};

async function getInstruments() {
  if (USE_MOCK) return MOCK_INSTRUMENTS;
  const res = await fetch(`${API_BASE}/instruments`);
  if (!res.ok) throw new Error("Gagal mengambil data instrumen");
  return res.json();
}
