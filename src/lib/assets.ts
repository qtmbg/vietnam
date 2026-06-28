// ============================================================
// ASSETS — public/ URL resolution + cover-image selection.
// Files live in /public/covers/... and /public/family/...
// Works locally + Vercel + under a base path.
// ============================================================
import type { ItineraryDay } from "../data/types";

const assetUrl = (path: string) => {
  const base = import.meta.env?.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};
export const P = (p: string) => assetUrl(p);

// ============================================================
// ASSETS (public/)
// ============================================================
export const ASSETS = {
  family: {
    marilyne: P("/family/marilyne.jpg"),
    claudine: P("/family/claudine.jpg"),
    nizzar: P("/family/nizzar.jpg"),
    aydann: P("/family/aydann.jpg"),
    milann: P("/family/milann.jpg"),
  },
  covers: {
    sections: {
      home: P("/covers/cities/hanoi.jpg"),
      itinerary: P("/covers/moments/train.jpg"),
      hotels: P("/covers/cities/hoi-an.jpg"),
      guide: P("/covers/moments/streetfood.png"),
      tips: P("/covers/moments/market.png"),
      budget: P("/covers/cities/hcmc.jpg"),
      activities: P("/covers/moments/temple.jpg"),
    },
    cities: {
      hanoi: P("/covers/cities/hanoi.jpg"),
      ninh_binh: P("/covers/cities/ninh-binh.jpg"),
      ha_long: P("/covers/cities/ha-long.jpg"),
      hoi_an: P("/covers/cities/hoi-an.jpg"),
      da_nang: P("/covers/cities/da-nang.jpg"),
      hcmc: P("/covers/cities/hcmc.jpg"),
      whale_island: P("/covers/cities/whale-island.jpg"),
    },
    moments: {
      arrival: P("/covers/moments/arrival.jpg"),
      transfer: P("/covers/moments/transfer.jpg"),
      plane: P("/covers/moments/plane.jpg"),
      night: P("/covers/moments/night.jpg"),
      beach: P("/covers/moments/beach.jpg"),
      boat: P("/covers/moments/boat.jpg"),
      market: P("/covers/moments/market.jpg"),
      coffee: P("/covers/moments/coffee.jpg"),
      streetfood: P("/covers/moments/streetfood.jpg"),
      museum: P("/covers/moments/museum.jpg"),
      temple: P("/covers/moments/temple.jpg"),
      massage: P("/covers/moments/massage.jpg"),
      family: P("/covers/moments/family.jpg"),
      love: P("/covers/moments/love.jpg"),
    },
    hotels: {
      hanoi_ja_cosmo: P("/covers/hotels/hanoi-ja-cosmo.jpg"),
      ninh_binh_tam_coc_golden_fields: P("/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg"),
      ha_long_wyndham_legend: P("/covers/hotels/ha-long-wyndham-legend.jpg"),
      ha_long_renea_cruise: P("/covers/hotels/ha-long-renea-cruise.jpg"),
      hoi_an_palm_garden: P("/covers/hotels/hoi-an-palm-garden.jpg"),
      whale_island_resort: P("/covers/hotels/whale-island-resort.jpg"),
      hcmc_alagon_spa: P("/covers/hotels/hcmc-alagon-spa.jpg"),
    },
  },
} as const;

export const cityCoverFromLabel = (label?: string) => {
  const s = (label ?? "").toLowerCase();
  if (s.includes("hanoi")) return ASSETS.covers.cities.hanoi;
  if (s.includes("ninh")) return ASSETS.covers.cities.ninh_binh;
  if (s.includes("ha long") || s.includes("halong")) return ASSETS.covers.cities.ha_long;
  if (s.includes("hoi an") || s.includes("hoian")) return ASSETS.covers.cities.hoi_an;
  if (s.includes("da nang") || s.includes("danang")) return ASSETS.covers.cities.da_nang;
  if (s.includes("ho chi minh") || s.includes("hcmc") || s.includes("saigon")) return ASSETS.covers.cities.hcmc;
  if (s.includes("whale")) return ASSETS.covers.cities.whale_island;
  return ASSETS.covers.sections.home;
};

// Specific scene photo per itinerary date (uses the rich, previously-unused library)
const DAY_COVERS: Record<string, string> = {
  "2026-07-26": "/covers/moments/hanoi-hoan-kiem.jpg",
  "2026-07-27": "/covers/moments/hanoi-temple-of-literature.jpg",
  "2026-07-28": "/covers/moments/hanoi-train-street.jpg",
  "2026-07-29": "/covers/moments/ninh-binh-trang-an.jpg",
  "2026-07-30": "/covers/moments/ninhbinh-hang-mua.jpg",
  "2026-07-31": "/covers/moments/ha-long-cruise.jpg",
  "2026-08-01": "/covers/moments/pont-dragon-da-nang.jpg",
  "2026-08-02": "/covers/moments/hoi-an-old-town-night.jpg",
  "2026-08-06": "/covers/moments/hoi-an-an-bang.jpg",
  "2026-08-08": "/covers/moments/whale-island-ponton.jpg",
  "2026-08-12": "/covers/moments/whale-island-ponton.jpg",
  "2026-08-15": "/covers/moments/hcmc-central-post-office.jpg",
  "2026-08-17": "/covers/moments/hanoi-lan-ong.jpg",
};

// Specific scene photo per activity id (falls back to city cover)
export const ACT_COVERS: Record<string, string> = {
  "ACT-HAN-001": "/covers/moments/hanoi-hoan-kiem.jpg",
  "ACT-HAN-002": "/covers/moments/museum.jpg",
  "ACT-NB-001": "/covers/moments/ninh-binh-trang-an.jpg",
  "ACT-NB-002": "/covers/moments/ninhbinh-hang-mua.jpg",
  "ACT-HA-001": "/covers/moments/hoi-an-old-town-night.jpg",
  "ACT-HA-002": "/covers/moments/boat.jpg",
  "ACT-HA-003": "/covers/moments/temple.jpg",
  "ACT-DAD-001": "/covers/moments/pont-dragon-da-nang.jpg",
  "ACT-SGN-001": "/covers/moments/boat.jpg",
  "ACT-SGN-002": "/covers/moments/hcmc-war-museum.jpg",
};

const MOMENT_COVERS: Record<string, string> = {
  arrival: "/covers/moments/arrival.jpg",
  transfer: "/covers/moments/transfer.jpg",
  plane: "/covers/moments/plane.jpg",
  boat: "/covers/moments/boat.jpg",
  beach: "/covers/moments/beach.jpg",
  night: "/covers/moments/night.jpg",
  market: "/covers/moments/market.jpg",
  coffee: "/covers/moments/coffee.jpg",
  streetfood: "/covers/moments/streetfood.jpg",
  museum: "/covers/moments/museum.jpg",
  temple: "/covers/moments/temple.jpg",
  massage: "/covers/moments/massage.jpg",
  family: "/covers/moments/family.jpg",
  love: "/covers/moments/love.jpg",
};

const momentCoverFromText = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("vol") || t.includes("aéroport") || t.includes("airport") || t.includes("flight")) return MOMENT_COVERS.plane;
  if (t.includes("bateau") || t.includes("croisi") || t.includes("cruise") || t.includes("boat")) return MOMENT_COVERS.boat;
  if (t.includes("plage") || t.includes("beach")) return MOMENT_COVERS.beach;
  if (t.includes("marché") || t.includes("marche") || t.includes("market")) return MOMENT_COVERS.market;
  if (t.includes("café") || t.includes("cafe") || t.includes("coffee")) return MOMENT_COVERS.coffee;
  if (t.includes("street food") || t.includes("street-food") || t.includes("streetfood") || t.includes("food") || t.includes("dîner") || t.includes("diner")) return MOMENT_COVERS.streetfood;
  if (t.includes("musée") || t.includes("musee") || t.includes("museum")) return MOMENT_COVERS.museum;
  if (t.includes("temple")) return MOMENT_COVERS.temple;
  if (t.includes("massage")) return MOMENT_COVERS.massage;
  if (t.includes("arrivée") || t.includes("arrivee") || t.includes("check-in") || t.includes("check in") || t.includes("arrival")) return MOMENT_COVERS.arrival;
  if (t.includes("transfert") || t.includes("transfer") || t.includes("limousine") || t.includes("drive")) return MOMENT_COVERS.transfer;
  if (t.includes("soir") || t.includes("night") || t.includes("lantern")) return MOMENT_COVERS.night;
  return null;
};

export const dayCoverFromDay = (day: ItineraryDay) => {
  if (DAY_COVERS[day.date]) return P(DAY_COVERS[day.date]);
  const text = (day.theme?.join(" ") ?? "") + " " + (day.blocks?.map((b) => b.plan).join(" ") ?? "");
  const cityCover = cityCoverFromLabel(day.city);
  if (day.city.includes("→")) {
    const moment = momentCoverFromText(text);
    if (moment) return P(moment);
  }
  return cityCover;
};
