import type { Store, CreateStorePayload, UpdateStorePayload } from "../@types/models";

const MOCK_STORES: Store[] = [
  {
    id: "store-1",
    user_id: "2",
    name: "Toko Bahari Jaya",
    description: "Menjual aneka hasil laut segar terbaik.",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "store-2",
    user_id: "3",
    name: "Udang Lestari",
    description: "Udang segar kualitas ekspor.",
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "store-3",
    user_id: "5",
    name: "Ikan Segar Nusantara",
    description: "Ikan laut dan tawar segar setiap hari.",
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
];

class StoreService {
  private stores: Store[] = [...MOCK_STORES];
  private nextId = 4;

  async getMyStore(userId: string): Promise<Store | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const store = this.stores.find((s) => s.user_id === userId);
    return store || null;
  }

  async createStore(userId: string, payload: CreateStorePayload): Promise<Store> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check duplicate name (case-insensitive)
    const duplicate = this.stores.find(
      (s) => s.name.toLowerCase() === payload.name.toLowerCase()
    );
    if (duplicate) {
      throw new Error("Nama toko sudah digunakan.");
    }

    // Check if user already has a store
    const existing = this.stores.find((s) => s.user_id === userId);
    if (existing) {
      throw new Error("Anda sudah memiliki toko.");
    }

    const newStore: Store = {
      id: `store-${this.nextId++}`,
      user_id: userId,
      name: payload.name,
      description: payload.description || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.stores.push(newStore);
    return newStore;
  }

  async updateStore(userId: string, payload: UpdateStorePayload): Promise<Store> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = this.stores.findIndex((s) => s.user_id === userId);
    if (index === -1) {
      throw new Error("Toko tidak ditemukan.");
    }

    // Check duplicate name if name is being changed
    if (payload.name !== undefined) {
      const duplicate = this.stores.find(
        (s) =>
          s.user_id !== userId &&
          s.name.toLowerCase() === payload.name!.toLowerCase()
      );
      if (duplicate) {
        throw new Error("Nama toko sudah digunakan.");
      }
    }

    const existing = this.stores[index];
    const updated: Store = {
      ...existing,
      name: payload.name !== undefined ? payload.name : existing.name,
      description: payload.description !== undefined ? payload.description : existing.description,
      updated_at: new Date().toISOString(),
    };

    this.stores[index] = updated;
    return updated;
  }

  // For T2-05: public store access
  async getPublicStore(id: string): Promise<Store> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const store = this.stores.find((s) => s.id === id);
    if (!store) {
      throw new Error("Toko tidak ditemukan.");
    }
    return store;
  }
}

export const storeService = new StoreService();
