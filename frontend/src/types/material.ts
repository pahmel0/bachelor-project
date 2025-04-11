/**
 * Interface for Material data
 */
export interface Material {
  id: number;
  name: string;
  imageUrl: string;
  objectType: string;
  material: string;
  condition: string;
  dateAdded: Date | string;
  dimensions: string;
  notes?: string;
  color?: string;
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
