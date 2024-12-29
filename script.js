let lockers = [
    { id: 1, location: "Metro Station A", distance: 1.2, available: true, items: ["Bluetooth Headphones", "Powerbank", "Wi-Fi Hotspot"] },
    { id: 2, location: "Bus Stop B", distance: 0.8, available: true, items: ["Wired Headphones", "Powerbank"] },
    { id: 3, location: "Metro Station C", distance: 2.3, available: true, items: ["Wi-Fi Hotspot", "Powerbank"] }
];
let rented = false; // Track if the user has already rented an item
let users = []; // Simulating a simple in-memory database

// Navigate to Signup page
function showSignup() {
    window.location.href = 'signup.html';
}

// Navigate to Login page
function showLogin() {
    window.location.href = 'login.html';
}

// Handle Signup Form Submission
document.getElementById('create-account')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Add user to database
    users.push({
        username: username,
        email: email,
        password: password,
        bookings: []
    });

    alert('Account created successfully!');
    localStorage.setItem('currentUser', username); // Save current user session
    window.location.href = 'index.html'; // Redirect to index.html
});

// Handle Login Form Submission
document.getElementById('login-account')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;

    // Find user in database
    const user = users.find(u => (u.username === loginUsername || u.email === loginUsername) && u.password === loginPassword);

    if (user) {
        alert('Login successful!');
        localStorage.setItem('currentUser', user.username); // Save current user session
        window.location.href = 'index.html'; // Redirect to index.html
    } else {
        alert('Invalid username or password.');
    }
});

// Get User Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Show User's Location
function showPosition(position) {
    const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    console.log(`Your Location: ${userLocation.latitude}, ${userLocation.longitude}`);
    displayLockers(lockers); // Display lockers after getting location
}

// Handle Geolocation Errors
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Display Available Lockers
function displayLockers(lockers) {
    const lockerList = document.getElementById('locker-list');
    if (!lockerList) return; // Ensure element exists before proceeding

    lockerList.innerHTML = ''; // Clear previous results

    if (lockers.length === 0) {
        lockerList.innerHTML = '<p>No available lockers found.</p>';
        return;
    }

    lockers.forEach(locker => {
        const lockerItem = document.createElement('div');
        lockerItem.className = 'locker-item';
        lockerItem.innerHTML = `
            <h3>${locker.location}</h3>
            <p>Distance: ${locker.distance} km</p>
            <p>Items: ${locker.items.join(', ')}</p>
            <button onclick="bookLocker(${locker.id})">Book Now</button>
        `;
        lockerList.appendChild(lockerItem);
    });
}

// Handle Locker Booking
function bookLocker(lockerId) {
    if (rented) {
        alert("You already have a device rented. Please return it before renting again.");
        return;
    }

    const locker = lockers.find(l => l.id === lockerId);
    if (locker && locker.available) {
        rented = true; // Mark as rented
        locker.available = false; // Update locker availability
        alert(`You have successfully booked a locker at ${locker.location}!`);

        // Save booking details
        localStorage.setItem('lockerLocation', locker.location);
        localStorage.setItem('rentedItems', locker.items.join(', '));

        // Redirect to payment page
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 1000);

        displayLockers(lockers.filter(l => l.available)); // Refresh locker list
    }
}
