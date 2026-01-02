import axios from "axios";

export const internalGet = async (url: string, params?: any) => {
  const res = await axios.get(url, { params });
  return res.data;
};



export const internalPost = async (url: string, body?: any) => {
  const res = await axios.post(url, body);
  return res.data;
};
