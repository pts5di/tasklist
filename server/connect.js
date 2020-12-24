const { MongoClient, ObjectId } = require("mongodb");

const { readFileSync, existsSync } = require('fs');
const envJson = existsSync("./.env.json") && JSON.parse(readFileSync('./.env.json'));
const { MONGO_USERNAME, MONGO_PASSWORD } = { ...process.env, ...envJson };

if (!MONGO_USERNAME || !MONGO_PASSWORD) {
    console.log("PLEASE provide a username and password for MongoDB (MONGO_USERNAME and MONGO_PASSWORD envvars)");
    process.exit(1);
}

const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.eijlo.mongodb.net/tasklist-db?retryWrites=true&w=majority`;

async function addNewTasklist() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("tasklist-db");

    const tasklistCollection = db.collection("tasklists");

    let tasklistDocument = {}

    const result = await tasklistCollection.insertOne(tasklistDocument);
    const resultId = result.insertedId;

    const tasklist = await tasklistCollection.findOne({
        _id: resultId
    });

    client.close();
    return {
        _id: resultId.valueOf(),
        tasks: []
    };
}

async function getTasklistById(tasklistId) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("tasklist-db");

    const tasklistCollection = db.collection("tasklists");
    const query = {"_id": ObjectId(tasklistId) };
    const tasklist = await tasklistCollection.findOne(query);

    const taskCollection = db.collection("tasks");
    const tasks = await taskCollection.find({
        tasklistId: tasklist._id
    });

    client.close();
    return {
        _id: tasklistId,
        tasks: tasks.toArray()

    };
}

async function addItemToTasklist(tasklistId, item) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("tasklist-db");

    const tasklistCollection = db.collection("tasklists");
    const query = {"_id": ObjectId(tasklistId) };
    const tasklist = await tasklistCollection.findOne(query);

    const taskCollection = db.collection("tasks");
    await taskCollection.insertOne({
        tasklistId: tasklist._id,
        ...item
    });

    const tasks = await taskCollection.find({
        tasklistId: tasklist._id
    });

    client.close();
   
    return {
        _id: tasklistId,
        tasks: tasks.toArray()

    };
}

async function updateItemInTasklist(tasklistId, taskId, item) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("tasklist-db");

    const taskCollection = db.collection("tasks");

    const query = {"_id": ObjectId(taskId) };
    
    const update = {$set: {isChecked: item.isChecked}};

    await taskCollection.findOneAndUpdate(query, update);
    
    const tasks = await taskCollection.find({
        tasklistId
    });

    client.close();
   
    return {
        _id: tasklistId,
        tasks: tasks.toArray()

    };
}   


module.exports = {
    addNewTasklist,
    getTasklistById,
    addItemToTasklist,
    updateItemInTasklist
}
