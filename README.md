<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [klarify-scheduler](#klarify-scheduler)
  - [Project description](#project-description)
    - [Features](#features)
      - [1. Simple user login](#1-simple-user-login)
      - [2. Manage endpoints](#2-manage-endpoints)
      - [3. Make HTTP requests to endpoints](#3-make-http-requests-to-endpoints)
      - [4. Schedule automated requests](#4-schedule-automated-requests)
      - [5. Trigger manual requests](#5-trigger-manual-requests)
  - [Gettings started](#gettings-started)
    - [Cloning the repository](#cloning-the-repository)
    - [MongoDB](#mongodb)
    - [Installing dependencies](#installing-dependencies)
  - [Running the project](#running-the-project)
  - [Styles](#styles)
  - [Directives](#directives)
  - [Folder structure](#folder-structure)
  - [Miscellaneous examples](#miscellaneous-examples)
    - [Middleware and auth service with jwt tokens](#middleware-and-auth-service-with-jwt-tokens)
    - [Various Angular things](#various-angular-things)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# klarify-scheduler

## Project description

This web app should act like a scheduler and controller of modules such as `klarify-ds-fortnox` (and other as they are created).

### Features

1. [Simple user login](#1-simple-user-login)
2. [Manage endpoints](#2-manage-endpoints)
3. [Make HTTP requests to endpoints](#3-make-http-requests-to-endpoints)
4. [Schedule automated requests](#4-schedule-automated-requests)
5. [Trigger manual requests](#5-trigger-manual-requests)

#### 1. Simple user login

A simple login-system is needed. Login I suggest should be done using email and password, where the _id of the user is attached to the response after creation of login ([example here](https://github.com/Kugghuset/customer-engine/blob/master/server/api/user/user.controller.js)). Passwords are not stored in clear text. I believe using [something like this is a good way of managing password](http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt) (but calling the password field `hashedPassword` instead of `password`, but that's a personal preference).

Similar to how `server/api/endpoint/endpoint.model.js` is structured, the fields users should have a `dateCreated` and `dateModified` which both defaults to `Date.now`, and a field called `disabled` which can remain unset until the user is disabled (we don't delete data :) ). Disabled documents are filter out by adding `disabled: { $ne: true }` to the find options when querying the db (e.g. `Endpoint.find({ disabled: { $ne: true } })`).

Add other user info as felt needed. (name? phone number? nothing fancy)

As the app itself sort of will serve as an admin interface, I believe users should be able to create other users. Feel free to implement however seems natural.

#### 2. Manage endpoints

Users should be able to create, read, update and delete endpoints. Endpoints stored in the db should contain enough data for sending requests. This includes at the very least:

- `name` (String) of the endpoint
- `baseUrl` (String) [required]  of the endpoint (e.g. `http://localhost:5000`)
- `subdirectory` (String) [required] of the endpoints (e.g. `/customers`)
- `description` (String) of the endpoint
- `routes` (Array) on the endpoint (_subdirectories of the subdirectory_), (e.g. `/fetchAndClean`)
  - `name` (String) of the subdirectory
  - `subdirectory` (String) [required]
  - `interval` (Number), defaults to `15`
  - `schedule` (String) schedule string for the [Later.js text parser](https://bunkat.github.io/later/parsers.html#text)
- `dateCreated` (Date), defaults to `Date.now`, set automatically
- `dateModified` (Date), defaults to `Date.now`, set automatically
- `disabled` (Boolean), set automatically

Feel free to add extra properties as needed. (e.g. API tokens when necessary)

#### 3. Make HTTP requests to endpoints

Via the back-end, the requests to the various endpoints should be set up to easily be sent using the information saved to db. Preferably, this would be a single module called something like `requestHandler` which takes a parameter of an Endpoint object (+ the name or index of the subdirectory). I'd suggest using `bluebird` (in-code declared as `Promise`) to return a promise when calling the request (instead of using callbacks).

Every request should be stored in the db, these should contain at least:

- `completeUrl` (String) [required], the complete URL to which the request was made
- `endpoint` (ObjectId of Endpoint) [required], a reference of the Endpoint object with which the request was _created_
- `requestType` (String) [required] (_defaults to scheduled?_), should be either `'manual'` or `'scheduled'`
- `user` (ObjectId of User), a reference of the User object which made the request - only if manual request
- `dateCreated` (Date), defaults to `Date.now`, set automatically
- `dateModified` (Date), defaults to `Date.now`, set automatically
- `disabled` (Boolean), set automatically

#### 4. Schedule automated requests

When managing endpoints, users should be able to create schemas, which I suggest could be done as a set of presets stored as strings for the Later.js text parser to use.

I'd suggest these are made into a Model and stored in the DB, but having some sort of a seed (to populate the db with) if there are no schedules upon start up.

I suggest having the following preset:

- Every 15 minutes
- Every 30 minutes
- Every 1 hour
- Every 2 hours
- Every 4 hours
- Every 8 hours
- At midnight
- At 3 AM (03:00) in the morning
- At 6 AM (06:00) in the morning

[Documentation for Later.js](https://bunkat.github.io/later/getting-started.html)

#### 5. Trigger manual requests

Requests should be possible to trigger from the web app as well. These should be recorded, and a URL (`baseUrl + subdirectory + route.subdirectory`) should restricted to only be made _once every interval_ (for starters only once every 15 minutes).

## Gettings started

### Cloning the repository

Clone the repo using either the `ssh` or `https` as auth:

```bash
# ssh
git clone git@github.com:Kugghuset/klarify-scheduler.git

# https
git clone https://github.com/Kugghuset/klarify-scheduler.git
```

### MongoDB

Access to a `mongod` instance is necessary. By default, the app uses `mongodb://localhost/klarify-scheduler`, but this can be changed by creating a `userCofig.js` in root which exposes the variable `dbString` to any other `mongod` instance.

- [Installing on Windows](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/)
- [Installing on OS X](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
- [Installing on Linux](https://docs.mongodb.org/manual/administration/install-on-linux/)

### Installing dependencies

For back-end dependencies, [NPM](https://www.npmjs.com/) is used, and for front-end, [Bower](http://bower.io/). I'm not entirely sure whether [Node-sass](https://github.com/sass/node-sass) have to be installed globally for `gulp-sass` to work, install it if necessary.

Install global packags (if necessary):

```bash
npm install -g gulp bower node-sass
```

Then install local dependencies, `npm install` for back-end dependencies and `bower install` for front-end dependencies:

```bash
npm install
bower install
```

## Running the project

For running with `mongod` automatically, simply run `gulp` from root. For running only the app (with a separate `mongod` instance), run `gulp app`

If you want **livereload** to automatically reload the browser and hot-swap css for you, a [plugin is needed](http://livereload.com/extensions/). To activate livereload in the browser (when the plugin is installed, obviously), ensure the livereload is active on the page (In Chrome, in the top right corner, there should be a dot in the middle, not a circle).

```bash
# With mongod
gulp

# Without mongod
gulp app
```

## Styles

Styles are written in SCSS and put in partials. These partials should be lowercase and be prefixed with a single `_` (underscore character), similar to `_variables.scss`.

All `.scss` files should somehow be referenced in `public/app/style/global.scss`, which then will be compiled and combined into `public/app/css/global.css`.

NOTE: Don't edit the global.css file as it will be overwritten by `gulp-sass`.

## Directives

Directives should be prefixed with a single lowercase `k`, to ensure naming conflicts doesn't occur. `kBlockButton` is left in the project as an example but has no actual value other than serving as an example. Most often, an isolated scope is preferred (like in `kBlockButton.directive.js`), and values are injected via HTML variables (e.g. `<k-block-button data-sref="main.home" data-title="Example button" data-body="Some text" data-random-number="randNum"></k-block-button>`


## Folder structure

Try to follow this structure as much as possible, and if someting doesn't seem to fit in somewhere, add a new folder in a similar fashion (e.g. a filters folder would be put on in `public/app/filters`).

```
root
├───public
|   ├───app
|   |   ├───directives
|   |   |   └───kBlockButton
|   |   |       ├───kBlockButton.html
|   |   |       └───kBlockButton.directive.js
|   |   ├───routes
|   |   |   ├───home
|   |   |   |   ├───home.html
|   |   |   |   └───home.js
|   |   |   ├───main.html
|   |   |   └───main.js
|   |   ├───services
|   |   |   └───Auth
|   |   |       └───Auth.service.js
|   |   |       └───Auth.service.js
|   |   └────────app.js
|   ├───css
|   │   └───global.css
|   ├───style
|   |   ├───mixins
|   |   |   ├───_breakpoints.scss
|   |   |   └───mixins.scss
|   |   ├───_variables.scss
|   |   └───globlal.scss
│   └───index.html
└───server
    ├───app.js
    ├───config.js
    ├───routes.js
    ├───utils
    │   └───logger.util.js
    ├───api
    │   └───endpoint
    │       ├───endpoint.model.js
    │       ├───endpoint.controller.js
    │       └───index.js
    └───services
        └───auth.js
```

## Miscellaneous examples

### Middleware and auth service with jwt tokens
- [Auth as middleware, (includes ](https://github.com/Kugghuset/customer-engine/blob/master/server/services/auth.js)
- [Auth middleware in action](https://github.com/Kugghuset/customer-engine/blob/master/server/api/user/index.js)

### Various Angular things
- [Interceptors](https://github.com/Kugghuset/customer-engine/blob/master/public/app/app.js)