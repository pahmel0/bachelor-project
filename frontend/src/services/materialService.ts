import api from "./api";
import { Material, Activity, MaterialStats } from "../types/material";

const materialService = {
  /**
   * Get all materials
   */
  getAllMaterials: async (): Promise<Material[]> => {
    try {
      const response = await api.get("/materials");
      // Handle paginated response from Spring Data
      if (
        response.data &&
        response.data.content &&
        Array.isArray(response.data.content)
      ) {
        console.log("Received paginated response, extracting content array");
        return response.data.content;
      }
      // Fallback to the entire response if it's an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      console.error("Unexpected data format:", response.data);
      return [];
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
   * Create a new material with pictures
   */
  createMaterialWithPictures: async (
    materialData: object,
    pictures: File[]
  ): Promise<Material> => {
    try {
      const formData = new FormData();

      // Add the material data as JSON
      formData.append(
        "material",
        new Blob([JSON.stringify(materialData)], { type: "application/json" })
      );

      // Add the pictures
      for (const picture of pictures) {
        formData.append("pictures", picture);
      }

      const response = await api.post("/materials", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating material with pictures:", error);
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
      // Handle paginated response if applicable
      if (
        response.data &&
        response.data.content &&
        Array.isArray(response.data.content)
      ) {
        return response.data.content;
      }
      // Fallback to the entire response if it's an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      console.error("Unexpected activity data format:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },

  /**
   * Import materials from Excel
   */
  importMaterialsFromExcel: async (file: File): Promise<string> => {
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/materials/import-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error importing materials from Excel:", error);
      throw error;
    }
  },
  /**
   * Export materials to Excel
   */
  exportMaterialsToExcel: async (): Promise<Blob> => {
    try {
      const response = await api.get("/materials/export-excel", {
        responseType: "blob", // Important: needed for binary data
      });
      return new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
      console.error("Error exporting materials to Excel:", error);
      throw error;
    }
  },

  /**
   * Download Excel template for material import
   */
  downloadExcelTemplate: async (): Promise<Blob> => {
    try {
      const response = await api.get("/materials/excel-template", {
        responseType: "blob", // Important: needed for binary data
      });
      return new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } catch (error) {
      console.error("Error downloading Excel template:", error);
      throw error;
    }
  },
};

export default materialService;
