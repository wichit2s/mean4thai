# การเพิ่ม model ชื่อ Student ใน project

## 1. เพิ่มไฟล์ `server/models/student.model.js` 

```js
const mongoose = require('mongoose');

/**
 * อ่านเพิ่มเติม https://mongoosejs.com/docs/guide.html
 */
const StudentSchema = new mongoose.Schema(
  {
    sid:       { type: String, required: true },
    first:     { type: String, required: true },
    last:      { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false
  }
);


module.exports = mongoose.model('Student', StudentSchema);
```

## 2. เพิ่มไฟล์ `server/controllers/student.controller.js`

```js
const Joi = require('joi');
const Student = require('../models/student.model');

const studentSchema = Joi.object({
  sid: Joi.number().integer().required(),
  first: Joi.string().required(),
  last: Joi.string().required()
})


module.exports = {
  insert,
  get,
  getAll,
  search,
}

async function insert(student) {
  student = await Joi.validate(student, studentSchema, { abortEarly: false });
  return await new Student(student).save();
}

/**
 * อ่านเพิ่มเติม https://mongoosejs.com/docs/api.html
 */
async function get(sid) {
  return await Student.find({sid: sid});
}

async function getAll() {
  return await Student.find();
}

async function search(key, value) {
  let query = {};
  query[key] = value;
  return await Student.find(query);
}

```

## 3. เพิ่มไฟล์ `server/routes/student.route.js`

```js
const express = require('express');
const asyncHandler = require('express-async-handler');
const studentCtrl = require('../controllers/student.controller');

const router = express.Router();
module.exports = router;

//router.use(passport.authenticate('jwt', { session: false }))

router.route('/').post(asyncHandler(insert));
router.route('/get/:sid(\d+)').get(asyncHandler(get));
router.route('/all').get(asyncHandler(getAll));
router.route('/search').get(asyncHandler(search));


async function insert(req, res) {
  let student = await studentCtrl.insert(req.body);
  res.json(student);
}

async function get(req, res) {
  let all_students = await studentCtrl.get(req.params['sid']);
  res.json(all_students);
}

async function getAll(req, res) {
  let all_students = await studentCtrl.getAll();
  res.json(all_students);
}

async function search(req, res) {
  let result = await studentCtrl.search(req.params['key'], req.params['value']);
  res.json(result);
}

```

## 4. เพิ่มเส้นทางการเรียกในไฟล์ `server/routes/index.route.js`

```js
const express = require('express');
const userRoutes = require('./user.route');
const studentRoutes = require('./student.route');
const authRoutes = require('./auth.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/student', studentRoutes);

module.exports = router;
```

## 5. ตัวอย่างสคริปเพื่อกำหนดข้อมูลเบื้องต้น `scripts/init-students.js`

```js
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
```

## 6. เรียกใช้ `scripts/init-students.js` 

```sh
node scripts/init-students.js
```

## 7. เรียกดูข้อมูลได้จาก `http://localhost:4000/api/student/all`
