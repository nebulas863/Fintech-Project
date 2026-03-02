// spinner board

function startLoading(button, text) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `${text} <span class="spinner"></span>`;
}

function stopLoading(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
}
// 


document.body.style.backgroundColor = 'white';

// document.body.style.backgroundColor = 'lightblue';

let signInForm = document.getElementById('signIn');


  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

  import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
  
    import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
  

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBf_xXsQIS9j9bvj3hHweuhzKNkynkfCEY",
    authDomain: "fintech-42163.firebaseapp.com",
    projectId: "fintech-42163",
    storageBucket: "fintech-42163.firebasestorage.app",
    messagingSenderId: "411903798974",
    appId: "1:411903798974:web:4fc331ddc712bbf7a938ef"
  };


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

    // get firstore  
  const db = getFirestore(app);
  console.log(db);
  
    //   get collection reference
  const colRef = collection(db, 'users');
  console.log(colRef);
  
// authenticatation
  const auth = getAuth();

//   add eventListener

signInForm.addEventListener('submit', async (e) => {
    
    e.preventDefault();
    // alert('submitted');

    // for spinner board
    const signInBtn = document.getElementById("signInBtn");

    startLoading(signInBtn, "Signing in");

    let userEmail = signInForm.email.value;
    let userPassword = signInForm.password.value;

    console.log(userEmail,userPassword);
    

    try {

      if (!userEmail.includes("@")) {
            Swal.fire({
                title: "Invalid Email",
                text: "Please enter a valid email address.",
                icon: "error"
            });
            return;
        }

        // if (userPassword !== userConfpassword) {
        //     Swal.fire({
        //         title: "Password Error",
        //         text: "Passwords do not match",
        //         icon: "error"
        //     });
        //         return; 
        // } 

        const signInUser = await signInWithEmailAndPassword(auth,userEmail,userPassword);
        console.log(signInUser);

        // alert('User signed in successfully');

        Swal.fire({
            title: `Welcome!`,
            text: "You have successfully signed in!",
            icon: "success"
        })
        
        .then(() => {
            window.location.href = "../pages/dashboard.html";
        })

        signInForm.reset();

        
        

    } catch (error) {

        if (error.message == "Firebase: Error (auth/invalid-credential).") {
            Swal.fire({
                title: "Invalid details",
                text: "The email or password you entered is incorrect.",
                icon: "error"
            });
        
        } else {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            });
        }

        
    } finally {
        stopLoading(signInBtn);
    }

})
