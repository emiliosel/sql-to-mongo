import mongoose from 'mongoose';

// make a connection
mongoose.connect('mongodb://localhost:27017/tutorialkart');

export const buildQueryString = ({ host, port, user, password, database }) => {
  host = host || 'localhost'
  port = port || '27017'
  password = password || ''
  let authenticationString = (user && password) ? `${user}:${password}@` : ''
  if (!database) throw Error('Should specify a databse which you want to connect')

  return `mongodb://${authenticationString}${host}:${port}/${database}`
}

export const connectMongo = (options) => {
  return new Promise((res, rej) => {
    console.log('Connecting to mongo...')
    let queryString = buildQueryString(options);

    mongoose.connect(queryString);
    const db = mongoose.connection

    db.once('open', () => {
      console.log("Connection to mongo Successful!");
      res(mongoose)
    })

    db.on('error', (er) => {
      console.log('Connection mongo error:')
      rej(er)
    })
  })
}
