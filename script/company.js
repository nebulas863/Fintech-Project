directBtn = () => {
    window.location.href = "../pages/signUp.html";
} 

function openToggle() {
    let toggleDropdown = document.getElementById('toggle-dropdown');
    
    if (toggleDropdown.style.display === 'none') {
        toggleDropdown.style.display = 'block';
    } else {
        toggleDropdown.style.display = 'none';
    }
}