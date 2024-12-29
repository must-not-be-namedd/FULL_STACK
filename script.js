let lockers = [
    { id: 1, location: "Metro Station A", distance: 1.2, available: true, items: ["Bluetooth Headphones", "Powerbank", "Wi-Fi Hotspot"] },
    { id: 2, location: "Bus Stop B", distance: 0.8, available: true, items: ["Wired Headphones", "Powerbank"] },
    { id: 3, location: "Metro Station C", distance: 2.3, available: true, items: ["Wi-Fi Hotspot", "Powerbank"] }
];
let rented = false; // Track if the user has already rented an item
let users = []; // Simulating a simple in-memory database
let selectedDevices = []; // To store selected devices for payment

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

        // Save locker details
        localStorage.setItem('lockerLocation', locker.location);
        localStorage.setItem('availableItems', JSON.stringify(locker.items));

        // Redirect to device selection page
        setTimeout(() => {
            window.location.href = 'devices.html';
        }, 1000);

        displayLockers(lockers.filter(l => l.available)); // Refresh locker list
    }
}

// Handle Device Selection on devices.html
function displayAvailableDevices() {
    const availableItems = JSON.parse(localStorage.getItem('availableItems'));
    const deviceSelectionContainer = document.getElementById('device-selection');

    availableItems.forEach(item => {
        const deviceDiv = document.createElement('div');
        deviceDiv.innerHTML = `
            <label for="${item}">${item}</label>
            <input type="checkbox" id="${item}" name="devices" value="${item}">
        `;
        deviceSelectionContainer.appendChild(deviceDiv);
    });

    // Handle form submission for device selection
    document.getElementById('device-selection-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page refresh

        selectedDevices = []; // Clear previous selections
        availableItems.forEach(item => {
            if (document.getElementById(item).checked) {
                selectedDevices.push(item);
            }
        });

        if (selectedDevices.length === 0) {
            alert('Please select at least one device.');
            return;
        }

        // If Portable Wi-Fi is selected, ask for IP permission
        if (selectedDevices.includes("Wi-Fi Hotspot")) {
            askForIPPermission();
        } else {
            // Proceed directly to payment page
            storeDevicesAndRedirect();
        }
    });
}

// Ask for permission to access the IP address
function askForIPPermission() {
    if (confirm("To use the Portable Wi-Fi, we need permission to access your IP address. Do you grant permission?")) {
        storeDevicesAndRedirect();
    } else {
        alert("Permission denied. You cannot rent the Portable Wi-Fi.");
    }
}

// Store selected devices in localStorage and redirect to payment page
function storeDevicesAndRedirect() {
    localStorage.setItem('selectedDevices', selectedDevices.join(', '));

    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Calculate total amount and proceed with payment on payment.html
function calculatePayment() {
    const pricePerDevice = 5; // Price per device
    const selectedDevices = localStorage.getItem('selectedDevices').split(', ');

    const deviceCount = selectedDevices.length;
    const totalAmount = deviceCount * pricePerDevice;

    document.getElementById('device-count').value = deviceCount;
    document.getElementById('device-count-summary').textContent = deviceCount;
    document.getElementById('total-amount-summary').textContent = totalAmount.toFixed(2);

    // Handle payment confirmation
    document.getElementById('payment-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Simulate successful payment process
        alert('Payment successful! Your booking is confirmed.');

        // Store booking details in localStorage
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));

        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    });
}
