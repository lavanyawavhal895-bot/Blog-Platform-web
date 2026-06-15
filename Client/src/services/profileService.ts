import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getProfile = async (token: string) => {
  const res = await axios.get(`${API}/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateProfile = async (
  token: string,
  data: any
) => {
  const res = await axios.put(
    `${API}/api/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};