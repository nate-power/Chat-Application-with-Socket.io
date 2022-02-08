const groupRoom = document.getElementById('group-room');
const logout = document.getElementById('logout');

// get user from cookies
const getUser = () => {
    let user = document.cookie.split('=')
    for(let i = 0; i < user.length; i++) {
         if (user[i] === "user") {
             let position = i + 1
             user = JSON.parse(decodeURIComponent(user[position]))
             return user
         }
    }
}
let user = getUser();

window.onload = function() {
    document.getElementById('user').innerHTML = `Hello, ${user.username}!`
}

groupRoom.addEventListener('submit', (event) => {
    event.preventDefault();
    sessionStorage.setItem('room', event.target.elements.roomname.value);
    window.location.href = "http://localhost:3000/room";
})

logout.addEventListener('click', () => {
    sessionStorage.removeItem('room')
    document.cookie = "user" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.reload();
})