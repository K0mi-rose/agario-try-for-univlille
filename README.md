
# AGAR.IO - *LOW BUDGET EDITION™*

>Félix PEREIRA 
Quentin ZANARDI
Groupe - *H*
***<u>04/2023</u>*** - Université de Lille 

This project aims to re-create [agar.io](https://www.agar.io), using a combination of Javascript / Typescript.

We used socket.io to create a client-server architecture.

The following section is dedicated to sequence diagrams representing the client - server exchanges.

## Sequence Diagrams

![NewUserSequenceDiagram](./res/newuser.svg)
>*Please note that in the below diagram, the "Clients" actor is containing every connected users*

![InGameLoop](./res/gameloop.svg)
![EndGame](./res/endgame.svg)

## Technical issues :

<u>Client side</u> - The main issue we encountered was the handling of the canvas.
Having a canvas smaller than the actual playground size meant that we had to create a camera object-like (which we didn't figure out early) in order for us to properly arrange the display on every animation frame. Finding the solution was really tough, furthermore when we had to figure out what was going wrong with the translate function (it is kind of counter intuitive when you use it for the first time). 

<u>Server side</u> - The main issue we faced was the scoreboard.
We first had to figure out how we would store it, and then create a class to fetch it, and also update it. That's why we decided to fetch the .json file on construct of the ScoreboardHandler class. We also decided to update the actual file, server side, every three seconds (since writing every seconds could probably add server lag ?).

## Going further with the project :

In order to allow us to go further in this project, here is a list of what we missed / could not do due to lack of time :

|Idea|Explanation|
|--|--|
|Better interface|Clearly, we're not .css gods.|
|Mobile support|Adding event listener for gyroscopic movements (and maybe a responsive design in order to support mobile users)|
|Complexify the tests|Since we just started to use Jest, it was a bit hard to know how to test every functions, especially the random ones.(ColorUtil, Auto food generation in playground...)|
|Fix the frame issue|Sometimes, the frames are getting a bit out of hand, we noticed a few frame drops and we don't know what it is related to.|

## What we are proud of :

Definitely the *credits.html* page. It is objectively speaking an awesome page, both in terms of style and content.

More seriously, we would say that solving the two issues mentioned in the *Technical issues* part was the most satisfying thing cause they took some time, and understanding the solution was really great.

# Run the project :

You need npm and node.js to run the project.

### First of all :

*Install the dependencies :*

`npm i`

### Build :

`npm run build:server`

### Test : 

`npm run test`

### Start :

`npm run start`

## No-dev dependencies :

|Name|Version|
|--|--|
|[dotenv](https://www.npmjs.com/package/dotenv)|16.0.3|
|[express](https://expressjs.com/en/starter/installing.html)|4.18.2|
|[fs](https://nodejs.org/api/fs.html)|0.0.1|
|[jquery](https://jquery.com/)|3.6.4|
|[socket.io](https://socket.io/)|4.6.1|
|[socket.io-client](https://socket.io/)|4.6.1|