const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const exampleRoute = require('./routes/example');

require('dotenv').config();


const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    {flags: 'a'}
);

app.use(helmet());
app.use(compression());
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
  }));
// app.use(morgan('combined',)); // combined common dev short tiny

// app.use(bodyParser.json()); //application/json

app.use((req, res, next) => {

    //// for push
    var allowedOrigins = [
        // 'http://test.com',
        // 'http://localhost'
    ];
    var origin = req.headers.origin;
    console.log(origin);

    //// for deploy
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    //// for dev 
    res.setHeader('Access-Control-Allow-Origin', '*');


    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization' );
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();

    //// for local dev
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization' );
    // if (req.method === 'OPTIONS') {
    //     return res.sendStatus(200);
    // }
    // next();
    
})


app.use('/example', exampleRoute);

//// test /xxx
app.use('/xxx', (req, res, next) => {
    // console.log('in /xxx');
    res.send('<h1>Hello from Express-Nodejs /xxx </h1>')
});
  
app.use('/healthz', (req, res, next) => {
    // console.log('in /healthz');
    res.send('<h3> /healthz . </h3>')
});

app.use('/', (req, res, next) => {
    // console.log('in /xxx');
    res.send('<h1>Hello from Express-Nodejs template/ </h1>')
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data })
})

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`listening on ${port}... express-nodejs-template`);
});



