const form = document.getElementById('forms');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                username: event.target.elements.username.value,
                password: event.target.elements.password.value
            }
        )
    })
    .then((response) => {
        if (response.status !== 200) {
            return response.json()
        }
    })
    .then((data) => {
        document.getElementById('errors').innerHTML = `${data?.error !== undefined ? data.error : ""}`
        if (!data?.error) {
            window.location.href = "http://localhost:3000/"
        }
    })
})