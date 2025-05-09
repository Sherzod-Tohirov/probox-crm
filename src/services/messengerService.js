import { deleteData, fetchData, postData, putData } from "./utilities";

export const getMessages = async (options = {}) => {
  try {
    if (!options?.docEntry || !options?.installmentId)
      throw Error("Installment id and doc entry are required !");

    const response = await fetchData(
      `invoice/comments/${options.docEntry}/${options.installmentId}`,
      "messages"
    );
    console.log(response);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postMessage = async (data, options = {}) => {
  try {
    if (!options?.docEntry || !options?.installmentId)
      throw Error("Installment id and doc entry are required !");

    const response = await postData(
      `invoice/comments/${options.docEntry}/${options.installmentId}`,
      data
    );
    console.log(response);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const putMessage = async (id, data, options = {}) => {
  try {
    if (!id) throw Error("Id is required !");
    const response = await putData(`invoice/comments/${id}`, data);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteMessage = async (id, options = {}) => {
  try {
    if (!id) throw Error("Id is required !");
    const response = await deleteData(`invoice/comments/${id}`);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
