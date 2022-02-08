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
- [🏃  How to Run - with docker](#--how-to-run---with-docker)
- [Usage](#usage)
- [📝 License](#-license)
- [Contributors ✨](#contributors-)

## ❗ Code of Conduct

We expect everyone to abide by our [**Code of Conduct**](.github/CODE_OF_CONDUCT.md). Please read it. 🤝

## 🙌🏻  How to Contribute

Check out our [**Contributing Guide**](.github/CONTRIBUTING.md) for information on contributing.

## 🏃  How to Run - Dev mode

To run the project you will need the requirements listed below and configure the env files as described in the example.
In the next section [**How to run - with docker**](#--how-to-run---with-docker) you can find instructions on how to run the entire project with docker.

### Requirements

1. Node
2. Docker
3. Env files

### Env files

An `.env` file must be present in each app folder (frontend and backend) and it's also needed the `.env` in the root folder of the project in order to create the database.
This files are already provisioned as an example (`.env.example`) in the respective folders and you can use and edit them. In order to use the example, please remove the suffix `.example` from the file name.

The frontend `.env` file have the parameter named *SECRET* that is required by next-auth on the frontend and to generate it just run the following command `openssl rand -base64 32` in the shell then paste it in the `.env` file.  

### Database

Since the database is the only app required to run in dev mode. You need to build it running the follow command `docker-compose up -d mongo` in the project's root folder.
The mongo image is downloaded, built and the database is created with the name that is passed as described in the env file parameter called *DB_NAME*. After the container is built, the init script that's inside the database folder runs in order to create a user to manage and connect to the database from the backend.

### Backend

To run this application for the first time run `npm i` inside the backend folder. Once you have installed the dependencies, simply run: `npm run start:dev`

### Frontend

To run this application for the first time run `npm i` inside the frontend folder. Once you have installed the dependencies, simply run: `npm run dev`

## 🏃  How to Run - with docker

In order to run the whole project with docker you need to prepare the `.env.example` file that is present in the root folder of the project and from there run the following command: `docker-compose up -d`

## Usage

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
