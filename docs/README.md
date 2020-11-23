# ARTEMIS Web App Installation

## Install Packages

### Install Docker

1. Make sure that your Ubuntu package sources are up-to-date:

```
   sudo apt-get update
```

2. **(For rootless installation look below)** If not already installed, follow the instructions [here](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce) to install the latest version of the docker tool for managing containers, and [here](https://docs.docker.com/compose/install/#install-compose) to install the docker-compose tool for supporting multi-container Docker applications.

   In production, we have used the following versions successfully:

```
   $ docker -v
   Docker version 18.09.0, build 4d60db4
   $ docker-compose -v
   docker-compose version 1.20.0, build ca8d3c6
```

3. If you would like to run docker without using sudo, please create a docker group, if not existing:

```
   sudo groupadd docker
```

and then add the user to the docker group:

```
   sudo usermod -aG docker $USER
```

For more instructions and potential debugging on this please consult this [webpage](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user).

### Download ARTEMIS Web App

1. Install git for downloading ARTEMIS:

```
   sudo apt-get install git
```

2. Download ARTEMIS from GitHub (if not already downloaded):

```
   git clone https://github.com/CuriouzK0d3r/artemis_web
```

3. The docker-compose utility is configured to pull the latest **stable** released images that are built remotely on [docker cloud](https://cloud.docker.com/). Run the following:

```
cd artemis_web
docker-compose pull
```

to trigger this.

No further installation/building actions are required on your side at this point.

4. Install Node.js and npm from Ubuntu repository (for newer versions you have to install from the NodeSource repository).

```
sudo apt update
sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt -y install nodejs

node --version # must be 12 or newer
```

5. Install required node modules by running:

```
cd artemis_web
yarn install
```

### Running the ARTEMIS Web App

1. To get the mongo db up and running, execute:

```
cd artemis_web
docker-compose up # add -d for detached state
```

2. To get the app running, run the following:

```
yarn run start
```

3. Open a browser and visit http://localhost:4200
