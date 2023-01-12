const createError = require('http-errors');
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const compression = require("compression");
const Seed = require("./db/seed");
// const fileUpload = require("express-fileupload");
const path = require('path');

const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');

require('dotenv').config();

const loginRoutes = require("./routes/login");
const userRoutes = require("./routes/user");
const deviceRoutes = require("./routes/device");
const employeeRoutes = require("./routes/employee");
const attendanceRoutes = require("./routes/attendance");
const dbConnection = require("./db/connection");

const app = express();
const port = process.env.PORT || 5000;

// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());
app.use(morgan('combined'));
app.use(compression());

app.use(cookieParser());
app.use(session({
    secret: 'ksr2116!',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000 }
}))
app.use(flash());

// Routes
app.use("/login", loginRoutes);
app.use("/users", userRoutes);
app.use("/devices", deviceRoutes);
app.use("/employees", employeeRoutes);
app.use("/attendance", attendanceRoutes);

const seed = new Seed();
seed.createAllTables();
// seed.insertEmployee()
// seed.insertLogin()
// seed.insertUser()
dbConnection.connect((err) =>{
    console.log(err)
})

app.use(function(req, res, next) {
    next(createError(404));
})

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
})

//set react as view
app.use(express.static(path.join(__dirname, './public')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public', 'index.html'));
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})