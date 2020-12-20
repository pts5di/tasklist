window.checklistItems = [
  {name:"Make lunch", isChecked:true}, 
  {name:"Put lunch in bag", isChecked:false}, 
  {name:"Bring lunch to work", isChecked:false}
];


function onCreateItemClicked(event){
  	let textEntry = document.getElementById("newItem");
  	event.preventDefault();
  	addItem(textEntry.value);
    textEntry.value = "";
}

function onItemCheckboxClicked(event){
    let checkbox = event.target;
    let position = Number.parseInt(checkbox.id);
    checklistItems[position].isChecked = checkbox.checked;
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


function repopulate(){
	let checklist = document.getElementById("checklist");
  checklist.innerHTML = "<legend>My Tasks</legend>";
  for(let i=0; i<checklistItems.length; i++) {
  	appendChecklistItemHTML(checklistItems[i], i, checklist);
  }
}

function addItem(itemText) {
	checklistItems.push({name:itemText, isChecked:false});
  repopulate();
}
repopulate();
