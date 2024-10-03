document.getElementById("loginbtn").addEventListener("click",() => {
  const emailId = document.getElementById("adminEmail").value
  const PasswordId = document.getElementById("adminPassword").value
  console.log(emailId,PasswordId)
  if (userData[0].email == emailId && userData[0].password == PasswordId) {
    document.getElementById("parentContainer").style.display = "none"
   }
})
