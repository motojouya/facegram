
# facegram

You can show you working hard!

This application is working at Heroku or any PaaS, container services,
and capture images of you in front of your computer by that's camera.
The application take capture by every 10 seconds and send image to your audience.
And if you want, you can adjust interval.

Your audience dosen't need install application in the computer
because this is web application.
And you just need install docker and heroku-cli.
If you still can use Heroku for free, you don't need to pay any.

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

### how to use

1. Install docker and heroku-cli.

2. Get docker image and push to heroku.

```
mkdir facegram
cd facegram
heroku container:login
heroku plugins:install heroku-container-registry
docker pull motojouya/facegram
docker tag <image> registry.heroku.com/<app>/<process-type>
docker push registry.heroku.com/<app>/<process-type>
```

3. Set up env and start application.

SESSION_SECRET, CONTRIBUTER_PASSWORD is must to be required.

```
heroku config:set SESSION_SECRET=YOUR_SESSION_SECRET
heroku config:set CONTRIBUTER_PASSWORD=YOUR_CONTRIBUTER_PASSWORD
heroku config:set INTERVAL=YOUR_INTERVAL_IF_YOU_WANT
heroku open -a <app>
```

4. Access as contributer and let your audience know password

URL is `https://your-domain.herokuapp.com/contributer.html`.
Access that and enter contributer password.
And then application show audience password, you tell that to your audience.
After you told audience password and url `https://your-domain.herokuapp.com/`
to your audience, now you start capturing.

### for developers
This is [Introduction for developer](../README.md)

### links
GitHub https://github.com/motojouya/facegram/
Docker Hub https://hub.docker.com/r/motojouya/facegram/

