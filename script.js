const lockers = [
    { id: 1, location: 'Bus Stop 1', items: ['Wired Headphones', 'Bluetooth Headphones', 'Portable Powerbank', 'Wi-Fi Hotspot'], available: true, distance: 0.5 },
    { id: 2, location: 'Metro Station A', items: ['Wired Headphones', 'Wi-Fi Hotspot', 'Portable Powerbank'], available: true, distance: 1.0 },
    { id: 3, location: 'Bus Stop 2', items: ['Bluetooth Headphones', 'Portable Powerbank'], available: false, distance: 1.5 },
    { id: 4, location: 'Metro Station B', items: ['Wired Headphones', 'Bluetooth Headphones', 'Wi-Fi Hotspot'], available: true, distance: 0.8 },
];

function getLocation() {
    // Simulating getting user location (replace with real geolocation for production)
    const userLocation = { latitude: 0, longitude: 0 }; // Example coordinates

    // Filter and sort lockers based on distance
    const sortedLockers = lockers
        .filter(locker => locker.available)
        .sort((a, b) => a.distance - b.distance);

    displayLockers(sortedLockers);
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
    const locker = lockers.find(l => l.id === lockerId);
    if (locker && locker.available) {
        locker.available = false;
        alert(`You have successfully booked a locker at ${locker.location}!\n\nProceeding to payment...`);
        // Simulate payment gateway
        setTimeout(() => {
            alert(`Payment successful! Please return the items on time to avoid a fine.`);
        }, 1000);
        displayLockers(lockers.filter(l => l.available)); // Refresh the list
    }
}

