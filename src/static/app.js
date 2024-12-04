// Function to open the popup and toggle its position on the screen
function openPopup() {
    const popup = document.getElementById('popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'block'; // Show the popup
    }
}

// Function to close the popup
function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.removeEventListener('mousemove', movePopup); // Remove move listener when closed
    document.removeEventListener('mouseup', stopDragging); // Remove stop dragging listener
}

// Function to start dragging the popup when the close button is clicked
function startDragging(event) {
    const popup = document.getElementById('popup');
    popup.style.position = 'absolute'; // Ensure it's positioned absolutely while dragging
    popup.style.zIndex = '1001'; // Bring it to the front
    popup.offsetX = event.clientX - popup.getBoundingClientRect().left; // Store the offset when drag starts
    popup.offsetY = event.clientY - popup.getBoundingClientRect().top;
    
    // Add event listeners to move and stop dragging
    document.addEventListener('mousemove', movePopup);
    document.addEventListener('mouseup', stopDragging);
}

// Function to move the popup around when dragging
function movePopup(event) {
    const popup = document.getElementById('popup');
    popup.style.left = (event.clientX - popup.offsetX) + 'px';
    popup.style.top = (event.clientY - popup.offsetY) + 'px';
}

// Function to stop dragging when mouse is released
function stopDragging() {
    document.removeEventListener('mousemove', movePopup);
    document.removeEventListener('mouseup', stopDragging);
}

// Attach the drag functionality to the close button
const closeButton = document.querySelector('.popup .close-button'); // The close button inside the popup
closeButton.addEventListener('mousedown', startDragging); // Start dragging when the close button is clicked

// Function to add an exercise
async function addExercise() {
    const input = document.getElementById("exerciseInput");
    const exercise = input.value.trim();

    if (exercise) {
        // Send an AJAX POST request to add the exercise
        const response = await fetch("/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exercise: exercise })
        });

        const data = await response.json();
        if (data.status === "success") {
            // Add the new exercise to the list
            const list = document.getElementById("exerciseList");
            const li = document.createElement("li");
            li.id = `exercise-${data.index}`;  // Adding a unique ID to the exercise item
            li.innerHTML = `
                ${data.exercise} 
                <button onclick="deleteExercise(${data.index})">Delete</button>
                <div class="timer-controls">
                    <button class="minus" onclick="adjustTimer(${data.index}, -10)">-</button>
                    <span id="timer-${data.index}">0</span> sec
                    <button class="plus" onclick="adjustTimer(${data.index}, 10)">+</button>
                    <button id="pause-btn-${data.index}" onclick="toggleTimer(${data.index})">Pause</button>
                </div>
            `;
            list.appendChild(li);
            input.value = ""; // Clear the input field
        } else {
            alert(data.message);
        }
    } else {
        alert("Exercise cannot be empty!");
    }
}

// Function to delete an exercise
async function deleteExercise(index) {
    const response = await fetch(`/delete/${index}`, {
        method: "DELETE",
    });

    const data = await response.json();
    if (data.status === "success") {
        // Remove the exercise from the list
        const exerciseList = document.getElementById("exerciseList");
        const exerciseItem = document.getElementById(`exercise-${index}`); // Use unique ID for deletion
        exerciseList.removeChild(exerciseItem);
    } else {
        alert(data.message);
    }
}

// Function to adjust the timer for each exercise
function adjustTimer(index, change) {
    const timerElement = document.getElementById(`timer-${index}`);
    let currentTime = parseInt(timerElement.innerText, 10);
    currentTime += change;

    // Ensure time doesn't go negative
    if (currentTime < 0) currentTime = 0;

    timerElement.innerText = currentTime; // Update the timer display
}

// Function to toggle the timer (Pause/Continue) for each exercise
let timers = {}; // Object to hold active timer intervals for each exercise

function toggleTimer(index) {
    const timerElement = document.getElementById(`timer-${index}`);
    const pauseButton = document.getElementById(`pause-btn-${index}`);

    if (timers[index]) {
        // Timer is active, pause it
        clearInterval(timers[index]);
        timers[index] = null;
        pauseButton.innerText = "Continue";
    } else {
        // Timer is paused, continue it
        timers[index] = setInterval(() => {
            let currentTime = parseInt(timerElement.innerText, 10);
            if (currentTime > 0) {
                currentTime--;  // Decrement the timer for countdown
                timerElement.innerText = currentTime; // Update the timer display
            } else {
                clearInterval(timers[index]);
                timers[index] = null;
                pauseButton.innerText = "Continue"; // Reset button when timer reaches 0
            }
        }, 1000);
        pauseButton.innerText = "Pause";
    }
}

// This function will be triggered when the "Interact" button is clicked
document.querySelector('.interact-btn').addEventListener('click', function() {
    // Display the "Your List" button when Interact is clicked
    document.getElementById('yourListButton').style.display = 'block'; // Show "Your List" button
});

// This function will be triggered when the "Your List" button is clicked
document.getElementById('yourListButton').addEventListener('click', openPopup);

// Initially hide the "Your List" button
document.getElementById('yourListButton').style.display = 'none';
