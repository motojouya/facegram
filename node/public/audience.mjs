import funcs from './funcs.mjs';

if (location.protocol !== 'https:') {
  location.href = 'https://' + location.host + '/contributer.html';
}

const {replaceElement, login, _, __, getAPIversion} = funcs;
const main = document.querySelector('main');

const loadImage = () => {
  const image = new Image();
  image.src = '/api/v' + getAPIversion() + '/face?' + new Date().getTime();
  replaceElement(main, image);
};

const bindImageLoop = (interval) => {
  loadImage();
  setInterval(() => loadImage(), interval);
};

const bindLoginForm = async () => {
  const module = await import('./login.mjs');
  const LoginForm = module.default;
  customElements.define('login-form', LoginForm);

  const loginForm = new LoginForm();
  loginForm.addEventListener('try', async e => {
    const response = await login('/auth', e.detail);
    const json = await response.json();

    if (json.auth) {
      bindImageLoop(json.interval);
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

