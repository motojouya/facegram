'use strict';

export default class CaptureImage extends HTMLElement {
  constructor(interval, password, mediaDevices) {
    super();
    this.innerHTML = `
      <style>
        .record {
          display: block;
          position: relative;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          background: #F00;
        }
        .pause {
          display: block;
          position: relative;
          height: 40px;
          width: 40px;
        }
        .pause:before {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          height: 40px;
          width: 15px;
          background: #00F;
          content: '';
        }
        .pause:after {
          display: block;
          position: absolute;
          top: 0;
          left: 25px;
          height: 40px;
          width: 15px;
          background: #00F;
          content: '';
        }
        .console {
          width: 100%;
          height: 25%;
        }
        .message {
          height: 20px;
          width: 100%;
          padding: 10px 0 0 0;
          font-size: 1.5rem;
          text-align: center;
        }
        .control_panel {
          height: 60px;
        }
        .record_button {
          height:40px;
          width:40px;
          margin: 10px 10px 10px 10px;
          background-color: transparent;
          padding: 0 0 0 0;
        }
        .audience_password {
          height: 40px;
          width: 280px;
          text-align: center;
          vertical-align: middle;
          display: inline-block;
          font-size: 2rem;
          /* margin: 10px 0 10px 0; */
        }
        .face {
          height: 100%;
          width: 100%;
          background-color: #FFF;
        }
        .image_wrap {
          height: 75%;
        }
      </style>
      <div class="face">
        <div class="image_wrap">
          <video class="invisible" width="360" height="270" id="video_stream" autoplay></video>
          <canvas class="invisible" width="360" height="270" id="canvas_static"></canvas>
          <img id="steel_image" />
        </div>
        <div class="console">
          <div class="message">
            <span>Let your audience know password</span>
          </div>
          <div class="control_panel">
            <button type="button" class="record_button">
              <span id="record_button_span" class="record"></span>
            </button>
            <span id="audience_password" class="audience_password"></span>
          </div>
        </div>
      </div>
    `;
    this.faceStatus = false;
    this.interval = interval;
    this.mediaDevices = mediaDevices;
    this.querySelector('#audience_password').innerHTML = password;

    this.querySelector('#record_button_span').addEventListener('click', e => {
      if (this.faceStatus) {
        this.stop();
      } else {
        this.start(this.interval, this.mediaDevices);
      }
    });
  }

  capture() {
    let videoElement = this.querySelector('#video_stream');
    let canvasElement = this.querySelector('#canvas_static');
    canvasElement.getContext('2d').drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);

    let base64img = canvasElement.toDataURL('image/jpeg');
    this.querySelector('#steel_image').src = base64img;
    this.dispatchEvent(new CustomEvent('capture', {detail: base64img}));
  };

  async start(interval, mediaDevices) {
    let mediaStream = await this.getMediaStream(mediaDevices);
    this.startCapturing(interval, mediaStream);
  };

  async getMediaStream(mediaDevices) {
    const mediaDeviceInfoList = await mediaDevices.enumerateDevices();
    const videoDevices = mediaDeviceInfoList.filter((deviceInfo) => {
      return deviceInfo.kind == 'videoinput';
    });
    if (videoDevices.length < 1) {
      throw new Error('no device for video.');
    }
    return mediaDevices.getUserMedia({
      audio: false,
      video: {
        deviceId: videoDevices[0].deviceId
      }
    });
  };

  startCapturing(interval, mediaStream) {
    this.videoStreamInUse = mediaStream;
    this.querySelector('#video_stream').srcObject = mediaStream;
    this.capture();
    this.intervalId = setInterval(() => this.capture(), interval);

    this.querySelector('#record_button_span').className = 'pause';
    this.faceStatus = true;
  }

  stop() {
    clearInterval(this.intervalId);
    this.videoStreamInUse.getVideoTracks()[0].stop();

    this.querySelector('#record_button_span').className = 'record';
    this.faceStatus = false;
    this.dispatchEvent(new CustomEvent('pause'));
  };
};
