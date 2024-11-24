"use strict";

import dotenv from 'dotenv'
dotenv.config();

export const config = {
    app: {
      port: process.env.APP_PORT || 3052,
    },
    db: {
      username: process.env.DB_USERNAME ,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME
    },
  };