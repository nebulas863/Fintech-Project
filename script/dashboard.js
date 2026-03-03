// spinner-board
function startLoading(button, text = "Processing") {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `${text} <span class="spinner"></span>`;
}

function stopLoading(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
}

// hide and show balance

const toggleBalanceBtn = document.getElementById("toggleBalance");
const balanceText = document.getElementById("balance");

let isVisible = true;

toggleBalanceBtn.addEventListener("click", () => {
    isVisible = !isVisible;

    balanceText.classList.toggle("hidden");

    toggleBalanceBtn.classList.toggle("fa-eye");
    toggleBalanceBtn.classList.toggle("fa-eye-slash");
});


// 
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

  import { getFirestore, collection, doc, onSnapshot, addDoc, getDoc, serverTimestamp, updateDoc, runTransaction, query, orderBy, getDocs,where } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
  
    import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
  

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


//   

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../pages/signIn.html";
    }
});


//   get docs to display user name and email

  let userDisplay = document.getElementById("user-dashboard");

//   get balance element    

let balance = document.getElementById("balance");

onAuthStateChanged(auth, async (user) => {

    // first check if user is authenticated, if not redirect to sign in page.
    if (!user) return;
    //   {
    //     window.location.href = "../pages/signIn.html";
    //     return;
        
    // }

    try {

        const userRef = doc(db, "users", user.uid);

        onSnapshot(userRef, (docSnap) => {

        if (docSnap.exists()) {

            const userData = docSnap.data();

            balance.textContent = `$${Number(userData.balance).toFixed(2)}`;
            console.log(balance);
            

            displayUser(userData);
        }

        
        // TRANSACTION DISPLAY

        const transactionContainer = document.getElementById("transaction-container");

        const transactionsRef = collection(db,"users",user.uid,"transactions");

        const q = query(transactionsRef, orderBy("createdAt", "desc"));

        onSnapshot(q, (snapshot) => {

            // clear old UI
            transactionContainer.innerHTML = "<h1>Transaction History</h1>";

            if (snapshot.empty) {
                transactionContainer.innerHTML +=
                    "<p class='transaction-p'>No transaction yet</p>";
                return;
            }

            snapshot.forEach((doc) => {

                const data = doc.data();

                const div = document.createElement("div");
                div.style.borderBottom = "1px solid #ccc";
                div.style.padding = "10px 0";

                div.innerHTML = `
                    <strong>${data.type.toUpperCase()}</strong><br>
                    $${Number(data.amount).toFixed(2)}<br>
                    <small>${data.createdAt?.toDate().toLocaleString()}</small>
                `;

                transactionContainer.appendChild(div);
            });

        });


    });
        
    } catch (error) {
        console.log(error.message);
        
    }
    
});



  function displayUser(userData) {
    // console.log("good to go");
    userDisplay.innerHTML = `
        <div>
            
            <h1 style="color: rgb(14, 56, 207);">Welcome ${userData.name}!</h1>
            <h2 style="color: rgb(12, 47, 90);">${userData.email}</h2>
        
        </div>

        <div>
            <h2 style="color: rgb(183, 9, 38);">Account number: ${userData.accountNumber}</h2>
        </div>


    `;
    
  }


//   signOut or LogOut

  let logOut = document.getElementById("logout");

    logOut.addEventListener('click', async (e) => {

        startLoading(logOut, "Logging out");

        e.preventDefault();

        try {

            const result = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to log out.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, log me out"
        });

        if (!result.isConfirmed) return;

            await signOut(auth);
            
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

    // console.log(logOut);
    





    // deposit


    let depositChild = document.getElementById("deposit-child");
    let depositDiv = document.getElementById("deposit");

    // let servicesDiv = document.getElementById("services"); 
    let overlay = document.getElementById("overlay");
    

    depositChild.addEventListener("click", () => {
        
        depositDiv.style.display = "block";
        overlay.style.display = "block";
        
    });


    // cancel deposit
    let cancelBtn = document.getElementById("cancelDeposit");

    cancelBtn.addEventListener("click", () => {
        depositDiv.style.display = "none";
        overlay.style.display = "none";
    });


    // deposit funds logic

    let confirmDeposit = document.getElementById("confirmDeposit");

    let depositInp = document.getElementById("depositAmount");
        // console.log(depositAmount);
    
    let availBal = document.getElementById("avail-bal");

    confirmDeposit.addEventListener("click", async () => {
        // e.preventDefault();


        let depositAmount = Number(depositInp.value);
        
        if (depositAmount <= 0 || isNaN(depositAmount)) {
            Swal.fire({
                title: "Invalid Amount",
                text: "Enter a valid deposit amount.",
                icon: "warning"
                });
            return;
        }

            const user = auth.currentUser;

        if (!user) {
            Swal.fire({
                title: "Not Authenticated",
                text: "Please login again.",
                icon: "error"
            });
            return;
        }


        const userRef = doc(db, "users", user.uid);

        startLoading(confirmDeposit);
        try {

            await runTransaction(db, async (transaction) => {

            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists()) {
                throw "User document not found!";
            }


            const currentBalance = Number(userDoc.data().balance) || 0;

            const newBalance = currentBalance + depositAmount;
            console.log(currentBalance);
            console.log(newBalance);
            
            
            transaction.update(userRef, { 
                balance: newBalance
            });

        });

        // Save transaction history
        await addDoc(collection(db, "users", user.uid, "transactions"), {
            type: "✅deposit",
            amount: '+' + depositAmount,
            userUid: user.uid,
            createdAt: serverTimestamp()
        });

        Swal.fire({
            title: "Deposit Successful",
            text: `$${depositAmount.toFixed(2)} added.`,
            icon: "success"
        });

        // confirmDeposit.reset();
        
        depositInp.value = '';

        depositDiv.style.display = "none";
        overlay.style.display = "none";

        // Update available balance display immediately after deposit
        const userDocSnap = await getDoc(userRef);  
        if (userDocSnap.exists()) {
            const updatedBalance = userDocSnap.data().balance || 0;
            availBal.textContent = `$${updatedBalance.toFixed(2)}`;
        }

    } catch (error) {
        console.log(error);

        Swal.fire({
            title: "Error",
            text: error,
            icon: "error"
        });
    } finally {
        stopLoading(confirmDeposit);
    }

    });




// WITHDRAW
// withdraw

let withdrawChild = document.getElementById("withdraw-child");

let withdrawDiv = document.getElementById("withdraw");

withdrawChild.addEventListener("click", ()=> {
    withdrawDiv.style.display = 'block';
    overlay.style.display = 'block';
});

// Cancel withdrawal
let cancelWithdrawalBtn = document.getElementById("cancelWithdrawal");

cancelWithdrawalBtn.addEventListener("click", ()=> {
    withdrawDiv.style.display = 'none';
    overlay.style.display = 'none';
})

// WITHDRAW LOGIC
let withdrawBtn = document.getElementById("withdrawBtn");

let withdrawAmountInp = document.getElementById("withdraw-amount");

withdrawBtn.addEventListener("click", async () => {
    const withdrawAmount = Number(withdrawAmountInp.value);

    startLoading(withdrawBtn);
    
    if (withdrawAmount <= 0 || isNaN(withdrawAmount)) {
        Swal.fire({
            title: "Invalid Amount",
            text: "Enter a valid withdrawal amount.",
            icon: "warning"
        });
        return;
    }

    const user = auth.currentUser;

    if (!user) {
        Swal.fire({
            title: "Not Authenticated",
            text: "Please login again.",
            icon: "error"
        });
        return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists()) {
                throw "User document not found!";
            }

            const currentBalance = Number(userDoc.data().balance) || 0;

            if (withdrawAmount > currentBalance) {
                throw "Insufficient funds!";
            }

            const newBalance = currentBalance - withdrawAmount;
            
            transaction.update(userRef, { 
                balance: newBalance
            });
        });

        // Save transaction history
        await addDoc(collection(db, "users", user.uid, "transactions"), {
            type: "💳withdraw",
            amount: '-' + withdrawAmount,
            userUid: user.uid,
            createdAt: serverTimestamp()
        });

        Swal.fire({
            title: "Withdrawal Successful",
            text: `$${withdrawAmount.toFixed(2)} withdrawn.`,
            icon: "success"
        });

        withdrawAmountInp.value = '';
        withdrawDiv.style.display = 'none';
        overlay.style.display = 'none';

        // Update available balance display immediately after withdrawal
        const userDocSnap = await getDoc(userRef);  
        if (userDocSnap.exists()) {
            const updatedBalance = userDocSnap.data().balance || 0;
            document.getElementById("withd-avail-bal").textContent = `$${updatedBalance.toFixed(2)}`;
        }
        
    } catch (error) {
        console.log(error.message);
        
    } finally {
        stopLoading(withdrawBtn);
    }
});



// TRANSFER

// Transfer

let transferChild = document.getElementById('transfer-child');
let transferDiv = document.getElementById("transfer");

transferChild.addEventListener("click", ()=>{
    // alert("oya na");
    transferDiv.style.display = 'block';
    overlay.style.display = 'block';

})

// Cancel transfer

let cancelTransferBtn = document.getElementById("cancelTransfer");

cancelTransferBtn.addEventListener("click", ()=> {
    transferDiv.style.display = 'none';
    overlay.style.display = 'none';
})


// Transfer logic will go here

const transferBtn = document.getElementById("transferBtn");
const transferAmountInput = document.getElementById("transfer-amount");
const recipientInput = document.getElementById("recipient-account-number");
const transferAvailableBalance = document.getElementById("transfer-avail-bal");
    
let currentBalance = 0;

transferBtn.addEventListener("click", async () => {

    startLoading(transferBtn);

    const amount = Number(transferAmountInput.value);
    const recipientAccountNumber = Number(recipientInput.value.trim());
    const sender = auth.currentUser;

    let recipientId = '';


    if (!amount || amount <= 0 || isNaN(amount)) {
        Swal.fire({
            title: "Invalid Amount",
            text: "Please enter a valid amount.",
            icon: "warning"
        });
        return;
    }

    if (!recipientAccountNumber) {
        Swal.fire({
            title: "Invalid Recipient",
            text: "Please enter a valid recipient account number.",
            icon: "warning"
        });
        return;
    }

    if (!sender) {
        Swal.fire({
            title: "Not Authenticated",
            text: "Please login again.",
            icon: "error"
        });
        return;
    }

    

    try {

        await runTransaction(db, async (transaction) => {
            const senderRef = doc(db, "users", sender.uid);
            const senderDoc = await transaction.get(senderRef);

            if (!senderDoc.exists()) {
                throw new "Sender document not found!";
            }

            const senderData = senderDoc.data();
            currentBalance = Number(senderData.balance) || 0;

            if (amount > currentBalance) {
                throw new Error("Insufficient funds!");
            }

            // Find recipient by account number
            
            const recipientQuery = query(colRef, where("accountNumber", "==", recipientAccountNumber));
            const recipientSnapshot = await getDocs(recipientQuery);    

            if (recipientSnapshot.empty) {
                throw new Error("Recipient not found!");
            }

            const recipientDoc = recipientSnapshot.docs[0];
            recipientId = recipientDoc.id;
            const recipientData = recipientDoc.data();

             if (recipientId === sender.uid) {
                throw new Error("You cannot transfer to yourself!");
            }

            const newSenderBalance = currentBalance - amount;
            const recipientBalance = Number(recipientData.balance) || 0;
            const newRecipientBalance = recipientBalance + amount;

            // update balances
            transaction.update(senderRef, { balance: newSenderBalance });
            transaction.update(recipientDoc.ref, { balance: newRecipientBalance });
        });

        // SAVE TRANSACTIONS

        // Save transaction for sender
        await addDoc(collection(db, "users", sender.uid, "transactions"), {
            type: "📲transfer-out",
            // toAccount: recipientData.accountNumber,
            // toName: recipientData.name,
            amount: '-' + amount,
            createdAt: serverTimestamp()
        });


        
        // Save transaction for recipient   
        await addDoc(collection(db, "users", recipientId, "transactions"), {
            type:"✅transfer-in",
            // fromAccount: senderData.accountNumber,
            // fromName: senderData.name,
            amount: '+' + amount,
            // userUid: recipientDoc.id,
            userUid: sender.uid,
            createdAt: serverTimestamp()
        }); 


        // alert('Transfer successful');
        Swal.fire({
            title: "Transfer Successful",
            text: `$${amount.toFixed(2)} transferred.`,
            icon: "success"
        });

        transferAmountInput.value = '';
        recipientInput.value = '';
        transferDiv.style.display = 'none';
        overlay.style.display = 'none';

    } catch (error) {

        // Swal.fire({
        //     title: "Error",
        //     text: error.message,
        //     icon: "error"
        // }); 

        alert(error.message);
        
    } finally {
        stopLoading(transferBtn);
    }

})






// SAVINGS !! AIRTIME
// AIRTIME

let saveChild = document.getElementById("save-child");
let savingsDiv = document.getElementById("savings");

saveChild.addEventListener("click", ()=> {
    // alert("good to go");
    savingsDiv.style.display = 'block';
    overlay.style.display = 'block';
})


// cancel Savings

let cancelSavingsBtn = document.getElementById("cancelSavings");

cancelSavingsBtn.addEventListener("click", ()=> {
    // alert('lets cancel');
    savingsDiv.style.display = 'none';
    overlay.style.display = 'none';

})

// AIRTIME LOGIC

let airtimeBtn = document.getElementById("airtime-btn");
let airtimeAmountInput = document.getElementById("airtime-inp")



airtimeBtn.addEventListener("click", async () =>{

    startLoading(airtimeBtn);

    const amount = Number(airtimeAmountInput.value);

    // check if user is authenticated
    const user = auth.currentUser;

    if (!amount || amount <= 0 || isNaN(amount)) {
        Swal.fire({
            title: "Invalid Amount",
            text: "Enter a valid airtime amount.",
            icon: "warning"
        });
        return;
    }

    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    try {

        let userData;

        await runTransaction(db, async (transaction) => {

            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists()) {
                throw new Error("User not found");
            }

            userData = userDoc.data();

            const currentBalance = Number(userData.balance) || 0;

            if (amount > currentBalance) {
                throw new Error("Insufficient balance");
            }

            const newBalance = currentBalance - amount;

            transaction.update(userRef, {
                balance: newBalance
            });
        });

        // Save transaction
        await addDoc(collection(db, "users", user.uid, "transactions"), {
            type: "📱airtime",
            phone: userData.phone,
            amount: "-" + amount,
            createdAt: serverTimestamp()
        });

        Swal.fire({
            title: "Airtime Successful",
            text: `₦${amount.toFixed(2)} sent to ${userData.phone}`,
            icon: "success"
        });

        airtimeAmountInput.value = "";
        savingsDiv.style.display = "none";
        overlay.style.display = "none";

        
    } catch (error) {

        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
        
    } finally {
        stopLoading(airtimeBtn);
    }



})






// LOANS
// loan

let loanChild = document.getElementById("loan-child");
let loanDiv = document.getElementById("loan");

loanChild.addEventListener("click", ()=> {
    // alert("good to go");
    loanDiv.style.display = 'block';
    overlay.style.display = 'block';
})


// cancel loans

let cancelLoanBtn = document.getElementById("cancelLoan");

cancelLoanBtn.addEventListener("click", ()=> {
    // alert('lets cancel');
    loanDiv.style.display = 'none';
    overlay.style.display = 'none';

})


// Loan Logic

let getLoanBtn = document.getElementById("get-loan");

getLoanBtn.addEventListener("click", async () => {

    // spinnerboard
    startLoading(getLoanBtn);

    const loanAmount = Number(document.getElementById("loan-input").value);

    // check if user is currently authentcated
    const user = auth.currentUser;

    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    try {

        await runTransaction(db, async (transaction) => {

            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists()) throw "User not found";

            const data = userDoc.data();

            if (data.loanStatus === "active") {
                throw "You already have an active loan";
            }

            if (loanAmount <= 0 || isNaN(loanAmount)) {
                throw "Invalid loan amount";
            }

            const currentBalance = Number(data.balance) || 0;
            const maxLoan = currentBalance * 3;

            if (loanAmount > maxLoan) {
                throw `Maximum loan you can take is $${maxLoan}`;
            }

            const interest = loanAmount * 0.2;
            const totalRepayment = loanAmount + interest;

            const newBalance = currentBalance + loanAmount;

            // loan repayment date is 30 days from now
            const repaymentDate = new Date();
            repaymentDate.setDate(repaymentDate.getDate() + 30);

            transaction.update(userRef, {
                balance: newBalance,
                loanStatus: "active",
                loanAmount: loanAmount,
                loanInterest: interest,
                loanTotal: totalRepayment,
                loanTakenAt: serverTimestamp(),
                loanRepaymentTime: repaymentDate
            });

        });

        // Save transaction history
        await addDoc(collection(db, "users", user.uid, "transactions"), {
            type: "💰loan",
            amount: `+${loanAmount}`,
            createdAt: serverTimestamp()
        });

        Swal.fire({
            title: "Loan Approved 🎉",
            text: "Funds have been credited to your account. Please ensure to pay back in 30 days. ",
            icon: "success"
        });

        document.getElementById("loan-input").value = '';
        loanDiv.style.display = 'none';
        overlay.style.display = 'none'; 

        // const loanAvail = document.getElementById("loan-avail-bal");

        // if (loanAvail) {
        //     loanAvail.textContent =
        //         `Available balance: $${Number(userData.balance).toFixed(2)}`;
        // }

    } catch (error) {

        Swal.fire({
            title: "Loan Error",
            text: error,
            icon: "error"
        });

    } finally {
        stopLoading(getLoanBtn);
    }

});



    