// ==========================================
// SMART TO-DO LIST
// ==========================================

// ===============================
// HTML ELEMENTS
// ===============================

const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTask");

const taskList = document.getElementById("taskList");

const searchTask = document.getElementById("searchTask");
const filterTask = document.getElementById("filterTask");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const themeBtn = document.getElementById("themeBtn");


// ===============================
// GLOBAL VARIABLES
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editIndex = null;

let currentTheme =
    localStorage.getItem("theme") || "light";


// ===============================
// INITIALIZE APP
// ===============================

window.onload = function () {

    applyTheme();

    renderTasks();

};


// ===============================
// EVENT LISTENERS
// ===============================

addTaskBtn.addEventListener("click", addTask);

searchTask.addEventListener("input", searchTasks);

filterTask.addEventListener("change", filterTasks);

themeBtn.addEventListener("click", toggleTheme);


// Add task using Enter key

taskInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        addTask();

    }

});


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}


// ===============================
// APPLY THEME
// ===============================

function applyTheme() {

    if (currentTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML = "☀";

    }

    else {

        document.body.classList.remove("dark");

        themeBtn.innerHTML = "🌙";

    }

}


// ===============================
// TOGGLE THEME
// ===============================

function toggleTheme() {

    if (currentTheme === "light") {

        currentTheme = "dark";

    }

    else {

        currentTheme = "light";

    }

    localStorage.setItem(

        "theme",

        currentTheme

    );

    applyTheme();

}

// ===============================
// ADD TASK
// ===============================

function addTask() {

    const taskName = taskInput.value.trim();

    if (taskName === "") {

        alert("Please enter a task.");

        return;

    }

    const task = {

        name: taskName,

        date: dueDate.value,

        priority: priority.value,

        completed: false

    };

    // =====================
    // UPDATE TASK
    // =====================

    if (editIndex !== null) {

        task.completed = tasks[editIndex].completed;

        tasks[editIndex] = task;

        editIndex = null;

        addTaskBtn.innerHTML = "➕ Add Task";

    }

    // =====================
    // NEW TASK
    // =====================

    else {

        tasks.push(task);

    }

    saveTasks();

    renderTasks();

    clearInputs();

}


// ===============================
// CLEAR INPUTS
// ===============================

function clearInputs() {

    taskInput.value = "";

    dueDate.value = "";

    priority.value = "High";

}


// ===============================
// RENDER TASKS
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        createTaskCard(task, index);

    });

    updateProgress();

    checkOverdueTasks();

}


// ===============================
// CREATE TASK CARD
// ===============================

function createTaskCard(task, index) {

    const li = document.createElement("li");

    li.className = "task";

    if (task.completed) {

        li.classList.add("completed");

    }

    let priorityColor = "";

    switch (task.priority) {

        case "High":

            priorityColor = "red";

            break;

        case "Medium":

            priorityColor = "orange";

            break;

        case "Low":

            priorityColor = "green";

            break;

    }

    li.innerHTML = `

    <div class="task-info">

        <h3>${task.name}</h3>

        <p>📅 ${task.date || "No Due Date"}</p>

        <p style="color:${priorityColor};">

            ⭐ ${task.priority}

        </p>

    </div>

    <div class="buttons">

        <button class="complete-btn">

            ✔

        </button>

        <button class="edit-btn">

            ✏

        </button>

        <button class="delete-btn">

            🗑

        </button>

    </div>

    `;

    // Complete

    li.querySelector(".complete-btn")

        .addEventListener("click", function () {

            toggleComplete(index);

        });

    // Edit

    li.querySelector(".edit-btn")

        .addEventListener("click", function () {

            editTask(index);

        });

    // Delete

    li.querySelector(".delete-btn")

        .addEventListener("click", function () {

            deleteTask(index);

        });

    taskList.appendChild(li);

}

// ===============================
// DELETE TASK
// ===============================

function deleteTask(index) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {

        return;

    }

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();

}


// ===============================
// EDIT TASK
// ===============================

function editTask(index) {

    taskInput.value = tasks[index].name;

    dueDate.value = tasks[index].date;

    priority.value = tasks[index].priority;

    editIndex = index;

    addTaskBtn.innerHTML = "💾 Update Task";

    taskInput.focus();

}


// ===============================
// COMPLETE TASK
// ===============================

function toggleComplete(index) {

    tasks[index].completed = !tasks[index].completed;

    saveTasks();

    renderTasks();

}


// ===============================
// UPDATE PROGRESS BAR
// ===============================

function updateProgress() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(task => task.completed).length;

    let percentage = 0;

    if (totalTasks > 0) {

        percentage = Math.round(

            (completedTasks / totalTasks) * 100

        );

    }

    progress.style.width = percentage + "%";

    progressText.innerHTML =
        `${percentage}% Completed (${completedTasks}/${totalTasks})`;

}


// ===============================
// SEARCH TASKS
// ===============================

function searchTasks() {

    const keyword = searchTask.value.toLowerCase();

    const cards = document.querySelectorAll(".task");

    cards.forEach((card, index) => {

        const title = tasks[index].name.toLowerCase();

        if (title.includes(keyword)) {

            card.style.display = "flex";

        }

        else {

            card.style.display = "none";

        }

    });

}

// ===============================
// FILTER TASKS
// ===============================

function filterTasks() {

    const value = filterTask.value;

    const cards = document.querySelectorAll(".task");

    cards.forEach((card, index) => {

        const task = tasks[index];

        let show = true;

        switch (value) {

            case "completed":
                show = task.completed;
                break;

            case "pending":
                show = !task.completed;
                break;

            case "high":
                show = task.priority === "High";
                break;

            case "medium":
                show = task.priority === "Medium";
                break;

            case "low":
                show = task.priority === "Low";
                break;

            default:
                show = true;
        }

        card.style.display = show ? "flex" : "none";

    });

}


// ===============================
// CHECK OVERDUE TASKS
// ===============================

function checkOverdueTasks() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const cards = document.querySelectorAll(".task");

    cards.forEach((card, index) => {

        const task = tasks[index];

        if (!task.date || task.completed) return;

        const due = new Date(task.date);

        due.setHours(0, 0, 0, 0);

        if (due < today) {

            card.style.borderLeft = "6px solid red";

        }

    });

}


// ===============================
// RENDER FUNCTION
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        createTaskCard(task, index);

    });

    updateProgress();

    checkOverdueTasks();

}


// ===============================
// SORT TASKS
// ===============================

function sortTasks() {

    tasks.sort((a, b) => {

        const order = {

            High: 1,

            Medium: 2,

            Low: 3

        };

        return order[a.priority] - order[b.priority];

    });

    saveTasks();

    renderTasks();

}


// ===============================
// OPTIONAL AUTO SORT
// ===============================

sortTasks();


// ===============================
// END OF FILE
// ===============================