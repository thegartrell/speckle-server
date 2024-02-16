FROM nginx:1.25-bookworm@sha256:25ff478171a2fd27d61a1774d97672bb7c13e888749fc70c711e207be34d370a
ENV FILE_SIZE_LIMIT_MB=100

RUN mkdir -p /var/nginx
COPY utils/docker-compose-ingress/nginx/templates /etc/nginx/templates
COPY utils/docker-compose-ingress/nginx/conf/mime.types /etc/nginx/mime.types

EXPOSE 8080
