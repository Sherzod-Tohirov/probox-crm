import api from './axiosConfig';
import { deleteData, fetchData, postData, putData } from './utilities';

export const getMessages = async (options = {}) => {
  try {
    if (!options?.docEntry || !options?.installmentId)
      throw Error('Installment id and doc entry are required !');

    const response = await fetchData(
      `invoice/comments/${options.docEntry}/${options.installmentId}`,
      'messages'
    );
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postMessage = async (data = {}, options = {}) => {
  try {
    if (!options?.installmentId || !options?.docEntry)
      throw Error('Installment id and doc entry are required !');
    const response = await api.post(
      `invoice/comments/${options.docEntry}/${options.installmentId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const putMessage = async (id, data, options = {}) => {
  try {
    if (!id) throw Error('Id is required !');
    const response = await putData(`invoice/comments/${id}`, data);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteMessage = async (id, options = {}) => {
  try {
    if (!id) throw Error('Id is required !');
    const response = await deleteData(`invoice/comments/${id}`);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
