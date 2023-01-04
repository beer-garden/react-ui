# Beer Garden React UI

Please ensure to have Beer Garden itself installed and running on your system. This is only a UI layer and is non-functional without a running Beer Garden python server. Please see [beer-garden.io](https://beer-garden.io/docs/) for more information on how Beer Garden works.

## Getting Started

This frontend is built and served as part of the main Beer Garden project. Please see [the main repo](https://github.com/beer-garden/beer-garden) for more details.

The React UI can also be served on a customized production server, using web hosting software such as Nginx. Run the build script (see script details below) from the main folder to generate the production build artifacts to be used with the server. An example of Nginx configuration can be found in the main Beer Garden repo.

## Available Scripts

After cloning the repo, in the project directory you can run:

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm start`

Runs the app in the development mode. Be sure to run `npm install` first if not previously run to download all necessary dependencies.\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in single run mode. Tests will only run once then print a report.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run test-coverage`

Launches the test running in single run mode, but also generates a code coverage report that is printed along with the test report. More detailed reports can be found under `coverage` folder after running.

### `npm run test-watch`

Launches the test runner in interactive watch mode. Tests will automatically re-run after any change, which is helpful for debugging or writing tests.
