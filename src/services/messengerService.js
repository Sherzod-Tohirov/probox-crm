import api from './axiosConfig';
import { deleteData, fetchData, postData, putData } from './utilities';

export const getMessages = async (options = {}) => {
  try {
    const {
      entityType = 'client',
      entityId,
      docEntry,
      installmentId,
      page = 1,
      limit = 20,
    } = options;

    // For leads: use new API endpoint
    if (entityType === 'lead') {
      if (!entityId) throw Error('Lead ID is required!');
      const response = await fetchData(
        `leads/${entityId}/chat?page=${page}&limit=${limit}`,
        'leadMessages'
      );
      return response?.data || [];
    }

    // For clients: use existing endpoint
    if (!docEntry || !installmentId)
      throw Error('Installment id and doc entry are required for clients!');

    const response = await fetchData(
      `invoice/comments/${docEntry}/${installmentId}`,
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
    const {
      entityType = 'client',
      entityId,
      docEntry,
      installmentId,
    } = options;

    // For leads: use new API endpoint (text only)
    if (entityType === 'lead') {
      if (!entityId) throw Error('Lead ID is required!');
      const response = await api.post(
        `leads/${entityId}/chat`,
        { Comments: data.message || data.Comments },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    }

    // For clients: use existing endpoint (supports files)
    if (!installmentId || !docEntry)
      throw Error('Installment id and doc entry are required for clients!');
    const response = await api.post(
      `invoice/comments/${docEntry}/${installmentId}`,
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
    if (!id) throw Error('Id is required!');
    const { entityType = 'client' } = options;

    // For leads: use leads chat endpoint
    if (entityType === 'lead') {
      const response = await putData(`leads/chat/${id}`, {
        Comments: data.message || data.Comments,
      });
      return response || [];
    }

    // For clients: use existing endpoint
    const response = await putData(`invoice/comments/${id}`, data);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteMessage = async (id, options = {}) => {
  try {
    if (!id) throw Error('Id is required!');
    const { entityType = 'client' } = options;

    // For leads: use leads chat endpoint
    if (entityType === 'lead') {
      const response = await deleteData(`leads/chat/${id}`);
      return response || [];
    }

    // For clients: use existing endpoint
    const response = await deleteData(`invoice/comments/${id}`);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
