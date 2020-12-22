const express = require('express')
const app = express()
const port = 3000

let taskArray = [
    [
        { "name": "foo", "isChecked": false },
        { "name": "foo2", "isChecked": true },
    ]
]
app.use(express.json());

app.post("/create", function (req, res) {
    const id = taskArray.length;
    taskArray.push([]);
    res.send({
        id,
        tasks: taskArray[id],
    });
});

app.get("/:tasklistId", function (req, res) {
    const id = Number.parseInt(req.params["tasklistId"]);
    if (Number.isNaN(id) || id > taskArray.length - 1 || id < 0) {
        res.status(400);
        return;
    }
    res.send({
        id,
        tasks: taskArray[id],
    });
});

app.post("/:tasklistId/add", function (req, res) {
    const id = Number.parseInt(req.params["tasklistId"])
    if (Number.isNaN(id) || id > taskArray.length - 1 || id < 0) {
        res.status(400);
        return;
    }
    if (!req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("isChecked")) {
        res.status(400);
        return;
    }
    taskArray[id].push({ name: req.body.name, isChecked: req.body.isChecked });
    res.send({
        id,
        tasks: taskArray[id],
    });
});

app.post("/:tasklistId/:taskId", function (req, res) {
    const id = Number.parseInt(req.params["tasklistId"])
    if (Number.isNaN(id) || id > taskArray.length - 1 || id < 0) {
        res.status(400);
        return;
    }
    if (!req.body.hasOwnProperty("name") || !req.body.hasOwnProperty("isChecked")) {
        res.status(400);
        return;
    }
    taskArray[id] = { name: req.body.name, isChecked: req.body.isChecked };
    res.send({
        id,
        tasks: taskArray[id],
    });
});