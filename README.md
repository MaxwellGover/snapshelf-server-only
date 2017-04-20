# snapshelf-server

> Get image from Pixelz and save it to Firebase Storage

## pre-requisites

- [Create a Free Heroku Account](https://signup.heroku.com)
- [Create a new Heroku App](https://dashboard.heroku.com/new-app)
- [Get your Firebase Service Account Key](https://firebase.google.com/docs/admin/setup)
- Paste your Firebase Service Account in root folder
- Replace _projectId_ & _bucket_ placeholders with yours

## deploy

```bash
$ heroku git:remote -a <your-new-heroku-app>
$ git push heroku master
```

## usage

Go to `http://docs.pixelz.com/` and generate test requests to your server:

![Demo](https://raw.githubusercontent.com/jobsamuel/snapshelf-server-only/master/demo.png)
