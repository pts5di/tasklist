const SERVER_URL = "http://52.250.52.230:3000";

function initialize() {
  var queryParams = new URLSearchParams(window.location.search);
  if (!queryParams.has("tasklistId")) {
    fetch(`${SERVER_URL}/create`, { method: "POST" }).then(response => response.json()).then(json => {
      let tasklistId = json._id;
      let url = new URL(window.location.href);
      let queryParams = new URLSearchParams(url.search);
      queryParams.append("tasklistId", tasklistId);
      url.search = queryParams;
      window.location.href = url;
    });
  } else {
    let tasklistId = queryParams.get("tasklistId");
    repopulate(fetch(`${SERVER_URL}/tasklist/${tasklistId}`, { method: "GET" }));
  }
}

function onCreateItemClicked(event) {
  let textEntry = document.getElementById("newItem");
  event.preventDefault();
  addItem(textEntry.value);
  textEntry.value = "";
}

function onItemCheckboxClicked(event) {
  let checkbox = event.target;
  let position = Number.parseInt(checkbox.id);
  let task = window.checklistItems[position];
  task.isChecked = checkbox.checked;
  repopulate(fetch(`${SERVER_URL}/tasklist/${window.tasklistId}/${task._id}`, {
    method: "POST", headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(task)
  }));
}

document.getElementById("submit").addEventListener("click", onCreateItemClicked);


function appendChecklistItemHTML(item, position, checklist) {
  let checkboxElement = document.createElement("input");
  checkboxElement.setAttribute("type", "checkbox");
  checkboxElement.id = position;
  checkboxElement.checked = item.isChecked;
  checkboxElement.addEventListener("click", onItemCheckboxClicked);
  let labelElement = document.createElement("label");
  labelElement.innerHTML = item.name;
  labelElement.htmlFor = position;
  let breakElement = document.createElement("br");
  checklist.appendChild(checkboxElement);
  checklist.appendChild(labelElement);
  checklist.appendChild(breakElement);
}


function repopulate(fetchPromise) {
  fetchPromise.then(response => response.json()).then(json => {
    window.tasklistId = json._id;
    window.checklistItems = json.tasks;
    let checklist = document.getElementById("checklist");
    checklist.innerHTML = "<legend>My Tasks</legend>";
    for (let i = 0; i < checklistItems.length; i++) {
      appendChecklistItemHTML(checklistItems[i], i, checklist);

    }
  })
}

function addItem(itemText) {
  repopulate(fetch(`${SERVER_URL}/tasklist/${window.tasklistId}/add`, { method: "POST" }));
}

initialize();