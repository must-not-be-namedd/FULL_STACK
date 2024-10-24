let lockers = [
    { id: 1, location: "Metro Station A", distance: 1.2, available: true, items: ["Bluetooth Headphones", "Powerbank", "Wi-Fi Hotspot"] },
    { id: 2, location: "Bus Stop B", distance: 0.8, available: true, items: ["Wired Headphones", "Powerbank"] },
    { id: 3, location: "Metro Station C", distance: 2.3, available: true, items: ["Wi-Fi Hotspot", "Powerbank"] }
];
let rented = false; // Track if the user has already rented an item

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


