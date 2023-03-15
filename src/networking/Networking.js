import {Method} from '../constants';
import {getUserData} from '../utils/Storage';

export const callPostApiWithToken = async (url, data) => {
  const userData = await getUserData();
  const response = await fetch(url, {
    method: Method.post,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${userData.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  let result = await response.json();
  return result;
};

export const callDeleteApiWithToken = async (url, data) => {
  const userData = await getUserData();
  const response = await fetch(url, {
    method: Method.delete,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${userData.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  let result = await response.json();
  return result;
};

export const callPostApiWithTokenMultipart = async (url, data) => {
  const userData = await getUserData();
  const response = await fetch(url, {
    method: Method.post,
    headers: {
      Accept: 'multipart/form-data',
      Authorization: `Bearer ${userData.token}`,
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  });
  let result = await response.json();
  return result;
};

export const callGetApiWithToken = async url => {
  const userData = await getUserData();
  const response = await fetch(url, {
    method: Method.get,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${userData.token}`,
      'Content-Type': 'application/json',
    },
    body: null,
  });
  let result = await response.json();
  return result;
};

/**
 * It takes a url and data as parameters and returns the result of the fetch call.
 * @param url - The URL of the API endpoint.
 * @param data - {
 * @returns The result of the fetch call.
 */
export const callPostApi = async (url, data = null) => {
  const response = await fetch(url, {
    method: Method.post,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  let result = await response.json();
  return result;
};

export const callGetApi = async url => {
  const response = await fetch(url, {
    method: Method.get,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: null,
  });
  let result = await response.json();
  return result;
};
