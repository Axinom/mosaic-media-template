# Mosaic OTT Template Solution

## About the Package

This package is part of the Axinom Mosaic development platform. More information
can be found at https://portal.axinom.com/mosaic.

## License

This mono-repo and all packages contained within it are licensed under the MIT
License. Check the LICENSE file for more details.

## Introduction

This mono-repo contains the customizable parts of an Axinom Mosaic solution. The
code included in that repository is supposed to be customized by projects. The
Mosaic libraries and services used by that solution will be provided, updated
and maintained by Axinom.

## Prerequisites

Before using the customizable solution make sure that you have the following
software installed:

- [node.js](https://nodejs.org/en/) of version 14.\* needs to be installed.
  - [Version 14.18.2](https://nodejs.org/download/release/v14.18.2/) is
    confirmed to work, where other versions may work as well, but would need to
    be tested
  - To install node.js via a package manager, see
    [node.js documentation](https://nodejs.org/en/download/package-manager/).
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Docker](https://docs.docker.com/engine/install/)

This solution comes with a 'dockerized' infrastructure for local development. It
consists of PostgreSQL and pgAdmin. To start/stop the infrastructure run
`yarn infra:up` and `yarn infra:down` accordingly. See
[Prepare the solution](#prepare-the-solution) section below for additional info
on how to start the development infrastructure.

### Note for Windows users

You need to configure Docker for Windows to use Linux containers, see
[Docker documentation](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).

### Note for Linux users

For a better development experience i.e. being able to run `docker` commands
without `sudo`, please see
[Docker post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/).

## Prepare and connect the ott-template solution

1. Run `yarn` to install all package dependencies for the workspace.
2. Run `yarn apply-templates` to create local copies of all `*.template` files
   in the solution.
3. Run `yarn infra:up` to start the development infrastructure.
4. Run `yarn db:reset` to create the databases for all services in the solution.
5. Set the following parameters in the root `.env` that are specific to your
   development environment:

   - `TENANT_ID`
   - `ENVIRONMENT_ID`
   - `RABBITMQ_VHOST`
   - `RABBITMQ_USER`
   - `RABBITMQ_PASSWORD`
   - `DEV_SERVICE_ACCOUNT_CLIENT_ID`
   - `DEV_SERVICE_ACCOUNT_CLIENT_SECRET`

   You will get these values from the 'Environment Connection' station on the
   Environment Administration Portal. For a description on how to create a new
   environment and getting the required connection values, please follow the
   steps described in the section
   '[Prepare the developer environment and get connection values](#prepareEnv)'
   below.

6. Run `yarn setup` to initialize all the services in the solution.

## Run the solution

Start the following commands in parallel (in separate terminals):

1. Run `yarn dev:libs` to start the compilation for the `media-messages` package
   in watch mode. Wait until this finishes before proceeding to avoid
   concurrency issues.
2. Run `yarn dev:services` to start the `media-service` & `catalog-service` in
   watch mode.
3. Run `yarn dev:workflows` to start the `media-workflows` in watch mode.
4. Open http://localhost:10053/ in your browser. You should see a grid with
   different workflow options (Movies, Videos, Images, TV shows, Seasons,
   Episodes).

## Run tests (optional)

Note that these steps take several minutes to complete.

1. Run `yarn test:reset:dbs` to initialize the testing databases.
2. Run `yarn test` to run the unit tests of the solution.

## <a name="prepareEnv"></a> Prepare the developer environment and get connection values

Before running the solution you need to create a Mosaic development environment.
In order to do this, go over to https://admin.service.eu.axinom.com and login
using the tenant id, username and password provided to you by Axinom.

After successful login, please select the "Environments" tile and then click the
'+'-Icon to create a new environment.

Provide a user name and select the "Development" template.
![](./readme/environment-creation.png)

The template will automatically create a management user on environment
creation. You can adjust the email and password for that user in the text boxes
below the template selection. By default it will match the email address of your
Environment Administration user.

The 'Management System Subdomain' is the subdomain under which the management
system will be publicly available. For development the management system will
primarily be used from 'localhost', so this value is not too important for now
and is also possible to be changed later still.

After hitting 'Proceed', the environment will be created and the 'Environment
Connection' screen will show up. You can use this screen to retrieve all the
information you need for connecting the ott-template solution to the created
environment.

![](./readme/environment-connection.png)

## Development notes

- `zapatos` models will be generated after `yarn db:commit` but you can trigger
  the generator manually via `yarn internal:zapatos`.
- Run `yarn test:create:dbs` before running `yarn test` in case new test files
  were created or existing ones renamed or moved.
- To obtain a development-time auth token for a service, run `yarn util:token`
  in that service's workspace. There should also be a corresponding permissions
  file under that service's `scripts/resources`. For a working example see
  `package.json` in the Media Service.
