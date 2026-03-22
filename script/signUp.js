// spinnerboard

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
// 
document.body.style.backgroundColor = 'lightblue';

let signUpForm = document.getElementById('signUp');


  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

  import { getFirestore, collection, addDoc,  setDoc,doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
  
    import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
  

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

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // alert('submitted');

    // spinnerboard for signup button
    const signUpBtn = document.getElementById("signUpBtn");
    startLoading(signUpBtn, "Signing Up");  

    let userEmail = signUpForm.email.value;
    let userPassword = signUpForm.password.value;
    let userConfpassword = signUpForm.confpassword.value;
    // let userName = signUpForm.username.value;
    let lastName = signUpForm.lastname.value;
    let firstName = signUpForm.firstname.value;
    let userPhone = signUpForm.phone.value;

    // let userAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        let userAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        console.log(userAccountNumber);

    console.log(userEmail,userConfpassword,userPhone,firstName,lastName,userPassword);
    

    try {

        // if (userName.includes("@",".",",","$","&","!","#","%","/","?","<",">")) {
        //     Swal.fire ({
        //         title: "Invalid Name",
        //         text: "Name should not contain symbols",
        //         icon: "error"
        //     });
        //     return;
        // }

        if (lastName.includes("@",".",",","$","&","!","#","%","/","?","<",">")) {
            Swal.fire ({
                title: "Invalid lastName",
                text: "Name should not contain symbols",
                icon: "error"
            });
            return;
        }

        if (firstName.includes("@",".",",","$","&","!","#","%","/","?","<",">")) {
            Swal.fire ({
                title: "Invalid firstName",
                text: "Name should not contain symbols",
                icon: "error"
            });
            return;
        }

        if (userPassword.length < 6) {
            Swal.fire({
                title: "Weak Password",
                text: "Password must be at least 6 characters.",
                icon: "warning"
            });
            return;
        }

        // if (!userPassword.includes("@",".","$","&","#","%","1","2","3","4","5","6","7","8","9","0")) {
        //     Swal.fire ({
        //         title: "Invalid password",
        //         text: "password should contain a special character and a number",
        //         icon: "error"
        //     });
        //     return;
        // }

        const hasNumber = /\d/.test(userPassword); // checks for number
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(userPassword); // checks special char

        if (!hasNumber && !hasSpecial) {
            Swal.fire({
                title: "Weak Password",
                text: "Password must contain at least a number or a special character.",
                icon: "error"
            });
            return;
        }

        if (!userEmail.includes("@")) {
            Swal.fire({
                title: "Invalid Email",
                text: "Please enter a valid email address.",
                icon: "error"
            });
            return;
        }
        

        if (userPassword !== userConfpassword) {
            Swal.fire({
                title: "Password Error",
                text: "Passwords do not match",
                icon: "error"
            });
                return; 
        } 

        const createUser = await createUserWithEmailAndPassword(auth,userEmail,userPassword);
        console.log(createUser);

        

        // const userQuerySnapshot = await addDoc(colRef, {
        //     uid:createUser.user.uid,
        //     name:userName,
        //     phone:userPhone,
        //     email:userEmail,
        //     password:userPassword,
        //     accountNumber: userAccountNumber,
        //     balance: 0,
        //     role: "user",
        //     createdAt: serverTimestamp()
        // });

        const userQuerySnapshot = await setDoc(doc(db, "users", createUser.user.uid), {
            name:firstName + " " + lastName,
            firstname: firstName,
            lastname: lastName,
            phone:userPhone,
            email:userEmail,
            password:userPassword,
            accountNumber: userAccountNumber,
            balance: 0,
            role: "user",
            createdAt: serverTimestamp(),
            loanStatus: "none" | "active",
            loanAmount: 0,
            loanInterest: 0,
            loanTotal: 0,
            loanTakenAt: null,
            status: "active" | "frozen",
        });
            
       

        console.log(userQuerySnapshot);

        // alert('User created successfully');

        Swal.fire({
            title: `Welcome ${firstName}!`,
            text: "You have successfully signed up!",
            icon: "success"
        }).then(() => {
            window.location.href = "../pages/signIn.html";
        })

        signUpForm.reset();

        
        

    } catch (error) {

        if (error.message == "Firebase: Error (auth/email-already-in-use).") {
            Swal.fire({
                title: "Email Already in Use",
                text: "The email you provided is already registered.",
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
        stopLoading(signUpBtn);
    }

})
