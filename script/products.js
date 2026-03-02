directBtn = () => {
    window.location.href = "../pages/signup.html";
}

function openToggle() {
    let toggleDropdown = document.getElementById('toggle-dropdown');
    
    if (toggleDropdown.style.display === 'none') {
        toggleDropdown.style.display = 'block';
    } else {
        toggleDropdown.style.display = 'none';
    }
}