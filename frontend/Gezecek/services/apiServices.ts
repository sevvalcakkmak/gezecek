// Example service modules showing how to use the API client

import { apiClient, ApiResponse } from "./api";

// Example: Trip/Itinerary Service
export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  currency?: string;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripRequest {
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  currency?: string;
  isPublic?: boolean;
}

export const tripService = {
  // Trip CRUD
  async getTrips(page = 1, limit = 10): Promise<{ trips: Trip[]; total: number; page: number; totalPages: number }> {
    const response = await apiClient.get<{ trips: Trip[]; total: number; page: number; totalPages: number }>(`/trips?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getTripById(id: string): Promise<Trip> {
    const response = await apiClient.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  async createTrip(tripData: CreateTripRequest): Promise<Trip> {
    const response = await apiClient.post<Trip>("/trips", tripData);
    return response.data;
  },

  async updateTrip(id: string, tripData: Partial<Trip>): Promise<Trip> {
    const response = await apiClient.put<Trip>(`/trips/${id}`, tripData);
    return response.data;
  },

  async deleteTrip(id: string): Promise<void> {
    await apiClient.delete(`/trips/${id}`);
  },

  // Trip search and discovery
  async searchTrips(
    query: string,
    filters?: {
      destination?: string;
      minBudget?: number;
      maxBudget?: number;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Trip[]> {
    const params = new URLSearchParams({ q: query });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<Trip[]>(`/trips/search?${params.toString()}`);
    return response.data;
  },

  async getPublicTrips(): Promise<Trip[]> {
    const response = await apiClient.get<Trip[]>("/trips/public");
    return response.data;
  },
};

// Example: Places/Attractions Service
export interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
  };
  rating?: number;
  priceLevel?: number;
  photos?: string[];
  openingHours?: string[];
  website?: string;
  phone?: string;
}

export const placesService = {
  async getPlacesByCity(city: string): Promise<Place[]> {
    const response = await apiClient.get<Place[]>(`/places/city/${encodeURIComponent(city)}`);
    return response.data;
  },

  async getPlaceById(id: string): Promise<Place> {
    const response = await apiClient.get<Place>(`/places/${id}`);
    return response.data;
  },

  async searchPlaces(query: string, location?: { lat: number; lng: number; radius?: number }): Promise<Place[]> {
    const params = new URLSearchParams({ q: query });

    if (location) {
      params.append("lat", String(location.lat));
      params.append("lng", String(location.lng));
      if (location.radius) {
        params.append("radius", String(location.radius));
      }
    }

    const response = await apiClient.get<Place[]>(`/places/search?${params.toString()}`);
    return response.data;
  },

  async getPlacesByCategory(category: string, city?: string): Promise<Place[]> {
    const params = new URLSearchParams({ category });
    if (city) {
      params.append("city", city);
    }

    const response = await apiClient.get<Place[]>(`/places/category?${params.toString()}`);
    return response.data;
  },
};

// Example: Upload Service
export const uploadService = {
  async uploadImage(file: File | FormData, folder = "general"): Promise<{ url: string; filename: string }> {
    const formData = file instanceof FormData ? file : new FormData();
    if (!(file instanceof FormData)) {
      formData.append("image", file);
    }
    formData.append("folder", folder);

    const response = await apiClient.upload<{ url: string; filename: string }>("/upload/image", formData);
    return response.data;
  },

  async uploadMultipleImages(files: File[], folder = "general"): Promise<{ urls: string[]; filenames: string[] }> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });
    formData.append("folder", folder);

    const response = await apiClient.upload<{ urls: string[]; filenames: string[] }>("/upload/images", formData);
    return response.data;
  },
};

// Export all services
export const apiServices = {
  trip: tripService,
  places: placesService,
  upload: uploadService,
};
