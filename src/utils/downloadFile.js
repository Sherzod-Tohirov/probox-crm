import { API_URL } from './apiUtils';

function sanitizeUrl(urlPath) {
  let url = String(urlPath);
  if (!url) return '';
  if (url.startsWith('/')) url = url.slice(1);
  if (!url.startsWith(API_URL)) url = API_URL + url;
  return url;
}

export function openFile(urlPath) {
  let url = sanitizeUrl(urlPath);
  window.open(url);
}

export async function fetchFile(urlPath) {
  const url = sanitizeUrl(urlPath);
  const response = await fetch(url);
  if (!response.status) {
    throw new Error('Failed to fetch file');
  }
  return response.blob();
}

export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
