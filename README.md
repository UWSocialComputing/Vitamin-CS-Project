# Look Club
Hello! Welcome to *Look Club*, a social platform that allows users to watch TV shows asynchronously on a schedule and chat about them with others.

## Structure
This application uses what is often called the MERN stack. This means we have a frontend and a backend:

Our frontend is in React. You will find this in `frontend/`. All React components are stored in `frontend/components/`.

Our backend is in NodeJS + Express. You will find this in `server/`. `server/server.js` is where the actual server is created, but we define all of our endpoints within `server/routes/`. We also connect our backend to a MongoDB database. The logic for this connection is found in `server/db/`.

## Installation Instructions
There are a few steps that you will need to take to get the project running locally. Make sure you download [NodeJS](https://nodejs.org/), as it is a requirement to run the project. Then follow these steps:

1. Clone the repo into a local directory.
2. Set up the frontend
    1. Run `cd frontend`.
    2. Run `npm install`. Wait for this to install all of the necessary packages.
    3. Then, you need to place a `clientConfig.json` file within the `src/` subdirectory. To get this file, please contact the owners of this repo (as it contains sensitive information from our Stream account).
3. Set up the backend
    1. Run `cd server`.
    2. Run `npm install`. Wait for this to install of the necessary packages.
    3. Then, you need to place a `config.env` file within the `src/` subdirectory. As before, please contact the owners of this repo to get this file.

After doing these steps, the repo should be all set up and ready to use!

## How To Run
Make sure to do the installation steps **before** trying to run this. To run the app locally, perform the following steps:
1. You will need two open two terminals.
2. First, start the backend.
    1. Run `cd server`
    2. Run `npm start`. This will leave it hanging in that terminal as the backend runs. By default, this will run on port 5000.
3. Then, start the frontend.
    1. Run `cd frontend`
    2. Run `npm start`. This will leave it hanging in that terminal as the frontend runs. By default, this will run on port 3000.

Then, you can go to `localhost:3000` to begin using the app. If you haven't done so already, you will need to start by creating an account before exploring the rest of *Look Club*.

## Authors
This project is part of UW's CSE 481 Social Computing Capstone (website [here](https://social.cs.washington.edu/cse481social/)). We are team Vitamin CS, consisting of William Castro, Elijah Greisz, Shaurya Jain, and Logan Wang. To learn more about our development process, visit our project blog [here](https://uwsocialcomputing.github.io/Vitamin-CS/).
