import { AxiosResponse } from 'axios';
import { axiosPublic } from '../utils/ServiceUtils';
import { AccessToken } from '../utils/UserUtils';
import { RegisterFormRequestBody, LoginFormRequestBody } from '../utils/FormUtils';

export const register = async (requestBody: RegisterFormRequestBody): Promise<any | undefined> => {
  const data = await axiosPublic.post(`/user/signup`, requestBody)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data.message;
    })
  return data;
};

export const login = async (requestBody: LoginFormRequestBody): Promise<string | undefined> => {
  const data = await axiosPublic.post(`/user/login`, requestBody)
    .then(res => {
      return res.data.accessToken;
    })
    .catch((err) => {
      return err.response.data.message;
    })
  return data;
};

export const refresh = async (): Promise<AccessToken | undefined> => {
  const data = await axiosPublic.get(`/user/refresh`)
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    })
  return data;
};

export const logout = async (): Promise<void> => {
  axiosPublic.get(`/user/logout`)
    .then(res => {
      return res.data.accessToken;
    })
    .catch((err) => {
      console.log(err.message);
    })
};
