document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    const taskTime = document.getElementById("taskTime");
    const progressBar = document.getElementById("progressBar");
    const tabButtons = document.querySelectorAll(".tab-button");
    let selectedDate = new Date().toISOString().split("T")[0];
    const datePicker = document.getElementById("datePicker");
    document.getElementById("theme-toggle").addEventListener("click", () => {
        document.querySelector(".theme-menu").classList.toggle("hidden");
    });

    document.querySelectorAll(".theme-option").forEach(button => {
        button.addEventListener("click", () => {
            document.body.className = ""; // limpa qualquer tema anterior
            document.body.classList.add(`theme-${button.dataset.theme}`);
            document.querySelector(".theme-menu").classList.add("hidden");
        });
    });


    datePicker.value = selectedDate;
    datePicker.min = selectedDate;

    datePicker.addEventListener("change", (e) => {
        selectedDate = e.target.value;
        renderTasks(); // reexibe as tarefas do dia da semana atual para a nova data
        tabButtons.forEach(button => button.classList.remove("disabled"));
    });

    let currentDay = "segunda"; // Aba padrão

    // Alternar abas
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            currentDay = button.dataset.day;

            // Ativa a lista correspondente
            document.querySelectorAll(".task-list").forEach(list => list.classList.remove("active"));
            document.querySelector(`.task-list[data-day="${currentDay}"]`).classList.add("active");

            renderTasks();
        });
    });
    tabButtons.forEach(button => button.classList.add("disabled"));


    // Clique no botão ou Enter
    addTaskBtn.addEventListener("click", () => addTask());
    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") addTask();
    });
    taskTime.addEventListener("keydown", (event) => {
        if (event.key === "Enter") addTask();
    });

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

    function renderTasks() {
        const tabButtons = document.querySelectorAll(".tab-button");
        tabButtons.forEach(button => {
        if (!selectedDate) {
            button.classList.add("disabled");
        } else {
            button.classList.remove("disabled");
        }
        });

        const taskList = document.querySelector(`.task-list[data-day="${currentDay}"]`);
        taskList.innerHTML = "";

        const tasks = getTasksForDay();
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("task-item");
            if (task.completed) li.classList.add("completed");

            li.innerHTML = `
                <input type="time" class="task-time-input" value="${task.time || ''}" data-index="${index}" />
                <input type="text" class="task-text-input" value="${task.text}" data-index="${index}" />
                <div class="task-buttons">
                    <button class="complete-btn" data-index="${index}" style="background: ${task.completed ? 'gray' : 'green'};">
                        ${task.completed 
                            ? '<span><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>Back</title><path d="M352,170.667H94.17l70.249-70.248a21.334,21.334,0,1,0-30.171-30.171L27.581,176.915a21.336,21.336,0,0,0,0,30.171L134.248,313.752a21.334,21.334,0,1,0,30.171-30.171L94.17,213.333H352a96,96,0,0,1,0,192H128A21.333,21.333,0,1,0,128,448H352c76.461,0,138.667-62.205,138.667-138.667S428.461,170.667,352,170.667Z"></path></svg></span>'
                            : '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7" stroke="white" stroke-width="2" fill="none"/></svg>'}
                    </button>
                    <button class="delete-btn" data-index="${index}">
                        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="white" stroke-width="2" fill="none"/></svg>
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

        document.querySelectorAll(".task-time-input").forEach(input => {
            input.addEventListener("change", (e) => {
                const index = e.target.getAttribute("data-index");
                updateTask(index, "time", e.target.value, true);
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") e.target.blur();
            });
        });

        document.querySelectorAll(".task-text-input").forEach(input => {
            input.addEventListener("blur", (e) => {
                const index = e.target.getAttribute("data-index");
                updateTask(index, "text", e.target.value);
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") e.target.blur();
            });
        });
    }

    function updateTask(index, field, value, reorder = false) {
        const tasks = getTasksForDay();
        tasks[index][field] = value;
        saveTasksForDay(tasks);
        renderTasks();
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
        const key = `tasks_${selectedDate}_${currentDay}`;
        const tasks = JSON.parse(localStorage.getItem(key)) || [];
        return tasks.sort((a, b) => (a.time || "23:59").localeCompare(b.time || "23:59"));
    }


    function saveTasksForDay(tasks) {
        const key = `tasks_${selectedDate}_${currentDay}`;
        localStorage.setItem(key, JSON.stringify(tasks));
    }

    // Inicializar: clique na aba padrão
    document.querySelector(".tab-button.active")?.click();
});
