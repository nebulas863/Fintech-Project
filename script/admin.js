// harmburger

const menuToggle = document.getElementById("menuToggle");
const sidebarMenu = document.getElementById("sidebarMenu");

menuToggle.addEventListener("click", () => {

    sidebarMenu.classList.toggle("active");

});

// 

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { getFirestore, collection, doc, getDoc, getDocs, updateDoc} 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import {getAuth,onAuthStateChanged} 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBf_xXsQIS9j9bvj3hHweuhzKNkynkfCEY",
    authDomain: "fintech-42163.firebaseapp.com",
    projectId: "fintech-42163",
    storageBucket: "fintech-42163.firebasestorage.app",
    messagingSenderId: "411903798974",
    appId: "1:411903798974:web:4fc331ddc712bbf7a938ef"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


// ADMIN AUTH CHECK

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "../pages/signIn.html";
        return;
    }

    const userRef = doc(db,"users",user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        window.location.href = "../pages/dashboard.html";
        return;
    }

    const userData = userSnap.data();

    if (userData.role !== "admin") {

        // block non admins
        window.location.href = "../pages/dashboard.html";
        return;
    }

    // ADMIN IS VERIFIED
    loadAdminData();

});

// The sections
const dashboardTab = document.getElementById("dashboardTab");
const usersTab = document.getElementById("usersTab");
const transactionsTab = document.getElementById("transactionsTab");

const dashboardSection = document.getElementById("dashboardSection");
const usersSection = document.getElementById("usersSection");
const transactionsSection = document.getElementById("transactionsSection");


dashboardTab.onclick = () => {

dashboardSection.style.display = "block";
usersSection.style.display = "block";
transactionsSection.style.display = "none";

}


usersTab.onclick = () => {

dashboardSection.style.display = "none";
usersSection.style.display = "block";
transactionsSection.style.display = "none";

}


transactionsTab.onclick = () => {

dashboardSection.style.display = "none";
usersSection.style.display = "none";
transactionsSection.style.display = "block";

loadTransactions();

}


async function loadAdminData() {

    const usersTable = document.getElementById("usersTable");
    const totalUsers = document.getElementById("totalUsers");
    const totalBalance = document.getElementById("totalBalance");

    const usersRef = collection(db,"users");
    const snapshot = await getDocs(usersRef);

    let count = 0;
    let platformBalance = 0;

    usersTable.innerHTML = "";

    snapshot.forEach((docSnap)=>{

        const data = docSnap.data();

        count++;

        platformBalance += Number(data.balance || 0);

        const isFrozen = data.status === "frozen";

        usersTable.innerHTML += `
            <tr>
                <td>${data.name}</td>
                
                <td class = "see">${data.accountNumber}</td>
                <td>$${Number(data.balance).toFixed(2)}</td>
                <td>${data.role || "user"}</td>
                <td>
                    <button data-id="${docSnap.id}" class="viewBtn">View</button>
                </td>
                <td>
                    <button data-id="${docSnap.id}" class="freezeUser" style="background:${isFrozen ? "black" : "red"}; color:white;" >
                    ${isFrozen ? "Frozen": "Freeze"}
                    </button>
                </td>
            </tr>
        `;

    });

    totalUsers.textContent = count;
    totalBalance.textContent = "$" + platformBalance.toFixed(2);


    // view Button inside loadAdminData function

    // View BUTTON

const viewButtons = document.querySelectorAll(".viewBtn");

viewButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const userId = button.dataset.id;

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const userData = userSnap.data();

            // alert(`
            //         User Details

            //         Name: ${userData.name}
            //         Email: ${userData.email}
            //         Phone: ${userData.phone}
            //         Account Number: ${userData.accountNumber}
            //         Balance: $${userData.balance}
            //         Role: ${userData.role}
            //         Status: ${userData.status}
            // `);

            Swal.fire({
                title: "user details",

                html: `
                    <div style="text-align:left;">
                        <p><strong>Name:</strong> ${userData.name}</p>
                        <p><strong>Email:</strong> ${userData.email}</p>
                        <p><strong>Phone:</strong> ${userData.phone}</p>
                        <p><strong>Status:</strong> ${userData.status}</p>
                        <p><strong>Account Number:</strong> ${userData.accountNumber}</p>
                        <p><strong>Balance:</strong> $${userData.balance}</p>
                        <p><strong>Role:</strong> ${userData.role}</p>
                        <p><strong>Loan status:</strong> ${userData.loanStatus}</p>
                        <p><strong>Loan amount:</strong> $${userData.loanAmount}</p>
                    </div>
                `,

                icon: "info"
            });


        }

    });

});




// FREEZE ACCOUNT

    const freezeButtons = document.querySelectorAll(".freezeUser");

    freezeButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const userId = button.dataset.id;

            const userRef = doc(db,"users",userId);

            await updateDoc(userRef,{
                status: "frozen"
            });

            // alert("Account frozen");

            Swal.fire({
                title: "Frozen",
                text: "Account frozen.",
                icon: "success"
            });

            // // change button color
            // button.style.backgroundColor = "black";

            // // change button text
            // button.textContent = "Frozen";

            

            loadAdminData(); // refresh table

        });

        

    });

    
    
    


}


// transaction tab & section
async function loadTransactions(){

const transactionsTable = document.getElementById("transactionsTable");

transactionsTable.innerHTML = "";

// get all users
const usersSnapshot = await getDocs(collection(db,"users"));

for (const userDoc of usersSnapshot.docs) {

    const userData = userDoc.data();

    const transactionsRef = collection(db,"users",userDoc.id,"transactions");

    const transactionsSnapshot = await getDocs(transactionsRef);

    transactionsSnapshot.forEach(txDoc => {

        const tx = txDoc.data();

        transactionsTable.innerHTML += `
        <tr>
  
        <td>${userData.name}</td>
        <td>${tx.type}</td>
        <td>$${tx.amount}</td>
        <td>${tx.createdAt.toDate().toLocaleString()}</td>
        </tr>
        `;

    });

}

}



// sign out


// import { signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// document.getElementById("logoutAdmin").onclick = () => {
//     signOut(auth).then(()=>{

//         window.location.href = "../pages/signIn.html";
//     });
// };

//   signOut or LogOut

// spinner-board
function startLoading(li, text = "Processing") {
    li.disabled = true;
    li.dataset.originalText = li.innerHTML;
    li.innerHTML = `${text} <span class="spinner"></span>`;
}

function stopLoading(button) {
    li.disabled = false;
    li.innerHTML = li.dataset.originalText;
}

// 

  let logOut = document.getElementById("logoutAdmin");

    logOut.addEventListener('click', async () => {

        startLoading(logOut, "Log out");

        // e.preventDefault();

        try {

            const result = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to log out.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, log me out"
        });

        if (!result.isConfirmed) return;

            // await signOut(auth);
            
            await Swal.fire({
                title: "Logged Out",
                text: "You have logged out successfully",
                icon: "success",
                // confrmButtonText: "OK"
            });

            
            window.location.href = "../pages/signIn.html";
            
        } catch (error) {
            
            console.log(error.message);

            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            });
            
        } finally {
            stopLoading(logOut);
        }
        
    
    }); 