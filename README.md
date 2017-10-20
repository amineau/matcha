# Matcha
## 42 School Projet | Web Branch | Tier 2

Matcha, a Dating WebSite, is the second [project](https://github.com/amineau/matcha/blob/master/matcha.fr.pdf) in the web branch, this is a free-langage project with some restrictions : no ORM, validator, user manager allowed.

### Features

  - User connection
  - User profile
  - Geolocalisation
  - Research user
  - Real time information (connection and notification)
  - Real time chat

### Framework

I used [NodeJs](https://nodejs.org/en/) with [express](https://expressjs.com/) for backend, the framework [VueJS](https://vuejs.org/) for frontend along with [Materialize](http://materializecss.com/).
The principal database is the graph database [Neo4j](https://neo4j.com/) that manage the user accounts, user connections and notifications.
Help by [Mongodb](https://www.mongodb.com/) and [socket.io](https://socket.io/) for the chat management. 

### Running

For run, edit in [docker-compose.yml](https://github.com/amineau/matcha/blob/master/docker-compose.yml) your Ip Host for Docker.

Then you can launch containers with :
```bash
$ docker-compose up
```
The application is available at http://[HOST]:8080.

### Demo

Here is an online [demo](http://matcha.amineau.me)
