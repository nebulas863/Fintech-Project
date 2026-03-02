let getStartedInp = document.querySelector('.form-name')

function takeToSignUp() {
    window.location.href = "./pages/signup.html";

    getStartedInp.value = '';

}

let learnMoreBtn = document.querySelector('.learn-more-btn');

function takeToSignUp () {
    window.location.href = "./pages/signup.html";
}


function openToggle() {
    let toggleDropdown = document.getElementById('toggle-dropdown');
    
    if (toggleDropdown.style.display === 'block') {
        toggleDropdown.style.display = 'none';
    } else {
        toggleDropdown.style.display = 'block';
    }
}