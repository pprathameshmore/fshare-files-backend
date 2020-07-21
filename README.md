# FShare - Files Service

This service handles file operations.

## API Documentation

https://documenter.getpostman.com/view/8028791/T1DmCdhX?version=latest

## Setup

Install dependency:

```
npm install
```

Run app:

```
node src/app.js
```

### Docker

Build Docker Image

```
docker build -t fshare-files-image .
```

Run Docker Image

```
docker run --name fshare-files fshare-files-image
```

Backend

- Express.js
- PostgreSQL
- Redis
