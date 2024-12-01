let lockers = [
    { id: 1, location: "Metro Station A", distance: 1.2, available: true, items: [{ name: "Bluetooth Headphones", price: 50 }, { name: "Powerbank", price: 30 }, { name: "Wi-Fi Hotspot", price: 100 }] },
    { id: 2, location: "Bus Stop B", distance: 0.8, available: true, items: [{ name: "Wired Headphones", price: 20 }, { name: "Powerbank", price: 30 }] },
    { id: 3, location: "Metro Station C", distance: 2.3, available: true, items: [{ name: "Wi-Fi Hotspot", price: 100 }, { name: "Powerbank", price: 30 }] }
];
let rented = false;

// Function to display lockers
function displayLockers(lockers) {
    const lockerList = document.getElementById('locker-list');
    lockerList.innerHTML = '';

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
            <p>Select items and quantity:</p>
            ${locker.items.map(item => `
                <div>
                    <label>
                        <input type="checkbox" class="locker-item-checkbox" data-locker-id="${locker.id}" data-item-name="${item.name}" data-price="${item.price}">
                        ${item.name} ($${item.price})
                    </label>
                    <input type="number" class="locker-item-quantity" data-locker-id="${locker.id}" data-item-name="${item.name}" min="1" max="5" value="1" style="width: 50px;" disabled>
                </div>
            `).join('')}
            <button onclick="bookLocker(${locker.id})">Book Now</button>
        `;
        lockerList.appendChild(lockerItem);
    });

    // Enable quantity input when item checkbox is checked
    document.querySelectorAll('.locker-item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const quantityInput = this.parentNode.nextElementSibling;
            quantityInput.disabled = !this.checked;
        });
    });
}

// Function to handle booking
function bookLocker(lockerId) {
    if (rented) {
        alert("You already have a device rented. Please return it before renting again.");
        return;
    }

    const selectedItems = [];
    let totalDevices = 0;

    document.querySelectorAll(`.locker-item-checkbox[data-locker-id="${lockerId}"]:checked`).forEach(checkbox => {
        const itemName = checkbox.dataset.itemName;
        const itemPrice = parseFloat(checkbox.dataset.price);
        const quantity = parseInt(document.querySelector(`.locker-item-quantity[data-locker-id="${lockerId}"][data-item-name="${itemName}"]`).value);

        selectedItems.push({ name: itemName, price: itemPrice, quantity: quantity });
        totalDevices += quantity;
    });

    if (selectedItems.length === 0) {
        alert("Please select at least one item to book.");
        return;
    }

    if (totalDevices > 5) {
        alert("You cannot rent more than 5 devices at a time. Please adjust your selection.");
        return;
    }

    const rentalHours = parseInt(prompt("Enter the number of hours you want to rent the devices:"));
    if (isNaN(rentalHours) || rentalHours <= 0) {
        alert("Please enter a valid number of hours.");
        return;
    }

    const wifiHotspot = selectedItems.find(item => item.name === "Wi-Fi Hotspot");
    if (wifiHotspot) {
        const grantPermission = confirm("Grant permission to track your IP address via our Wi-Fi service to minimize misuse?");
        if (!grantPermission) {
            alert("You must grant permission to proceed with the booking.");
            return;
        }
    }

    const locker = lockers.find(l => l.id === lockerId);
    if (locker && locker.available) {
        rented = true;
        locker.available = false;

        const totalPrice = selectedItems.reduce((total, item) => total + (item.price * item.quantity * rentalHours), 0);

        alert(`Booking confirmed at ${locker.location}.\nItems: ${selectedItems.map(item => `${item.quantity} x ${item.name}`).join(', ')}\nTotal Price: $${totalPrice.toFixed(2)} for ${rentalHours} hours.\nProceeding to payment...`);

        // Save booking data
        localStorage.setItem('lockerLocation', locker.location);
        localStorage.setItem('rentedItems', JSON.stringify(selectedItems));
        localStorage.setItem('totalPrice', totalPrice);
        localStorage.setItem('rentalHours', rentalHours);

        // Redirect to payment page
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 1000);
    }
}

// Initial call to display lockers
displayLockers(lockers);

