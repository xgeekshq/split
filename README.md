<h1 align="center">
  Divide & Conquer
</h1>
<h3 align="center">
  Large teams retrospectives
</h3>
<br>

[![Released under the MIT license.](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![All Contributors][all-contributors-badge]](#contributors)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Code of Conduct][coc-badge]][coc]

## Table of Contents

- [Table of Contents](#table-of-contents)
- [❗ Code of Conduct](#-code-of-conduct)
- [🙌🏻  How to Contribute](#--how-to-contribute)
- [🏃  How to Run - Dev mode](#--how-to-run---dev-mode)
  - [Requirements](#requirements)
  - [Env files](#env-files)
  - [Database](#database)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Usage](#usage)
- [📝 License](#-license)
- [Contributors ✨](#contributors-)

## ❗ Code of Conduct

We expect everyone to abide by our [**Code of Conduct**](.github/CODE_OF_CONDUCT.md). Please read it. 🤝

## 🙌🏻  How to Contribute

Check out our [**Contributing Guide**](.github/CONTRIBUTING.md) for information on contributing.

## 🏃  How to Run - Dev mode

To run the project you will need the requirements listed below and configure the env files as described in the example.
In the near future all applications will be dockerized.

### Requirements

1. Node
2. Docker
3. Env files

### Env files
An .env file must be in the project root folder where the docker compose file is located and the others in each app folder (frontend and backend).
This files are already provisioned as an example (`.env.example`) in the respective folders and you can use and edit them.

The frontend .env file have two parameters named _JWT_SIGNING_KEY_ and *JWT_SIGNING_KEY_ID* that are required by next-auth on the frontend and to generate them just run the following command `npm install -g node-jose-tools` in the shell and after the installation, run `jose newkey -s 512 -t oct -a HS512`. Source: [Next-auth](https://next-auth.js.org/v3/warnings#jwt_auto_generated_signing_key).  
After executing the last command an object is returned as:
```
{"kty": "oct","kid": "JWT_SIGNING_KEY_ID","alg": "HS512","k": "JWT_SIGNING_KEY"} 
```
The **kid** is the *JWT_SIGNING_KEY_ID* from the env file and **k** the *JWT_SIGNING_KEY*.

### Database

Since the database is the only app that is containerized, to run it step into the project root folder and run `docker-compose up -d`.
The mongo image is downloaded, built and the database is created with the name that is passed as described in the env file parameter called *DB_NAME*. After the container is built, the init script that's inside the database folder runs in order to create a user to manage and connect to the database from the backend.

### Backend

To run this application for the first time run `npm i` inside the backend folder. Once you have installed the dependencies, simply run: `npm run start:dev`

### Frontend

To run this application for the first time run `npm i` inside the frontend folder. Once you have installed the dependencies, simply run: `npm run dev`

### Usage

The backend will run on `http://localhost:BACKEND_PORT` and the frontend on `http://localhost:3000`. Be aware the frontend root page ("/") is the landing page and has not yet been built so you must manually enter one of the following routes:

- "/dashboard": dashboard
- "/auth": authentication

You must register to access the dashboard page

## 📝 License

Licensed under the [MIT License](./LICENSE).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
 
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[all-contributors-badge]: https://img.shields.io/github/all-contributors/xgeekshq/divide-and-conquer?color=orange&style=flat-square
[coc]: .github/CODE_OF_CONDUCT.md
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square

------------------------------------------------------------------------------------------------------
<p align="center">
  <a align="center" href="https://www.xgeeks.io/">
    <img alt="xgeeks" src="https://github.com/xgeekshq/oss-template/blob/main/.github/IMAGES/xgeeks_Logo_Black.svg" width="100">
  </a>
</p>
<h4 align="center">xgeeks Open Source</h4>
