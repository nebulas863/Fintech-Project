function takeToSignUp() {
    window.location.href = "./pages/signup.html";

    getStartedInp.value = '';

}

let getStartedInp = document.querySelector('.cta')

getStartedInp.addEventListener('click', takeToSignUp);


let learnMoreBtn = document.querySelectorAll('.learn-button');

learnMoreBtn.forEach(button => {
    button.addEventListener('click', takeToSignUp);
});

let joinSyca = document.querySelector('.join-sycamore');

joinSyca.addEventListener('click', takeToSignUp);


function openToggle() {
    let toggleDropdown = document.getElementById('toggle-dropdown');
    
    if (toggleDropdown.style.display === 'block') {
        toggleDropdown.style.display = 'none';
    } else {
        toggleDropdown.style.display = 'block';
    }
}