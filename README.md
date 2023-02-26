# Aplicación Wordle backend

Esta es una apliación wordle, un juego que consiste en adivinar una palabra de 5 letras, la plaicación está construida con Nodejs utilizando el framework Express.js, Typescript, Jest para las pruebas unitarias y para interactuar con la base de datos TypeORM

## Requisitos previos

Para usar esta aplicación es necesario contar con lo siguiente:

- Node.js
- npm
- PostgreSQL

## Endpoints disponibles

- **_POST /api/users_**: Crea un nuevo usuario retornando un token firmado para su posterior uso en demás apis, a su vez se encarga de crear la partida para ese usuario
- **_GET /api/game/word_**: Generar una palabra aleatoria de 5 letras en base a una lista, esta palabara es única por usuario
- **_PUT /api/game/word_**: Realiza el intento de adivinar la palabra en el juego
