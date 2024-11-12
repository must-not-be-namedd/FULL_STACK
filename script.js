let lockers = [
    { id: 1, location: "Metro Station A", distance: 1.2, available: true, items: ["Bluetooth Headphones", "Powerbank", "Wi-Fi Hotspot"] },
    { id: 2, location: "Bus Stop B", distance: 0.8, available: true, items: ["Wired Headphones", "Powerbank"] },
    { id: 3, location: "Metro Station C", distance: 2.3, available: true, items: ["Wi-Fi Hotspot", "Powerbank"] }
];
let rented = false; // Track if the user has already rented an item

// Simulating a simple in-memory "database" for storing users and their data
let users = [];

// Show Signup form
function showSignup() {
    document.getElementById('visitor-check').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

// Show Login form
function showLogin() {
    document.getElementById('visitor-check').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}

// Handle account creation
document.getElementById('create-account').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Save user data
    users.push({
        username: username,
        password: password,
        bookings: [],
        location: "Unknown", // Default location
    });

    alert('Account created successfully! Proceeding to your account details...');
    
    // Redirect to locker booking page
    localStorage.setItem('currentUser', username);
    window.location.href = 'index.html';
});

// Handle login process
document.getElementById('login-account').addEventListener('submit', function(event) {
    event.preventDefault();
    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;

    // Check if user exists and password matches
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);

    if (user) {
        alert('Login successful! Redirecting to account details...');
        localStorage.setItem('currentUser', loginUsername);
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password.');
    }
});

// Function to get user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Show user's position
function showPosition(position) {
    const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    console.log(`Your Location: ${userLocation.latitude}, ${userLocation.longitude}`);
    displayLockers(lockers); // Display lockers based on location
}

// Handle errors in geolocation
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

// Display lockers based on location
function displayLockers(lockers) {
    const lockerList = document.getElementById('locker-list');
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

// Handle locker booking
function bookLocker(lockerId) {
    if (rented) {
        alert("You already have a device rented. Please return it before renting again.");
        return;
    }

    const locker = lockers.find(l => l.id === lockerId);
    if (locker && locker.available) {
        rented = true; // User has rented an item
        locker.available = false;
        alert(`You have successfully booked a locker at ${locker.location}!\n\nProceeding to payment...`);

        // Save the booking data to localStorage before redirecting
        localStorage.setItem('lockerLocation', locker.location);
        localStorage.setItem('rentedItems', locker.items.join(', '));

        // Redirect to payment page
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 1000);

        displayLockers(lockers.filter(l => l.available)); // Refresh the list of available lockers
    }
}
