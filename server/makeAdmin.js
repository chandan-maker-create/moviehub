import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/moviehub')
  .then(async () => {
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@example.com' },
      { $set: { role: 'admin' } }
    );
    console.log('Update result:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
