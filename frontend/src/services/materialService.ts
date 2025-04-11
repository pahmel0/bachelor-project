import api from "./api";
import { Material, Activity, MaterialStats } from "../types/material";

const materialService = {
  /**
   * Get all materials
   */
  getAllMaterials: async (): Promise<Material[]> => {
    try {
      const response = await api.get("/materials");
      return response.data;
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw error;
    }
  },

  /**
   * Get a single material by ID
   */
  getMaterial: async (id: number): Promise<Material> => {
    try {
      const response = await api.get(`/materials/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching material ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new material
   */
  createMaterial: async (material: Omit<Material, "id">): Promise<Material> => {
    try {
      const response = await api.post("/materials", material);
      return response.data;
    } catch (error) {
      console.error("Error creating material:", error);
      throw error;
    }
  },

  /**
   * Update an existing material
   */
  updateMaterial: async (
    id: number,
    material: Partial<Material>
  ): Promise<Material> => {
    try {
      const response = await api.put(`/materials/${id}`, material);
      return response.data;
    } catch (error) {
      console.error(`Error updating material ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a material
   */
  deleteMaterial: async (id: number): Promise<void> => {
    try {
      await api.delete(`/materials/${id}`);
    } catch (error) {
      console.error(`Error deleting material ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get material statistics for dashboard
   */
  getMaterialStats: async (): Promise<MaterialStats> => {
    try {
      const response = await api.get("/materials/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching material statistics:", error);
      throw error;
    }
  },

  /**
   * Get recent activity for the activity feed
   */
  getRecentActivity: async (): Promise<Activity[]> => {
    try {
      const response = await api.get("/audit-trail");
      return response.data;
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },
};

export default materialService;
