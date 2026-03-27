// delete-all-estimates.js
const mongoose = require('mongoose');
const Client = require('./models/client');

const MONGO_URI = 'mongodb+srv://developer:5eZzqXDyM4eifC9q@middler.t5ndcju.mongodb.net/production?retryWrites=true&w=majority&appName=middler';

async function deleteAllEstimates() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await Client.deleteMany({});
  console.log(`Deleted ${result.deletedCount} estimates.`);
  await mongoose.disconnect();
}

deleteAllEstimates().catch(console.error);
