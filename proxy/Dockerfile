FROM nginx

RUN apt-get update \
 && apt-get install -y openssl \
 && openssl genrsa 2048 > server.key \
 && openssl req -new -key server.key -subj "/C=JP/ST=Tokyo/L=Chuo-ku/O=RMP Inc./OU=web/CN=192.168.99.100" > server.csr \
 && openssl x509 -in server.csr -days 365 -req -signkey server.key > server.crt \
 && cp server.crt /etc/nginx/server.crt \
 && cp server.key /etc/nginx/server.key \
 && chmod 400 /etc/nginx/server.key

COPY default.conf /etc/nginx/conf.d

