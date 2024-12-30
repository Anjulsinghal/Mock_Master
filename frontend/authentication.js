function logout() {
    // Remove the token from local storage
    localStorage.removeItem('token'); // Adjust the key name if your token is stored under a different key
    localStorage.removeItem('userId'); // Remove
    // Redirect to index.html
    window.location.href = 'index.html';
}
const isAuth = localStorage.getItem('token') ? true : false;
if(!isAuth){
    window.location.href = 'index.html';
}