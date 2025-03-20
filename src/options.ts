import './styles/styles.css';

document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.getElementById("language") as HTMLSelectElement;
    const saveButton = document.getElementById("save") as HTMLButtonElement;

    if (!languageSelect || !saveButton) return; // Ensure elements exist

    // Load saved settings
    chrome.storage.sync.get(["language"], (data) => {
        if (data.language) {
            languageSelect.value = data.language;
        }
    });

    // Save settings
    saveButton.addEventListener("click", () => {
        const language = languageSelect.value;
        chrome.storage.sync.set({ language }, () => {
            alert("Settings saved!");
        });
    });
});
