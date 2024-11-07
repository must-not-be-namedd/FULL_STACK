let lockers = [
    { id: 1, location: "Metro Station A", distance: 1.2, available: true, items: ["Bluetooth Headphones", "Powerbank", "Wi-Fi Hotspot"] },
    { id: 2, location: "Bus Stop B", distance: 0.8, available: true, items: ["Wired Headphones", "Powerbank"] },
    { id: 3, location: "Metro Station C", distance: 2.3, available: true, items: ["Wi-Fi Hotspot", "Powerbank"] }
];
let rented = false; // Track if the user has already rented an item

// Simulating a simple in-memory "database" for storing users and their data
let users = [];

function showSignup() {
    document.getElementById('visitor-check').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

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

    // Redirect to account details page
    localStorage.setItem('currentUser', username);
    window.location.href = 'account-details.html';
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

        // Store the username in localStorage and redirect
        localStorage.setItem('currentUser', loginUsername);
        window.location.href = 'account-details.html';
    } else {
        alert('Invalid username or password.');
    }
});


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    console.log(`Your Location: ${userLocation.latitude}, ${userLocation.longitude}`);
    displayLockers(lockers); // Simulate locker display based on the location
}

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

        // Simulate payment gateway
        setTimeout(() => {
            alert(`Payment successful! Please return the items on time to avoid a fine.`);
        }, 1000);

        displayLockers(lockers.filter(l => l.available)); // Refresh the list
    }
}

// Existing locker booking code

// Handle visitor check
function showSignup() {
    document.getElementById('visitor-check').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function proceedToBooking() {
    // Redirect to locker booking page (index.html)
    window.location.href = 'index.html';
}

// Handle account creation
document.getElementById('create-account').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // For simplicity, we'll log these values and show a message (real implementation would involve backend)
    console.log(`Account Created: ${username}, Password: ${password}`);
    alert('Account created successfully! Proceeding to locker booking...');

    // Redirect to locker booking page after account creation
    window.location.href = 'index.html';
});

// Star Rating Logic
let selectedRating = 0;

document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = this.getAttribute('data-value');
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('selected');
        });
        this.classList.add('selected');
        console.log(`Rating selected: ${selectedRating}`);
    });
});

function submitRating() {
    if (selectedRating > 0) {
        alert(`Thank you for your rating of ${selectedRating} stars!`);
        // Redirect to locker booking page
        window.location.href = 'index.html';
    } else {
        alert('Please select a rating before submitting.');
    }
}

document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const deviceCount = document.getElementById('device-count').value;

    if (!deviceCount) {
        alert("Please enter the number of devices.");
        return;
    }

    const totalAmount = deviceCount * 5; // Example: $5 per device
    localStorage.setItem('totalAmount', totalAmount);
    localStorage.setItem('deviceCount', deviceCount);
    localStorage.setItem('lockerLocation', selectedLocker.location);
    localStorage.setItem('rentedItems', rentedItems.join(', '));

    // Simulate payment process
    setTimeout(() => {
        window.location.href = 'confirmation.html';
    }, 1000);
});

// Confirmation Page
window.onload = function() {
    if (window.location.href.includes("confirmation.html")) {
        // Retrieve stored data from localStorage
        const totalAmount = localStorage.getItem('totalAmount');
        const deviceCount = localStorage.getItem('deviceCount');
        const lockerLocation = localStorage.getItem('lockerLocation');
        const rentedItems = localStorage.getItem('rentedItems');

        // Display booking details
        document.getElementById('locker-location').textContent = lockerLocation;
        document.getElementById('device-list').textContent = rentedItems;
        document.getElementById('total-payment').textContent = totalAmount;

        // Generate QR Code with booking details (for the ticket)
        const qrCodeData = `Locker Booking:\nLocation: ${lockerLocation}\nDevices: ${rentedItems}\nTotal: $${totalAmount}`;
        new QRCode(document.getElementById("qr-code"), {
            text: qrCodeData,
            width: 128,
            height: 128
        });

        // Optional: Clear localStorage after booking
        localStorage.clear();
    }
};


