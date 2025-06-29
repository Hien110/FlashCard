const userRouter = require('./User');
const subjectRouter = require('./Subject');
const questionRouter = require('./Question');

function route(app) {
  app.use('/api/user', userRouter);
  app.use('/api/subject', subjectRouter);
  app.use('/api/question', questionRouter);
}

module.exports = route;