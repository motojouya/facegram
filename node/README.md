
# facegram

You can show you working hard!

This application is working at Heroku or any PaaS, container services,
and capture images of you in front of your computer by that's camera.
The application take capture by every 10 seconds and send image to your audience.
And if you want, you can adjust interval.

### for who?

1. Remote Worker  
  A Remote Worker can show they are in front of computer or not.
  This is big advantage.
  Because your colleague can know they shoud talk to you or not.

2. Busy Business Person  
  A Business Person who go home back at late night
  can show you working to your family.
  Your family dosen't need to be anxious.
  I show me to my wife because I want her to feel at ease.

### required
Your audience dosen't need install application in the computer
because this is web application.
But you and your audience should use Google Chrome,
facegram dosen't work in other browsers.
And you just need install docker and heroku-cli.
If you still can use Heroku for free, you don't need to pay any.

### how to use

1. Install docker and heroku-cli, make heroku account.

2. Get docker image and push to heroku.

```
heroku login
heroku plugins:install heroku-container-registry
heroku container:login
heroku create <app>
docker pull motojouya/facegram
docker tag motojouya/facegram registry.heroku.com/<app>/web
docker push registry.heroku.com/<app>/web
```

3. Set up env and start application.

SESSION_SECRET, CONTRIBUTER_PASSWORD is must to be required.

```
heroku config:set SESSION_SECRET=<your_session_secret> --app=<app>
heroku config:set CONTRIBUTER_PASSWORD=<your_contributer_password> --app=<app>
heroku config:set INTERVAL=<your_interval_if_you_want> --app=<app>
heroku open -a <app>
```

4. Access as contributer and let your audience know password

URL is `https://your-application.herokuapp.com/contributer.html`.
Access that and enter contributer password.
And then application show audience password, you tell that to your audience.
After you told audience password and url `https://your-application.herokuapp.com/`
to your audience, now you start capturing.

### for developers
Introduction for developer is [here](../README.md)

### links
GitHub https://github.com/motojouya/facegram/

DockerHub https://hub.docker.com/r/motojouya/facegram/

