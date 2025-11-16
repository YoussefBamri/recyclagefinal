import axios from "axios";

const API_URL = "http://localhost:3001/defis"; // URL de ton backend NestJS

// 🟢 Créer un nouveau défi
export const createDefi = async (defiData: any) => {
  try {
    const response = await axios.post(API_URL, defiData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur lors de la création du défi :", error);
    throw error;
  }
};

// 🔵 Récupérer tous les défis
export const getAllDefis = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur lors de la récupération des défis :", error);
    throw error;
  }
};

// 🟣 Récupérer un défi par son ID
export const getDefiById = async (id: number | string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la récupération du défi ${id} :`, error);
    throw error;
  }
};

// 🔴 Supprimer un défi
export const deleteDefi = async (id: number | string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la suppression du défi ${id} :`, error);
    throw error;
  }
};

// 🟡 (Optionnel) Mettre à jour un défi (progression, statut, etc.)
export const updateDefi = async (id: number | string, updateData: any) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la mise à jour du défi ${id} :`, error);
    throw error;
  }
};
