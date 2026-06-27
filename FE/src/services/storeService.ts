import type { Store } from "../@types/models";

const MOCK_STORES: Store[] = [
  {
    id: "store-1",
    user_id: "1",
    name: "Toko Lautan 1",
    description: "Menjual aneka hasil laut segar terbaik.",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "store-2",
    user_id: "2",
    name: "Toko Lautan 2",
    description: "Udang segar kualitas ekspor.",
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "store-3",
    user_id: "3",
    name: "Toko Lautan 3",
    description: "Ikan laut dan tawar segar setiap hari.",
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
];

class StoreService {
  private stores: Store[] = [...MOCK_STORES];

  async getPublicStore(id: string): Promise<Store> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Lookup by user_id (since product.seller.id maps to store.user_id)
    const store = this.stores.find((s) => s.user_id === id);
    if (!store) {
      throw new Error("Toko tidak ditemukan.");
    }
    return store;
  }
}

export const storeService = new StoreService();
