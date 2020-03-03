# Udagram REST API

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/ankitshiv/udacity-c2-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. 
2. [The RestAPI Backend](https://github.com/ankitshiv/udacity-c2-restapi), a Node-Express server which can be deployed to a cloud service.
3. [The Image Filtering Microservice](https://github.com/ankitshiv/image-filter-starter-code), the final project for the course. It is a Node-Express application which runs a simple script to process images.

# Links
1. s3 bucket served static website (simple frontend) - http://udashivharefrontend.s3-website.us-east-2.amazonaws.com
2. Image service URL interfaced with Route53 Domain name - http://image-service.drigbhu.com; use /filterimage?image_url={{}} to get filtered image
3. Udacity-c2-restapi with updated endpoints interfaced with Route53 Domain name -  http://udagram-backend.drigbhu.com; refer to [link](https://github.com/ankitshiv/image-filter-starter-code) for endpoint info

# new endpoints
1. GET /api/v0/filteredimage?imageUrl={{url}} - get filtered image for any public image url; currently only serves buffered output instead of image file
2. GET /api/v0/feed/feed-image/:id - get filtered image for a feed image by feed id; requires auth; currently does not serve feed images as they are not public

***
## Getting Setup

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of this repository. After cloning, open your terminal and run:
```bash
npm install
```
>_tip_: **npm i** is shorthand for **npm install**

### Installing useful tools
#### 1. [Postbird](https://github.com/paxa/postbird)
Postbird is a useful client GUI (graphical user interface) to interact with our provisioned Postgres database. We can establish a remote connection and complete actions like viewing data and changing schema (tables, columns, ect).

#### 2. [Postman](https://www.getpostman.com/downloads/)
Postman is a useful tool to issue and save requests. Postman can create GET, PUT, POST, etc. requests complete with bodies. It can also be used to test endpoints automatically. We've included a collection (`./udacity-c2-restapi.postman_collection.json `) which contains example requsts.

***

## Running the Server Locally
To run the server locally in developer mode, open terminal and run:
```bash
npm run dev
```

Developer mode runs off the TypeScript source. Any saves will reset the server and run the latest version of the codebase. 

