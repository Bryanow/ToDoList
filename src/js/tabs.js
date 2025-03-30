document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    let currentDay = "segunda"; // Set default tab

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            currentDay = button.dataset.day;
            // Setting the mthod to keep the list of the active tab
            document.querySelectorAll(".task-list").forEach(list => list.classList.remove("active"));
            document.querySelector(`.task-list[data-day="${currentDay}"]`).classList.add("active");

            // Call renderTasks to the correct day
            renderTasks(currentDay);
        });
    });

    // Active first tab by default
    document.querySelector(".tab-button.active")?.click();
});
