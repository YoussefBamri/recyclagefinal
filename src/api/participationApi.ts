import axios from "axios";

const API_URL = "http://localhost:3001/participations"; // URL de ton backend NestJS

// 🟢 Créer une participation (contribution d'un utilisateur à un défi)
export const createParticipation = async (participationData: {
  userId: number;
  defiId: number;
  quantite: number;
}) => {
  try {
    const response = await axios.post(API_URL, participationData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur lors de la création de la participation :", error);
    throw error;
  }
};

// 🔵 Récupérer toutes les participations d'un défi
export const getParticipationsByDefi = async (defiId: number | string) => {
  try {
    const response = await axios.get(`${API_URL}/defi/${defiId}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la récupération des participations du défi ${defiId} :`, error);
    throw error;
  }
};

// 🟣 Récupérer toutes les participations d'un utilisateur
export const getParticipationsByUser = async (userId: number | string) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la récupération des participations de l'utilisateur ${userId} :`, error);
    throw error;
  }
};

// 🔴 Récupérer une participation par ID
export const getParticipationById = async (id: number | string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la récupération de la participation ${id} :`, error);
    throw error;
  }
};

// 🟡 Supprimer une participation
export const deleteParticipation = async (id: number | string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la suppression de la participation ${id} :`, error);
    throw error;
  }
};

