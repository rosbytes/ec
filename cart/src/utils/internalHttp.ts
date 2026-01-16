import axios from "axios";

const internalHeaders = {
  "x-internal-key": process.env.INTERNAL_SERVICE_KEY!,
};

const axiosInstance = axios.create({
  timeout: 5000, // 5 seconds timeout
  headers: internalHeaders,
});

const requestWithRetry = async (fn: () => Promise<any>, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
};

export const internalGet = async (url: string, params?: any) => {
  return requestWithRetry(async () => {
    const res = await axiosInstance.get(url, { params });
    return res.data;
  });
};

export const internalPost = async (url: string, body?: any) => {
  return requestWithRetry(async () => {
    const res = await axiosInstance.post(url, body);
    return res.data;
  });
};
