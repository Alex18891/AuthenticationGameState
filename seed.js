const { MongoClient } = require('mongodb');

const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const generateSampleUsers = async (count) => {
  const sampleUsers = [];
  for (let i = 1; i <= count; i++) {
    const password = `password${i}`;
    const passwordEncrypt = await bcrypt.hash(password, 10);
    sampleUsers.push({
      username: `user${i}`,
      password: passwordEncrypt,
      email: `user${i}@example.com`,
      country: `Portugal`,
      pushToken: `pushToken${i}`,
      wishlist: [i, i + 1, i + 2],
      createdAt: new Date(),
    });
  }
  return sampleUsers;
};

const generateSampleReviews = async (count) => {
  const userIds = await fetchUserIds();
  const sampleReviews = [];
  for (let i = 1; i <= count; i++) {
    const randomUserIndex = Math.floor(Math.random() * userIds.length);
    const userId = userIds[randomUserIndex];

    sampleReviews.push({
      rating: Math.floor(Math.random() * 5) + 1,
      text: `Review ${i}`,
      forum_id: i,
      user_id: userId,
      title: `Review ${i}`,
      gameStatus: Math.floor(Math.random() * 3) + 1,
    });
  }
  return sampleReviews;
};

const generateSampleTopics = async (count) => {
  const userIds = await fetchUserIds();
  const sampleTopics = [];
  for (let i = 1; i <= count; i++) {
    const randomUserIndex = Math.floor(Math.random() * userIds.length);
    const randomCommentUserIndex = Math.floor(Math.random() * userIds.length);
    const likes = Math.floor(Math.random() * 20);

    const topic = {
      name: `Topic ${i}`,
      text: `This is topic ${i}`,
      forum_id: i,
      user_id: userIds[randomUserIndex],
      comments: [
        {
          text: `Comment ${i}`,
          user_id: userIds[randomCommentUserIndex],
          topic_id: `topic${i}`,
          createdAt: new Date(),
        },
      ],
      likes: likes,
      dislikes: Math.floor(Math.random() * 5),
      likeDislike: [],
      createdAt: new Date(),
    };

    for (let j = 0; j < topic.likes; j++) {
      topic.likeDislike.push({
        username: `user${j + 1}`,
        likeDislike: 1,
      });
    }

    for (let j = 0; j < topic.dislikes; j++) {
      topic.likeDislike.push({
        username: `user${likes + j + 1}`,
        likeDislike: -1,
      });
    }

    sampleTopics.push(topic);
  }
  return sampleTopics;
};

async function fetchUserIds() {
  try {
    const db = client.db('27017');
    const userCollection = db.collection('users');

    const users = await userCollection.find().toArray();
    const userIds = users.map((user) => user._id.toString());

    return userIds;
  } catch (err) {
    console.error(err);
  }
}

async function connect() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (err) {
    console.error(err);
  }
}

async function seedData() {
  try {
    const db = client.db('27017');
    const userCollection = db.collection('users');
    const reviewCollection = db.collection('reviews');
    const topicCollection = db.collection('topics');

    const total = 10;

    const sampleUsers = await generateSampleUsers(total);

    const insertedUsers = await userCollection.insertMany(sampleUsers);
    console.log(
      `${insertedUsers.insertedCount} users inserted into the database`,
    );

    const sampleReviews = await generateSampleReviews(total);

    const insertedReviews = await reviewCollection.insertMany(sampleReviews);
    console.log(
      `${insertedReviews.insertedCount} reviews inserted into the database`,
    );

    const sampleTopics = await generateSampleTopics(total);

    const insertedTopics = await topicCollection.insertMany(sampleTopics);
    console.log(
      `${insertedTopics.insertedCount} topics inserted into the database`,
    );
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
    console.log('Connection closed');
  }
}

connect();
seedData();
