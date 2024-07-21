function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePassword(password) {
    // Simple validation, you can add more conditions as per your requirements
    return password.length >= 8;
}

function submitForm(event) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (!validateEmail(email)) {
        errorMessage.textContent = 'Invalid email address';
        errorMessage.style.display = 'block';
        return;
    }

    if (!validatePassword(password)) {
        errorMessage.textContent = 'Password must be at least 8 characters long';
        errorMessage.style.display = 'block';
        return;
    }

    // Reset error message if validation passes
    errorMessage.style.display = 'none';

    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };

    // Assuming you have a function to send data to the backend
    event.preventDefault();
    fetch('http://localhost:3000/api/v1/auth/registration', {
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
            alert('Registration failed. Please try again later.');
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