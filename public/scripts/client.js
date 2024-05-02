/**
 * Get header.html
 */
document.addEventListener("DOMContentLoaded", function () {
    fetch("/get-header")
        .then(response => response.text())
        .then(html => {
            document.getElementById("headerContainer").innerHTML = html;
        })
        .catch(error => console.error("Error loading the header:", error));

    fetch("/get-navbar")
        .then(response => response.text())
        .then(html => {
            document.getElementById("navbarContainer").innerHTML = html;
        })
        .catch(error => console.error("Error loading the navbar:", error));

    fetch("/get-footer")
        .then(response => response.text())
        .then(html => {
            document.getElementById("footerContainer").innerHTML = html;
        })
        .catch(error => console.error("Error loading the footer:", error));

    // Get the available language list.
    fetch("/languages")
        .then(response => response.json())
        .then(languages => {
            const select = document.getElementById("header-btns-language");
            languages.forEach(lang => {
                const option = new Option(lang.name, lang.code);
                select.add(option);
            });
        })
        .catch(error => console.error("Error loading languages:", error));

    changeLanguage(currentLanguage);
});

/**
 * Current language
 * @type {string}
 */
let currentLanguage = "en-UK";

/**
 * Change language
 * @param language {string} The language code to change to
 */
function changeLanguage(language) {
    currentLanguage = language;
    fetch(`/languages/${language}`)
        .then(response => response.json())
        .then(data => {
            // Use content from Strings{}
            let strings = data.Strings;
            document.querySelectorAll('[id^="text-"]').forEach(element => {
                // Get key
                let key = element.id;
                if (strings[key]) {
                    element.textContent = strings[key];
                } else {
                    console.error(`Key not found: ${key}`);
                }
            });
        })
        .catch(error => console.error("Error loading the language file:", error));
}

/**
 * Change language on change.
 */
document.addEventListener("change", Event => {
    if (Event.target.id === "header-btns-language") {
        currentLanguage = Event.target.value;
        changeLanguage(currentLanguage);
    }
});

