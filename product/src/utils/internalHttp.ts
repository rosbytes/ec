import axios from "axios"

const internalHeaders = {
  "x-internal-key": process.env.INTERNAL_SERVICE_KEY!,
}

export const internalGet = async (url: string, params?: any) => {
  const res = await axios.get(url, {
    params,
    headers: internalHeaders,
  })
  return res.data
}

export const internalPost = async (url: string, body?: any) => {
  const res = await axios.post(url, body, {
    headers: internalHeaders,
  })
  return res.data
}



