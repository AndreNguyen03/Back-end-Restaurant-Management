import mongoose from 'mongoose';
import {config} from '../configs/config.mongodb.js'

const { username, password ,name } = config.db;
const connectString = `mongodb+srv://${username}:${password}@cluster0.1jlcl.mongodb.net/${name}?retryWrites=true&w=majority&appName=Cluster0`

export default class Database {
    constructor() {
      this.connect();
    }
  
    connect(type = `mongodb`) {
      if (1 === 1) {
        mongoose.set(`debug`, true);
        mongoose.set(`debug`, { color: true });
      }
  
      mongoose
        .connect(connectString, {
          maxPoolSize: 50,
        })
        .then((_) =>
          console.log(`Connected Mongodb Success`)
        )
        .catch((err) => console.log(`Error Connect!`));
    }
  
    static getInstance() {
      if (!Database.instance) {
        Database.instance = new Database();
      }
      return Database.instance;
    }
  }
 