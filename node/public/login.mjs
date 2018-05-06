'use strict';

export default class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <style>
        ul.auth_hamburger {
          height: 100%;
          width: 100%;
          margin: 0 0 0 0;
          padding: 0 0 0 0;
          background-color: #FFF;
        }
        ul.auth_hamburger > li {
          width: 100%;
          height: 100px;
          margin: 10px 0 10px 0;
          padding: 0 0 0 0;
          display: inline-block;
          text-align: center;
          vertical-align: middle;
        }
        .auth_message {
          color: #0F0;
          border-radius: 5px;
          font-size: 2rem;
          height: 100%;
          vertical-align: middle;
          width: 90%;
          display: inline-block;
          line-height: 100px;
        }
        .password {
          height: 100%;
          vertical-align: middle;
          text-align: center;
          width: 90%;
          border: 1px #0F0 solid;
          border-radius: 5px;
        }
        .enter {
          background-color: #0F0;
          color: #FFF;
          border-radius: 5px;
          font-size: 2rem;
          height: 100%;
          vertical-align: middle;
          width: 90%;
          padding: 0 0 0 0;
        }
      </style>
      <ul class="auth_hamburger">
        <li>
          <span class="auth_message">Password, Please.</span>
        </li>
        <li>
          <input type="password" id="password" class="password" />
        </li>
        <li>
          <button type="button" id="enter" class="enter" >Enter</button>
        </li>
      </ul>
    `;
    this.querySelector('#enter').addEventListener('click', e => {
      const password = this.querySelector('#password').value;
      this.dispatchEvent(new CustomEvent('try', {detail: password}));
    });
  }
};
