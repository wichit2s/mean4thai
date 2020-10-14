const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');

const config = require('../server/config/config');

const Student = require('../server/models/student.model');

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { keepAlive: 1 });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});


const students = [
  { sid: 60112233440, first: 'ชูใจ', last: 'เลิศล้ำ' },
  { sid: 60112233441, first: 'มานี', last: 'รักเผ่าไทย' },
  { sid: 60112233442, first: 'ปิติ', last: 'พิทักษ์ถิ่น' },
  { sid: 60112233443, first: 'มานะ', last: 'รักเผ่าไทย' },
  { sid: 60112233444, first: 'วีระ', last: 'ประสงค์สุข' }
];

Student.insertMany(students, (error, docs) => {
  if (error) {
    console.error(error);
  } else {
    console.log(docs);
  }
  mongoose.connection.close();
});
