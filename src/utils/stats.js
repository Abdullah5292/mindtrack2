import { authenticatedAxios } from "./axios";

export const getOverviewStats = async () => {
  try {
    const response = await authenticatedAxios.get("/stats/getOverviewStats");
    return response.data;
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    throw error;
  }
};

export const getSkillLevels = async () => {
  try {
    const response = await authenticatedAxios.get("/stats/getSkillLevels");
    return response.data;
  } catch (error) {
    console.error("Error fetching skill levels:", error);
    throw error;
  }
};

export const getCategoryPerformance = async () => {
  try {
    const response = await authenticatedAxios.get("/stats/getCategoryPerformance");
    return response.data;
  } catch (error) {
    console.error("Error fetching category performance:", error);
    throw error;
  }
};

export const getProgressionStats = async (timeframe = "weekly") => {
  try {
    const response = await authenticatedAxios.get("/stats/getProgressionStats", {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching progression stats:", error);
    throw error;
  }
};

export const getRecentActivity = async (limit = 10) => {
  try {
    const response = await authenticatedAxios.get("/stats/getRecentActivity", {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    throw error;
  }
}; 