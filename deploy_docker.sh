heroku container:login
docker push registry.heroku.com/salty-tor-32110/web
heroku container:release web --app salty-tor-32110