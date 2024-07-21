let content = document.getElementById('recipes'),
    footer = document.getElementById('footer'),
    checkContent = () => {
        console.log(content.clientHeight);
        if (content.clientHeight <= 0) {
            footer.style.position = 'absolute';
            footer.style.bottom = '0';
            footer.style.marginTop = '-' + footer.clientHeight;
        }
    };

function delUserData() {
    fetch('/api/v1/users/id=2',
        {method: 'DELETE'})
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error loading categories:', error));
}

// delUserData()

function changeField(flag){
    let option = ["block", "none"];

    document.getElementById('input-field-firstname').style.display = option[1 ^ flag];
    document.getElementById('input-field-lastname').style.display = option[1 ^ flag];
    document.getElementById('input-field-password').style.display = option[1 ^ flag];

    document.getElementById('user-firstname-txt').style.display = option[0 ^ flag];
    document.getElementById('user-lastname-txt').style.display = option[0 ^ flag];
    document.getElementById('user-password-txt').style.display = option[0 ^ flag];

    document.getElementById("user-edit-btn").style.display = option[0 ^ flag];
    document.getElementById("user-submit-btn").style.display = option[1 ^ flag];
    document.getElementById("user-cancel-btn").style.display = option[1 ^ flag];

}


function organizeData (data){
    // document.getElementById('user-id').innerText =  + data.id;
    document.getElementById('user-firstname-txt').innerText = data.first_name;
    document.getElementById('user-lastname-txt').innerText = data.last_name;
    document.getElementById('user-email-txt').innerText = data.email;
    document.getElementById('user-password-txt').innerText = data.password;

    document.getElementById('input-field-firstname').value = data.first_name;
    document.getElementById('input-field-lastname').value = data.last_name;
    document.getElementById('input-field-password').value = data.password;
}

function getUserData() {
    const userId = getCookie('userId');
    fetch(`/api/v1/users/?id=${userId}`,
        {method: 'GET'})
            .then(response => response.json())
            .then(data => organizeData(data))
            .catch(error => console.error('Error loading categories:', error));
}

function putUserData() {
    let data_obj = {};
    let firstname_input = document.getElementById('input-field-firstname').value;
    let lastname_input = document.getElementById('input-field-lastname').value;
    let password_input = document.getElementById('input-field-password').value;

    let firstname_txt = document.getElementById('user-firstname-txt').innerText;
    let lastname_txt = document.getElementById('user-lastname-txt').innerText;
    let password_txt = document.getElementById('user-password-txt').innerText;

    if (firstname_txt !== firstname_input){
        data_obj.firstname = firstname_input ;
    }
    if (lastname_input !== lastname_txt){
        data_obj.lastname = lastname_input;
    }
    if (password_input !== password_txt){
        data_obj.password = password_input;
    }

    if (data_obj.length === 0 ){
        return;
    }

    data_obj.email = document.getElementById('user-email-txt').innerText;

    fetch('/api/v1/users',
        {method: 'PUT',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify(data_obj)})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error loading categories:', error));
}

getUserData()

checkContent();

window.onresize = checkContent;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
