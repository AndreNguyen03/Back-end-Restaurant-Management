// Chứa access token
import * as dotenv from 'dotenv';
dotenv.config();

const {SECRET_ACCESS_TOKEN} = process.env;

export {SECRET_ACCESS_TOKEN};   