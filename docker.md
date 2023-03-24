- sudo service docker start
- sudo docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=apisoli -p 5432:5432 bitnami/postgresql
- sudo docker ps
- sudo docker ps -a
- sudo docker start <id>
- sudo docker stop <id>
- sudo docker rm <id>
- sudo docker logs <id>


- sudo docker compose up -d => serve para rodar o script do docker-compose
- sudo docker compose stop -d => para parar o containers
- sudo docker compose down -d => serve para parar e apagar todos os containers
- sudo service docker start => tem que rodar isso para iniciar o serviço do docker