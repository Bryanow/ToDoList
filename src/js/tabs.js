document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    let currentDay = "segunda"; // Define a aba padrão

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            currentDay = button.dataset.day;
            // Aqui mantemos a lógica de exibir a lista da aba ativa
            document.querySelectorAll(".task-list").forEach(list => list.classList.remove("active"));
            document.querySelector(`.task-list[data-day="${currentDay}"]`).classList.add("active");

            // Chama renderTasks para o dia correto
            renderTasks(currentDay);
        });
    });

    // Ativar a primeira aba por padrão
    document.querySelector(".tab-button.active")?.click();
});
