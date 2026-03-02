let btn = document.getElementById('btn');

btn.addEventListener('click', directBtn);

function directBtn() {
    window.location.href = "../pages/signup.html";
}

let btnStarted = document.querySelectorAll('.button-1');

btnStarted.forEach(button => {
    button.addEventListener('click', directBtn);
});



function openToggle() {
    let toggleDropdown = document.getElementById('toggle-dropdown');
    
    if (toggleDropdown.style.display === 'none') {
        toggleDropdown.style.display = 'block';
    } else {
        toggleDropdown.style.display = 'none';
    }
}