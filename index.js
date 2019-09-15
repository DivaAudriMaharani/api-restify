const mongoose = require('mongoose');
const AppServer = require('./server');
const env = require('./config/global_config');

const appServer = new AppServer();

// connect to mongodb
mongoose.connect(env.db, {
  useNewUrlParser: true
})
  .then(() => console.log(`MongoDB connected...`))
  .catch(err => console.log(err));

// connect to server
appServer.server.listen(env.port, () => {
  console.log(`Server started at port ${env.port}`);
});