import axios from "axios";

const API_URL = "http://localhost:3001/recyclage/chat";

export const sendRecyclageMessage = async (message: string) => {
  const response = await axios.post(API_URL, { message });
  return response.data.response;
};
