import axios from "axios";

const API_URL = "http://localhost:3001/articles"; // Ton backend NestJS

export const createArticle = async (userId: number, articleData: any, file?: File) => {
  try {
    const formData = new FormData();

    // 🔹 Ajouter les champs texte
    for (const key in articleData) {
      if (articleData[key] !== undefined && articleData[key] !== null) {
        formData.append(key, articleData[key]);
      }
    }

    // 🔹 Ajouter la photo si elle existe
    if (file) {
      formData.append('photo', file);
    }

    const response = await axios.post(`${API_URL}/create/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création de l'article:", error);
    throw error;
  }
};



export const getAllArticles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
export const getArticleById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const getUserArticles = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des articles de l'utilisateur:", error);
    throw error;
  }
};


export const deleteArticle = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'article:", error);
    throw error;
  }
};

// Mettre à jour un article
export const updateArticle = async (id: string, articleData: any) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, articleData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'article:", error);
    throw error;
  }
};

