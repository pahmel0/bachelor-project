/**
 * Interface for Material data
 */
export interface Material {
  id: number;
  name: string;
  category: string; // Maps to objectType in UI
  materialType: string; // Maps to material in UI
  condition: string;
  dateAdded: Date | string;
  notes?: string;
  color?: string;
  pictures?: MaterialPicture[];
  // Dimensions-related fields
  height?: number;
  width?: number;
  depth?: number;
  // Additional fields that might be present
  uValue?: number;
  openingType?: string;
  hingeSide?: string;
  swingDirection?: string;
  heightAdjustable?: boolean;
  hasWheels?: boolean;
}

/**
 * Interface for Material Picture data
 */
export interface MaterialPicture {
  id: number;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadDate: Date | string;
  isPrimary: boolean;
  description?: string;
}

/**
 * Interface for Activity data
 */
export interface Activity {
  id: number;
  action: string;
  userId: number;
  userName: string;
  materialId: number;
  materialName: string;
  details: string;
  timestamp: Date | string;
}

/**
 * Material statistics interface
 */
export interface MaterialStats {
  totalCount: number;
  conditionCounts: {
    [key: string]: number;
  };
  typeCounts: {
    [key: string]: number;
  };
}
