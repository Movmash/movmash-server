# Movmash server



Movmash is a social media streaming applincation where people can get connected through movies. This is the new way to explore movies and get connected with the people around the world 

Core features include:

1.  Watch movies or any videos together along with video chat
2.  Plan the show virtually and can able to create ticket
3.  Make movie list and able to categorize those list
4.  Explore the movies of other user's choice
5.  Get user recommendation through movies


## Movmash Components

`Movmash` has these major software components:

1. **movmash-client**: A web application
1. **movmash-server**: An API providing access to user data and features


## Installation


Movmash server can be setup to run via node's default package manager `Npm`.



## Standard Installation

Follow these steps to get the api running using npm

1. Install these dependencies if you don't already have them
   - [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
   - [Nodejs](https://nodejs.org/en/)<br>
   <strong>Note:</strong><em>If you do not have MongoDB on your own system, you can proceed with the connection string. Please ensure the right access permissions and firewall openings for the VM/server where the MongoDB is hosted.</em>
2. Clone this repo to your local machine

   ```sh
   git clone https://github.com/Movmash/movmash-server.git
   cd movmash-server
   npm install
   ```

3. Create `.env` file in the root directory of the project
   `.env` file is used to store the secret or environment variables.

   ```sh
   touch .env
   ```

4. Copy the `.env.sample` to `.env`

5. Fill out the following fields:

   - DB_URI
   - API_KEY

     Follow instructions in the comments at the top of `.env`
     API_KEY: To generate your own api key check the documentation of [The Movie Database](https://developers.themoviedb.org/3)

6. Install required node packages

   ```sh
   npm install
   ```

7. Now that we have all the packages, execute the following command to run the server.

   NB: You only have to execute the following command to run the server in future.

   ```sh
   npm run start
   ```


### API DOC

To learn about all endpoints of this API go through this link `http://localhost:8000/api-docs/` after running the local server 



