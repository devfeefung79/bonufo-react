import axios from 'axios';

const BASE_URL = `https://bonufo-express.vercel.app`;

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { "access-control-allow-origin": "*" },
  withCredentials: true
});

export const axiosPrivate = (accessToken: string) => axios.create({
  baseURL: BASE_URL,
  headers: { "access-control-allow-origin": "*", "Authorization": `Bearer ${accessToken}` },
  withCredentials: true
});