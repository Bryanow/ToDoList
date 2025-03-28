document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    const taskTime = document.getElementById("taskTime");
    const progressBar = document.getElementById("progressBar");
    const tabButtons = document.querySelectorAll(".tab-button");

    let currentDay = "segunda"; // Padrão para a primeira aba ativa

    // Trocar de aba e atualizar a lista de tarefas correspondente
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentDay = button.getAttribute("data-day");
            document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderTasks(); // Atualiza a lista quando troca de aba
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

    function renderTasks() {
        const taskList = document.querySelector(`.task-list[data-day="${currentDay}"]`);
        taskList.innerHTML = ""; // Limpa a lista antes de adicionar as novas tarefas

        const tasks = getTasksForDay();
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
    
        // Adiciona o valor numérico dentro da barra
        let progressText = document.querySelector(".progress-text");
        if (!progressText) {
            progressText = document.createElement("div");
            progressText.classList.add("progress-text");
            progressBar.appendChild(progressText);
        }
        progressText.innerHTML = `${Math.round(progress)}% ${getProgressEmoji(progress)}`;
    
        // Se progresso for 100%, ativa a animação especial
        if (progress === 100) {
            progressBar.classList.add("full-progress");
        } else {
            progressBar.classList.remove("full-progress");
        }
    }
    
    // Função que retorna um emoji baseado no progresso
    function getProgressEmoji(progress) {
        const emojiLevels = ["😴", "😐", "🙂", "😃", "😁", "🤩", "🔥", "🚀", "🏆", "🎉", "🎯"];
        return emojiLevels[Math.floor(progress / 10)];
    }

    function getTasksForDay() {
        return JSON.parse(localStorage.getItem(`tasks_${currentDay}`)) || [];
    }

    function saveTasksForDay(tasks) {
        localStorage.setItem(`tasks_${currentDay}`, JSON.stringify(tasks));
    }

    // Exibir as tarefas do primeiro dia ao carregar
    renderTasks();
});
