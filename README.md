
[![ci](https://github.com/Mnigos/task-manager-api/actions/workflows/main.yml/badge.svg)](https://github.com/Rigtch/rigtch-api/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/Mnigos/task-manager-api/branch/master/graph/badge.svg?token=cWTpVicfeV)](https://codecov.io/gh/Rigtch/rigtch-api)
![LICENSE](https://img.shields.io/github/license/Mnigos/task-manager-api.svg)
![dependencies](https://david-dm.org/Mnigos/task-manager-api.svg)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Rigtch API

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
## Description
API for web application that allows you saving tasks for to do.
This application helps me learning Nest.js

## Usage

### User Endpoints

`users/:name` - Returning profile of user that you provided in param

If service cannot find user's profile it will return `400 - Bad Request`

### Auth Endpoints

`auth/register` - Returning `true` if user was successfully registered.
This endpoint gets user object in body.
```
class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string

  @IsString()
  @IsEmail()
  @MinLength(4)
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  pass: string
}
```
If username already exists in db it will return `409 - Conflict`
<br />
If something wasn't validate correctly it will return `400 - Bad Request`



`auth/login` - Returning an access token if auth was succeed.
This endpoint gets credentials object in body.
```
export interface Credentials {
  readonly nameOrEmail: string
  readonly pass: string
}
```
If pass or nameOrEmail was empty it will return `400 - Bad Request`
<br />
If auth was failed it will return `401 - Unauthorized`


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

[See site!](https://task-manager-site.vercel.app/)

Another projects with same idea

[task-manager-site](https://github.com/Mnigos/task-manager-site)
[task-manager-android](https://github.com/Mnigos/task-manager-android)