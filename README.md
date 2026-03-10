This project consists of a backend API built with ASP.NET Core located in the 'bigbanggame-api' folder 
and a frontend UI application developed using React located in the 'bigbanggame-ui' folder.


## Backend Setup
**Prerequisites:** .NET 10 SDK

You can open the solution file 'bigbanggame-api.slnx' with Visual Studio and run the BigBangGame.WebApi project, 
or run it with the following commands:

```bash
# Run the API
cd bigbanggame-api/BigBangGame.Api
dotnet run
# API runs on http://localhost:5500
# You can see the Swagger page on http://localhost:5500/swagger 
```
## Testing
To run the unit tests you can either use Visual Studio's Test Explorer or run the following command: 
```bash
# Run tests
dotnet test
```

# Docker
```bash
docker build -t bigbanggame-api .
docker run -p 5500:5500 bigbanggame-api
```


## Frontend Setup
**Prerequisites:** Node.js 18+

For the frontend, you can open a terminal in the 'bigbanggame-ui' folder and run the following commands:
If VITE_API_URL is not set, it will default to http://localhost:5500/api, but if you need to change it, you can add 
a `.env` file in the 'bigbanggame-ui' folder with the following line to change the API URL
	VITE_API_URL=http://localhost:5500/api


```bash
npm install

# Dev server
npm run dev

# UI runs on http://localhost:3000
```

## Testing
To run the Jest/RTL unit tests you can use the following commands:

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage report
npm test -- --coverage
```
---
## Docker

```bash
docker build -t bigbanggame-ui .
docker run -p 3000:80 bigbanggame-ui
```
Set `VITE_API_URL` at build time 

```bash
docker build --build-arg VITE_API_URL=http://api:5500 -t bigbanggame-ui .
```
