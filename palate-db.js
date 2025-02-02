require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function getUser(userName) {
    const db = client.db('palate');
    const usersCollection = db.collection('users');
    return await usersCollection.findOne({ name: userName });
}

async function addDefaultUser() {
    const db = client.db('palate');
    const usersCollection = db.collection('users');

    const defaultUser = {
        name: "John",
        flavorProfile: ["Pad Thai", "Pho", "Tacos al Pastor"],
        allergens: ["peanut"]
    };

    try {
        await usersCollection.updateOne(
            { name: "John" },
            { $set: defaultUser },
            { upsert: true }
        );
        console.log('Default user added:', defaultUser);
    } catch (error) {
        console.error('Error adding default user:', error);
    }
}

async function updateUserFlavorProfile(userName, dish, liked) {
    const db = client.db('palate');
    const usersCollection = db.collection('users');

    let updateQuery = {};
    if (liked) {
        updateQuery = { $addToSet: { flavorProfile: dish } };
    }

    try {
        await usersCollection.updateOne(
            { name: userName },
            updateQuery
        );
    } catch (error) {
        console.error('Error updating flavor profile:', error);
    }
}

module.exports = {
    connectToMongoDB,
    getUser,
    addDefaultUser,
    updateUserFlavorProfile
};