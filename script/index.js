let getStartedInp = document.querySelector('.form-name')

function takeToSignUp() {
    window.location.href = "./pages/signUp.html";

    getStartedInp.value = '';

}

function openToggle() {
    let toggleDropdown = document.getElementById('toggle-dropdown');
    
    if (toggleDropdown.style.display === 'block') {
        toggleDropdown.style.display = 'none';
    } else {
        toggleDropdown.style.display = 'block';
    }
}