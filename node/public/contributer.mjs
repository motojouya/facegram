import funcs from './funcs.mjs';

if (location.protocol !== 'https:') {
  location.href = 'https://' + location.host + '/contributer.html';
}

const {replaceElement, login, sendImage, pause, _} = funcs;
const main = document.querySelector('main');

const bindCaptureImage = async (interval, password) => {
  const module = await import('./capture.mjs');
  const CaptureImage = module.default;
  customElements.define('capture-image', CaptureImage);

  const captureImage = new CaptureImage(interval, password, navigator.mediaDevices);
  captureImage.addEventListener('capture', e => {
    sendImage(e.detail);
  });
  captureImage.addEventListener('pause', e => {
    pause();
  });
  replaceElement(main, captureImage);
};

const bindLoginForm = async () => {
  const module = await import('./login.mjs');
  const LoginForm = module.default;
  customElements.define('login-form', LoginForm);

  const loginForm = new LoginForm();
  loginForm.addEventListener('try', async e => {
    const response = await login('/contributer/auth', e.detail);
    const json = await response.json();

    if (json.auth) {
      bindCaptureImage(json.interval, json.audience_password);
    } else {
      alert('incorrect password');
    }
  });
  replaceElement(main, loginForm);
};

if (customElements && navigator && navigator.mediaDevices) {
  window.addEventListener('DOMContentLoaded', e => bindLoginForm());
} else {
  alert('Change browser to chrome.');
}

