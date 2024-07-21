const recipesSection = document.getElementById("recipes");
const noRecipesMessage = document.getElementById("no-recipes");

async function getAllRecipes() {
    try {
        let response = await fetch('http://localhost:3000/api/v1/recipes/all', {method: 'GET'})
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        noRecipesMessage.style.display = 'block';
        noRecipesMessage.textContent = 'Failed to load recipes.';
    }
}

async function checkContent() {
    let result = await getAllRecipes();

    renderRecipes(result);

    // Use a timeout to ensure the DOM has updated
    setTimeout(() => {
        let content = document.getElementById('recipes');
        let footer = document.getElementById('footer');
        console.log(content.clientHeight);

        if (content.clientHeight <= 0) {
            footer.style.position = 'absolute';
            footer.style.bottom = '0';
            footer.style.marginTop = '-' + footer.clientHeight + 'px';
        } else {
            footer.style.position = 'relative';
            footer.style.marginTop = '0';
        }
    }, 0);
}

function renderRecipes(recipes) {
    const createButton = document.getElementById("openModalBtn")
    const role = getCookie('role');
    const isAdmin = role === 'ADMIN';

    if (isAdmin) {
        createButton.style.display = 'block';
    } else {
        createButton.style.display = 'none';
    }

    if (recipes.length === 0) {
        noRecipesMessage.style.display = 'block';
    } else {
        noRecipesMessage.style.display = 'none';
        recipes.forEach(recipe => {

            const card = document.createElement('div');
            card.classList.add('article-card');

            if (isAdmin) {
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('card-buttons');

                const editButtonA = document.createElement('a');
                editButtonA.classList.add('edit-button');

                const deleteButtonA = document.createElement('a');
                deleteButtonA.classList.add('delete-button');

                const editButtonI = document.createElement('i');
                editButtonI.classList.add('fas', 'fa-edit');
                editButtonI.setAttribute("data-recipe-id-edit", recipe.id);

                const deleteButtonI = document.createElement('i');
                deleteButtonI.classList.add('fas', 'fa-trash-alt');
                deleteButtonI.setAttribute("data-recipe-id-delete", recipe.id);

                editButtonA.appendChild(editButtonI)
                deleteButtonA.appendChild(deleteButtonI)

                buttonContainer.appendChild(editButtonA);
                buttonContainer.appendChild(deleteButtonA);

                card.appendChild(buttonContainer);
            }

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('article-image');
            imageDiv.style.backgroundImage = `url(${recipe.image})`;
            card.appendChild(imageDiv);

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('article-info');

            const title = document.createElement('h2');
            title.textContent = recipe.title;
            infoDiv.appendChild(title);

            const description = document.createElement('p');
            description.classList.add("description")
            description.textContent = recipe.description;
            infoDiv.appendChild(description);

            const readLink = document.createElement('a');
            readLink.textContent = 'READ';
            readLink.classList.add("read-more")
            readLink.setAttribute("data-recipe-id", recipe.id);
            readLink.href = `#`;
            infoDiv.appendChild(readLink);

            card.appendChild(infoDiv);
            recipesSection.appendChild(card);
        });
    }
}

checkContent().then(() => {
    window.onresize = checkContent;
});

document.addEventListener("DOMContentLoaded", function () {
    const userId = getCookie('userId'); // Function to get the user ID from cookies
    // if (userId) {
    fetchUserData(userId);
    // }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function fetchUserData(userId) {
    fetch(`http://localhost:3000/api/v1/users/?id=${userId}`, {method: 'GET'})
        // fetch(`http://localhost:3000/api/v1/users/?id=3`)
        .then(response => response.json())
        .then(data => {
            displayUserInfo(data);
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function displayUserInfo(user) {
    const userInfo = document.getElementById('userInfo');
    const avatarUrl = user.avatar ? user.avatar : 'path/to/default-avatar.png';
    const userAvatarHtml = document.getElementById('userAvatar')
    const userEmailHtml = document.getElementById('userEmail')

    userEmailHtml.innerText = user.email;
    userAvatarHtml.setAttribute('url', avatarUrl);
}

document.addEventListener('DOMContentLoaded', () => {
    const userInfo = document.getElementById('userInfo');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userDetailsButton = document.getElementById('userDetailsButton');
    const logoutButton = document.getElementById('logoutButton');

    // Toggle the dropdown menu
    userInfo.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from being caught by the document listener
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Redirect to the user details page
    userDetailsButton.addEventListener('click', () => {
        window.location.href = '/user-details'; // Change to your actual user details page
    });

    // Logout the user
    logoutButton.addEventListener('click', () => {
        // Clear cookies
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });

        // Redirect to login page
        window.location.href = '/login'; // Change to your actual login page
    });

    // Hide the dropdown menu when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!userInfo.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
});

function fetchRecipeDetails(recipeId, callback) {
    fetch(`http://localhost:3000/api/v1/recipes/?id=${recipeId}`)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching recipe details:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-create');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModal = document.querySelector('.close-create');
    const form = document.getElementById('recipeForm');
    const categorySelect = document.getElementById('category');
    const modalTitle = document.getElementById('modal-title');

    function openModal(recipe) {
        loadCategories();
        if (recipe) {
            modalTitle.textContent = 'Edit Recipe';
            console.log(modalTitle.textContent);
            form.title.value = recipe.title;
            form.description.value = recipe.description;
            form.ingredients.value = recipe.ingredients;
            form.instructions.value = recipe.instructions;
            form.cooking_time.value = recipe.cooking_time;
            form.serving_size.value = recipe.serving_size;
            form.category.value = recipe.category;
        } else {
            modalTitle.textContent = 'Create a New Recipe';
            form.reset();
        }
        modal.style.display = 'block';
    }

    // Close modal
    closeModal.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Open modal
    openModalBtn.onclick = () => {
        modal.style.display = 'block';
        openModal(null)
        // loadCategories();
    };

    // Load categories from API
    const loadCategories = () => {
        fetch('http://localhost:3000/api/v1/categories/all', {method: 'GET'})
            .then(response => response.json())
            .then(data => {
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.catName;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading categories:', error));
    };

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('fa-edit')) {
            event.preventDefault();
            const recipeId = event.target.getAttribute('data-recipe-id-edit');
            fetch(`http://localhost:3000/api/v1/recipes/?id=${recipeId}`, {method: 'GET'})
                .then(response => response.json())
                .then(data => {
                    console.log('Recipe Details:', data);
                    fetchRecipeDetails(recipeId, openModal);
                })
                .catch(error => console.error('Error fetching recipe details:', error));
        }
    })

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('fa-trash-alt')) {
            event.preventDefault();
            const recipeId = event.target.getAttribute('data-recipe-id-delete');
            // Add logic for deleting the recipe
            if (confirm('Are you sure you want to delete this recipe?')) {
                fetch(`http://localhost:3000/api/v1/recipes/?id=${recipeId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (response.ok) {
                            location.reload();
                        } else {
                            console.error('Failed to delete recipe');
                        }
                    })
                    .catch(error => console.error('Error deleting recipe:', error));
            }
        }
    });

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value
        const ingredients = document.getElementById('ingredients').value;
        const instructions = document.getElementById('instructions').value;
        const cooking_time = document.getElementById('cooking_time').value;
        const serving_size = document.getElementById('serving_size').value;
        const category_id = document.getElementById('category').value;
        const author_id = getCookie('userId'); // Function to get author_id from cookies

        const recipe = {
            title,
            description,
            ingredients,
            instructions,
            cooking_time,
            serving_size,
            author_id,
            category_id
        };

        fetch('http://localhost:3000/api/v1/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Recipe created:', data);
                modal.style.display = 'none'; // Close the modal
                form.reset(); // Reset the form
                location.reload()
            })
            .catch(error => console.error('Error creating recipe:', error));
    });

    // Function to get cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal-read');
    const span = document.getElementsByClassName('close-read')[0];

    function showModal(recipe) {
        document.getElementById('recipeTitle').textContent = recipe.title;
        document.getElementById('recipeDescription').textContent = recipe.description;
        document.getElementById('recipeIngredients').textContent = recipe.ingredients;
        document.getElementById('recipeInstructions').textContent = recipe.instructions;
        document.getElementById('recipeCookingTime').textContent = recipe.cooking_time;
        document.getElementById('recipeServingSize').textContent = recipe.serving_size;
        document.getElementById('recipeCategory').textContent = recipe.category;
        document.getElementById('recipeImage').src = recipe.imageUrl || 'default.jpg';
        modal.style.display = 'block';
    }

    span.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('read-more')) {
            const recipeId = event.target.getAttribute('data-recipe-id');
            fetch(`http://localhost:3000/api/v1/recipes/?id=${recipeId}`, {method: 'GET'})
                .then(response => response.json())
                .then(data => {
                    console.log('Recipe Details:', data);
                    showModal(data)
                })
                .catch(error => console.error('Error fetching recipe details:', error));
        }
    });

    // function fetchRecipeDetails(recipeId) {
    //     fetch(`http://localhost:3000/api/v1/recipes/?id=${recipeId}`)
    //         .then(response => response.json())
    //         .then(data => showModal(data))
    //         .catch(error => console.error('Error fetching recipe details:', error));
    // }

    // document.querySelectorAll('.read-more').forEach(button => {
    //     button.addEventListener('click', function(event) {
    //         event.preventDefault();
    //         const recipeId = event.target.getAttribute('data-recipe-id');
    //         console.log( event.target.getAttribute('data-recipe-id'))// Assuming each "Read more" button has a data attribute with the recipe ID
    //         fetchRecipeDetails(recipeId);
    //     });
    // });
});





