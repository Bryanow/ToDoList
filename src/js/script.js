document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    const taskTime = document.getElementById("taskTime");
    const progressBar = document.getElementById("progressBar");
    const tabButtons = document.querySelectorAll(".tab-button");

    let currentDay = "segunda"; // Default para o primeiro dia ativo

    // Alternar abas e atualizar a lista correspondente
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentDay = button.getAttribute("data-day");
            document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderTasks(); // Atualiza a lista ao alternar entre as abas
        });
    });

    addTaskBtn.addEventListener("click", () => addTask());

    function addTask() {
        const taskText = taskInput.value.trim();
        const timeValue = taskTime.value;
        if (taskText === "") return;

        const tasks = getTasksForDay();
        tasks.push({ text: taskText, time: timeValue, completed: false });
        saveTasksForDay(tasks);

        renderTasks();
        taskInput.value = "";
        taskTime.value = "";
    }

    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });

    taskTime.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });

    function renderTasks() {
        const taskList = document.querySelector(`.task-list[data-day="${currentDay}"]`);
        taskList.innerHTML = "";

        const tasks = getTasksForDay();
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("task-item");
            if (task.completed) li.classList.add("completed");

            li.innerHTML = `
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=select_check_box" />
                <input type="time" class="task-time-input" value="${task.time || ''}" data-index="${index}" />
                <input type="text" class="task-text-input" value="${task.text}" data-index="${index}" />
                <div class="task-buttons">
                    <button class="complete-btn" data-index="${index}" style="background: ${task.completed ? 'gray' : 'green'};">
                        ${task.completed 
                            ? '<span class="material-symbols-outlined">select_check_box</span>'
                            : '<svg width="20" height="20" viewBox="0 0 24 24"> <path d="M5 12l5 5L19 7" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/> </svg>'}
                    </button>
                    <button class="delete-btn" data-index="${index}">
                        <svg width="20" height="20" viewBox="0 0 24 24"> <path d="M6 6l12 12M6 18L18 6" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/> </svg>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });

        addEventListenersToButtons();
        updateProgress();
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

        // Evento para editar o horário da tarefa
        document.querySelectorAll(".task-time-input").forEach(input => {
            input.addEventListener("change", (e) => {
                const index = e.target.getAttribute("data-index");
                updateTask(index, "time", e.target.value, true); // Reorganizar ao editar o horário
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.target.blur(); // Simula perda de foco para salvar
                }
            });
        });

        // Evento para editar o nome da tarefa
        document.querySelectorAll(".task-text-input").forEach(input => {
            input.addEventListener("blur", (e) => {
                const index = e.target.getAttribute("data-index");
                updateTask(index, "text", e.target.value);
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.target.blur(); // Simula perda de foco para salvar
                }
            });
        });
    }

    function updateTask(index, field, value, reorder = false) {
        const tasks = getTasksForDay();
        tasks[index][field] = value;
        saveTasksForDay(tasks);

        if (reorder) {
            renderTasks(); // Reorganiza a lista caso o horário seja alterado
        } else {
            renderTasks();
        }
    }

    function toggleCompleteTask(index) {
        const tasks = getTasksForDay();
        tasks[index].completed = !tasks[index].completed;
        saveTasksForDay(tasks);
        renderTasks();
    }

    function deleteTask(index) {
        const tasks = getTasksForDay();
        tasks.splice(index, 1);
        saveTasksForDay(tasks);
        renderTasks();
    }

    function updateProgress() {
        const tasks = getTasksForDay();
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;

        progressBar.style.width = `${progress}%`;

        let progressText = document.querySelector(".progress-text");
        if (!progressText) {
            progressText = document.createElement("div");
            progressText.classList.add("progress-text");
            progressBar.appendChild(progressText);
        }
        progressText.innerHTML = `${Math.round(progress)}% ${getProgressEmoji(progress)}`;

        if (progress === 100) {
            progressBar.classList.add("full-progress");
        } else {
            progressBar.classList.remove("full-progress");
        }
    }

    function getProgressEmoji(progress) {
        const emojiLevels = ["😴", "😐", "🙂", "😃", "😁", "🤩", "🔥", "🚀", "🏆", "🎉", "🎯"];
        return emojiLevels[Math.floor(progress / 10)];
    }

    function getTasksForDay() {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentDay}`)) || [];
        return tasks.sort((a, b) => (a.time || "23:59").localeCompare(b.time || "23:59"));
    }

    function saveTasksForDay(tasks) {
        localStorage.setItem(`tasks_${currentDay}`, JSON.stringify(tasks));
    }

    renderTasks();
});
