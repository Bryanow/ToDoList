document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    const taskTime = document.getElementById("taskTime");
    const progressBar = document.getElementById("progressBar");
    let currentDay = "segunda"; // Padrão para a primeira aba ativa

    addTaskBtn.addEventListener("click", () => addTask());

    function addTask() {
        const taskText = taskInput.value.trim();
        const timeValue = taskTime.value;
        if (taskText === "") return;

        const taskList = getTaskListElement();
        const taskData = { text: taskText, time: timeValue, completed: false };
        
        const tasks = getTasksForDay();
        tasks.push(taskData);
        saveTasksForDay(tasks);

        renderTasks(currentDay); // Passando o currentDay para renderizar corretamente
        taskInput.value = "";
        taskTime.value = "";
    }

    function renderTasks(currentDay) {
        const taskList = document.querySelector(`.task-list[data-day="${currentDay}"]`);
        taskList.innerHTML = ""; // Limpa a lista antes de adicionar as novas tarefas

        const tasks = getTasksForDay(currentDay);
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("task-item");
            if (task.completed) li.classList.add("completed");

            li.innerHTML = `
                <span class="task-text">${task.time ? `[${task.time}] ` : ""}${task.text}</span>
                <div class="task-buttons">
                    <button class="complete-btn" data-index="${index}">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M5 12l5 5L19 7" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
                        </svg>
                    </button>
                    <button class="delete-btn" data-index="${index}">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M6 6l12 12M6 18L18 6" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
                        </svg>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });

        addEventListenersToButtons();
        updateProgress(currentDay);
    }

    function addEventListenersToButtons() {
        document.querySelectorAll(".complete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-index");
                toggleCompleteTask(index);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-index");
                deleteTask(index);
            });
        });
    }

    function toggleCompleteTask(index) {
        const tasks = getTasksForDay(currentDay);
        tasks[index].completed = !tasks[index].completed;
        saveTasksForDay(tasks);
        renderTasks(currentDay);
    }

    function deleteTask(index) {
        const tasks = getTasksForDay(currentDay);
        tasks.splice(index, 1);
        saveTasksForDay(tasks);
        renderTasks(currentDay);
    }

    function updateProgress(currentDay) {
        const tasks = getTasksForDay(currentDay);
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function getTaskListElement() {
        return document.querySelector(`.task-list[data-day="${currentDay}"]`);
    }

    function getTasksForDay() {
        return JSON.parse(localStorage.getItem(`tasks_${currentDay}`)) || [];
    }

    function saveTasksForDay(tasks) {
        localStorage.setItem(`tasks_${currentDay}`, JSON.stringify(tasks));
    }

    renderTasks(currentDay);
});
