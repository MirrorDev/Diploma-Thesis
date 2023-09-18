import * as fs from "fs";

let activities = [];
let newList = [];

// Funktion, um eine neue Aktivität hinzuzufügen
function addActivity() {
    const date = document.getElementById("date").value;
    const hours = parseFloat(document.getElementById("hours").value);
    const activity = document.getElementById("activity").value;
    const name = document.getElementById("name").value;

    if (date && hours && activity && name) {
        activities.push({ date, hours, activity, name });
        newList.push({ date, hours, activity, name });
        updateActivityList();
        calculateHoursPerName();
        saveActivitiesToTXT();
        // Eingabefelder leeren
        document.getElementById("date").value = "";
        document.getElementById("hours").value = "";
        document.getElementById("activity").value = "";
        document.getElementById("name").value = "";
    } else {
        alert("Bitte füllen Sie alle Felder aus.");
    }
}

// Funktion zum Aktualisieren der Aktivitätenliste
function updateActivityList() {
    const activitiesList = document.getElementById("activities");
    activitiesList.innerHTML = "";
    const filterName = document.getElementById("filter-name").value.toLowerCase();

    activities.forEach((activity, index) => {
        if (!filterName || activity.name.toLowerCase().includes(filterName)) {
            const li = document.createElement("li");
            li.textContent = `${activity.date} - ${activity.hours} Stunden - ${activity.activity} - ${activity.name}`;
            activitiesList.appendChild(li);
        }
    });
}

// Funktion zum Berechnen der Stunden pro Name
function calculateHoursPerName() {
    const hoursPerName = {};

    activities.forEach((activity) => {
        if (hoursPerName[activity.name]) {
            hoursPerName[activity.name] += activity.hours;
        } else {
            hoursPerName[activity.name] = activity.hours;
        }
    });

    const hoursPerNameList = document.getElementById("hours-per-name");
    hoursPerNameList.innerHTML = "";

    for (const name in hoursPerName) {
        const li = document.createElement("li");
        li.textContent = `${name}: ${hoursPerName[name]} Stunden`;
        hoursPerNameList.appendChild(li);
    }
}

// Funktion zum Speichern von Aktivitäten in eine TXT-Datei
function saveActivitiesToTXT() {
    let data = "";

    newList.forEach((activity) => {
        data += `${activity.date}, ${activity.hours}, ${activity.activity}, ${activity.name}\n`;
    });

    fs.writeFile('activities.txt', data, (err) => {
        if (err) throw err;
        console.log('Aktivitäten in TXT-Datei gespeichert.');
    });
}

// Funktion zum Laden von Aktivitäten aus einer lokalen TXT-Datei
function loadActivitiesFromTXT() {
    fs.readFile('activities.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Laden der Aktivitäten:', err);
            return;
        }

        const lines = data.split('\n');
        activities = [];

        for (let i = 0; i < lines.length; i++) {
            const columns = lines[i].split(', ');
            if (columns.length === 4) {
                activities.push({
                    date: columns[0],
                    hours: parseFloat(columns[1]),
                    activity: columns[2],
                    name: columns[3]
                });
            }
        }

        updateActivityList();
        calculateHoursPerName();
    });
}

// Eventlistener zum Laden von Daten, wenn die Anwendung gestartet wird
window.addEventListener('load', loadActivitiesFromTXT);

// Eventlistener hinzufügen
document.getElementById("add-activity").addEventListener("click", addActivity);
document.getElementById("filter-name").addEventListener("input", updateActivityList);

// Initial laden
updateActivityList();
calculateHoursPerName();
