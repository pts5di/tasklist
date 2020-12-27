const express = require('express');
const app = express();
const port = 3000;
const dbFunctions = require("./connect");

let taskArray = [
    [
        { "name": "foo", "isChecked": false },
        { "name": "foo2", "isChecked": true },
    ]
]
app.use(require("cors")());
app.use(express.json());

app.post("/create", async function (req, res) {
    const tasklist = await dbFunctions.addNewTasklist();
    res.send(tasklist);
});

app.get("/tasklist/:tasklistId", async function (req, res) {
    const tasklist = await dbFunctions.getTasklistById(req.params["tasklistId"]);
    res.send(tasklist);
});

app.post("/tasklist/:tasklistId/add", async function (req, res) {
    const tasklist = req.params["tasklistId"]
    
    if (!req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("isChecked")) {
        res.status(400);
        return;
    }

    const updatedTasklist = await dbFunctions.addItemToTasklist(tasklist, req.body);
    res.send(updatedTasklist);
});

app.post("/tasklist/:tasklistId/:taskId", async function (req, res) {
    if (!req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("isChecked")) {
        res.status(400);
        return;
    }
    
    const updatedTask = await dbFunctions.updateItemInTasklist(req.params["tasklistId"], req.params["taskId"], req.body);
    res.send(updatedTask);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});