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

    let userEmail = signUpForm.email.value;
    let userPassword = signUpForm.password.value;
    let userConfpassword = signUpForm.confpassword.value;
    let userName = signUpForm.username.value;
    let userPhone = signUpForm.phone.value;

    // let userAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        let userAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        console.log(userAccountNumber);

    console.log(userEmail,userConfpassword,userPhone,userName,userPassword);
    

    try {

        if (userPassword.length < 6) {
            Swal.fire({
                title: "Weak Password",
                text: "Password must be at least 6 characters.",
                icon: "warning"
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
            name:userName,
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
            loanTakenAt: null
        });
            
       

        console.log(userQuerySnapshot);

        // alert('User created successfully');

        Swal.fire({
            title: `Welcome ${userName}!`,
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
        
    }

})
