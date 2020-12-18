window.checklistItems = ["Make lunch", "Put lunch in bag", "Bring bag to work"];

function appendChecklistItemHTML(itemText, checklist) {
  let checkboxElement = document.createElement("input");
  checkboxElement.setAttribute("type", "checkbox");
  let labelElement = document.createElement("label");
  labelElement.innerHTML= itemText;
  let breakElement = document.createElement("br");
  checklist.appendChild(checkboxElement);
  checklist.appendChild(labelElement);
  checklist.appendChild(breakElement);
}


function repopulate(){
	let checklist = document.getElementById("checklist");
  checklist.innerHTML = "<legend>My Tasks</legend>";
  for(let i=0; i<checklistItems.length; i++) {
  	appendChecklistItemHTML(checklistItems[i], checklist);
  }
}

function addItem(itemText) {

}