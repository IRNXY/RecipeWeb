function submitForm(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';

    const userData = {
        email: email,
        password: password
    };

    // Assuming you have a function to send data to the backend
    sendDataToBackend(userData);
}

function sendDataToBackend(userData) {
    fetch('api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to login');
            }
            alert('Login successful!');
            window.location.href = response.headers.get('location');
            return response.json(); // Parse the JSON response body
        })
        .then(data => {
            const userId = data.userId;
            const role = data.role; // Get the role from the response

            deleteCookie('userId');
            deleteCookie('role');

            setCookie('userId', userId, 7); // Save userId in cookie for 7 days
            setCookie('role', role, 7); // Save role in cookie for 7 days
            console.log('User ID and role saved to cookies:', userId, role);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Please try again later.');
        });
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}