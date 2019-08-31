# bmac-warehouse

This is the front-end codebase for the inventory mangament software used by the Blue Mountain Action Council Foodbank in Walla Walla Washington.

## How to Use

In order to use this project your machine must have a working version of Git and Node installed. If you have them installed already, from your command line interaface, clone the repository:

`git clone https://github.com/WhitmanCSCapstone/bmac-warehouse.git`

Then install the project's dependencies using npm:

`npm install`

You've installed the app! However, the app is pretty useless without any data, and it'll be grumpy if it's not hooked up to a database.

The current iteration of BMAC-Warehouse expects to be hooked up to a Firebase Realtime Database. If you'd like to use the existing development database please contact benlimpich@gmail.com to get a copy of the API keys to the development database. If you'd like to create your own blank database instance then follow the next few steps, otherwise, skip to the third step.

1. First create a project at [firebase.google.com](https://firebase.google.com/)
2. Go to your Firebase project console, go to the Database tab, choose the Realtime Database menu, and import the json file to your projects Realtime Database.
3. Create a file called `.env` in the `src` directory of your project
4. Copy paste the API keys from your firebase project into your `.env` file, it should look something like this:

```
REACT_APP_DEV_API_KEY=your_api_key
REACT_APP_DEV_AUTHDOMAIN=your_project.firebaseapp.com
REACT_APP_DEV_DATABASEURL=https://your_project.firebaseio.com
REACT_APP_DEV_PROJECTID=your_project
REACT_APP_DEV_STORAGEBUCKET=your_project.appspot.com
REACT_APP_DEV_MESSAGINGSENDERID=your_message_sender_id
```

You now have everything you need to run the app. Go to your project directory on the command line and run `npm start` to spin up a development server.

__PS:__ If you created your own instance, since the app has an authenticated sign in, you'll need to hack your way into creating an account. I'd recommend temporarily undoing [this commit](https://github.com/WhitmanCSCapstone/bmac-warehouse/commit/5e25ec7386b1bfba6ac624b8e49d3dc072d3ffc1), navigating to the `/signup/` page and then creating an account with "Admin" as your role. This will give you full access to your instance of the app.

## History

In the Spring of 2015  Allen Tucker, Visting Professor of Computer Science at Whitman College, adminstered a class with a curriculum designed around creating a real-life production application to help the local foodbank, The Blue Mountain Action Council (BMAC) Foodbank. BMAC originally setup a Microsoft Access system to support record keeping and reporting needs, but it was limited in its capabilites, so Whitman students Moustafa El Badry, Noah Jensen, Dylan Martin, Luis Munguia Orta, and David Quennoz, along with Allen Tucker, created the first generation of BMAC-Warehouse, a PHP and MYSQL web application to serve BMAC's needs. The original app's repository can be found [here](https://github.com/megandalster/bmac-warehouse).

In 2019 the project was passed on to us, a group of Computer Science seniors, as our senior capstone project. After examing the codebase and talking with the Director of the Foodbank, we decided to rebuild the application from scratch. Over the course of the academic year Ben Limpich, Paul Milloy, Rajesh Narayan, Jules Choquart, and Pablo Fernandez built this generation of the app, rewriting existing features and expanding on the functionality of the previous application. We were advised by the Chair of the Computer Science Department at Whitman College, [Janet Davis](https://cs.whitman.edu/~davisj/). The app is currently in use and is maintained by Ben Limpich.
