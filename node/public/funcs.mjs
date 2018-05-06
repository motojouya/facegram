'use strict';

const API_VERSION = 1;

const getAPIversion = () => API_VERSION;

const base64ToBinary = (base64img) => {
  let binary = atob(base64img.replace(/^.*,/, '')),
      u8a = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    u8a[i] = binary.charCodeAt(i);
  }
  return u8a;
};

const login = (path, password) => {
  return fetch('/api/v' + API_VERSION + path, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: 'password=' + password,
    credentials: 'same-origin',
  });
};

const sendImage = (base64img) => {

  const fd = new FormData();
  fd.append('face_image', new Blob([base64ToBinary(base64img).buffer], {
    type: 'image/jpeg'
  }));

  fetch('/api/v' + API_VERSION + '/face', {
    method: 'POST',
    body: fd,
    credentials: 'same-origin',
  });
};

const pause = () => {
  fetch('/api/v' + API_VERSION + '/pause', {
    method: 'POST',
    credentials: 'same-origin',
  });
};

const replaceElement = (parent, element) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  parent.appendChild(element);
};

export default {
  replaceElement,
  login,
  sendImage,
  pause,
  getAPIversion,
};

