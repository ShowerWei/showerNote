# showerNote

ExpressJS newbie project

## Prerequisites

Install [Docker](https://www.docker.com/) on your system.

* [Install instructions](https://docs.docker.com/installation/mac/) for Mac OS X
* [Install instructions](https://docs.docker.com/installation/ubuntulinux/) for Ubuntu Linux
* [Install instructions](https://docs.docker.com/installation/) for other platforms

Install [Docker Compose](http://docs.docker.com/compose/) on your system.

* Python/pip: `sudo pip install -U docker-compose`
* Other: ``curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose; chmod +x /usr/local/bin/docker-compose``

## Setup

1. Run `docker-compose build`. It will install install all dependencies from the (generated) package.json, expose port 3000 to the host, and instruct the container to execute `node app/bin/www` on start up.

## Start

Run `docker-compose up` to create and start the container. The app should then be running on your docker daemon on port 3030.
