import BaseApi from '../api/BaseApi';

export const GetApi = async endpoint => {
  try {
    const response = await BaseApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PostApi = async (endpoint, data) => {
  try {
    const response = await BaseApi.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
