const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const itemLists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  listArrays.forEach((item, index) => {
    localStorage.setItem(`${arrayNames[index]}Items`, JSON.stringify(item));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");

  listEl.classList.add("drag-item");
  listEl.textContent = item;

  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = "true";

  // listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${column}, ${index})`);

  columnEl.appendChild(listEl);
}

function updateItem(column, index) {
  if (!dragging) {
    const newItem = itemLists[column].children[index].textContent;

    // Handle delete
    if (!newItem) {
      listArrays[column].splice(index, 1);
      updateDOM();
    }

    // Handle update
    if (newItem) {
      listArrays[column].splice(index, 1);
      listArrays[column].splice(index, 1, newItem);
      updateDOM();
    }
  }
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.innerHTML = "";
  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index);
  });

  // Progress Column
  progressList.innerHTML = "";
  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 1, item, index);
  });

  // Complete Column
  completeList.innerHTML = "";
  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 2, item, index);
  });

  // On Hold Column
  onHoldList.innerHTML = "";
  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 3, item, index);
  });

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

function rebuildArrays() {
  backlogListArray = [...backlogList.children].map((item) => item.textContent);
  progressListArray = [...progressList.children].map(
    (item) => item.textContent
  );
  completeListArray = [...completeList.children].map(
    (item) => item.textContent
  );
  onHoldListArray = [...onHoldList.children].map((item) => item.textContent);

  updateSavedColumns();
}

function drag(event) {
  draggedItem = event.target;
  dragging = true;
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  event.target.closest(".drag-item-list").appendChild(draggedItem);

  dragging = false;

  rebuildArrays();
  // updateDOM();
}

function dragEnter(event) {
  itemLists.forEach((item) => {
    item.classList.remove("over");
  });
}

itemLists.forEach((item) => {
  item.setAttribute("ondragover", "allowDrop(event)");
  item.setAttribute("ondrop", "drop(event)");
  item.setAttribute("ondragenter", "dragEnter(event)");
});

// Handle Add new item
function test() {
  console.log(backlogListArray);
}

function addToColumn(column) {
  const newItem = addItems[column].textContent;

  if (!newItem) return;

  listArrays[column].push(newItem);
  addItems[column].textContent = "";
  updateDOM();
}

addBtns.forEach((item, index) => {
  item.addEventListener("click", function () {
    item.style.visibility = "hidden";
    saveItemBtns[index].style.display = "flex";
    addItemContainers[index].style.display = "flex";
  });
});

saveItemBtns.forEach((item, index) => {
  item.addEventListener("click", function () {
    addBtns[index].style.visibility = "visible";
    item.style.display = "none";
    addItemContainers[index].style.display = "none";

    addToColumn(index);
  });
});

// Init
updateDOM();
