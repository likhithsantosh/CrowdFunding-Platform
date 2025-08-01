document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const username = this.username.value.trim();
  const password = this.password.value.trim();

  if (!name || !email || !username || !password) {
    alert("All fields are required.");
    return;
  }
  try{
    const res = await fetch('http://localhost:3000/html/signup',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, username, password})
    });
    const data = await res.json();

    if(res.ok){
      alert(data.message) // user registered
      window.location.href= "/login.html";
    }
    else{
      alert(data.message) // error
      }

  }
  catch(error){
    console.log(error);
  }

});
