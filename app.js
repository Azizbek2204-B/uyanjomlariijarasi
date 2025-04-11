const cookieParser = require('cookie-parser');
const express = require('express');
const sequelize = require('./config/db');
const config = require('config');
const PORT = config.get("port") || 3030
const mainRouter = require("./routes/index.routes")
const requestLogger = require("./middlewares/logger/request.logger")
const reqestErrorLogger = require("./middlewares/logger/reqest.error.logger");
const errorHandling = require('./middlewares/errors/error.handling');

const app = express()

app.use(express.json(), cookieParser(), requestLogger)
app.use("/api", mainRouter)

app.use(reqestErrorLogger);
app.use(errorHandling);
async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter:true})
        app.listen(PORT, () => {
        console.log(`Server started at: http://localhost:${PORT}`);
      });
    } catch (error) {
      console.log(error);
    }
}
  
start();