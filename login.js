document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = this.username.value.trim();
  const password = this.password.value.trim();

  if (!username || !password) {
    alert("Both fields are required.");
    return;
  }
  try{
    const res = await fetch("http://localhost:3000/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password})
    });
    const data = await res.json();

    if(res.ok){
      //save token to localstorage
      localStorage.setItem("token", data.token);
      alert("login Succesful");

      // redirect to home or profile
      window.location.href="/html/home.html"
    }
    else{
      alert(data.msg);
    }
  }
  catch(err){
    console.log(err);
    }
});
