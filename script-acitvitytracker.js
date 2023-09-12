// Initialize an empty array to store activities
let activities = [];

// Function to add a new activity
function addActivity() {
    const date = document.getElementById("date").value;
    const hours = parseFloat(document.getElementById("hours").value);
    const activity = document.getElementById("activity").value;
    const name = document.getElementById("name").value;

    if (date && hours && activity && name) {
        activities.push({ date, hours, activity, name });
        updateActivityList();
        calculateHoursPerName();
        saveActivitiesToCSV();
        // Clear input fields
        document.getElementById("date").value = "";
        document.getElementById("hours").value = "";
        document.getElementById("activity").value = "";
        document.getElementById("name").value = "";
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to update the activity list
function updateActivityList() {
    const activitiesList = document.getElementById("activities");
    activitiesList.innerHTML = "";
    const filterName = document.getElementById("filter-name").value.toLowerCase();

    activities.forEach((activity, index) => {
        if (!filterName || activity.name.toLowerCase().includes(filterName)) {
            const li = document.createElement("li");
            li.textContent = `${activity.date} - ${activity.hours} hours - ${activity.activity} - ${activity.name}`;
            activitiesList.appendChild(li);
        }
    });
}

// Function to calculate hours per name
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
        li.textContent = `${name}: ${hoursPerName[name]} hours`;
        hoursPerNameList.appendChild(li);
    }
}

// Function to save activities to CSV
function saveActivitiesToCSV() {
    const csvContent = "Date,Hours,Activity,Name\n" + activities.map(activity => `${activity.date},${activity.hours},${activity.activity},${activity.name}`).join("\n");

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Use the FileSaver.js library to save the Blob as a file
    saveAs(blob, 'activities.csv');
}
// Function to load activities from a local CSV file
function loadActivitiesFromCSV() {
    fetch('activities.csv')
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n');
            activities = [];

            for (let i = 1; i < rows.length; i++) {
                const columns = rows[i].split(',');
                activities.push({
                    date: columns[0],
                    hours: parseFloat(columns[1]),
                    activity: columns[2],
                    name: columns[3]
                });
            }

            updateActivityList();
            calculateHoursPerName();
        })
        .catch(error => {
            console.error('Error loading activities:', error);
        });
}

// Add event listener to load data when the application starts
window.addEventListener('load', loadActivitiesFromCSV);

// Add event listeners
document.getElementById("add-activity").addEventListener("click", addActivity);
document.getElementById("filter-name").addEventListener("input", updateActivityList);

// Initial load
updateActivityList();
calculateHoursPerName();
