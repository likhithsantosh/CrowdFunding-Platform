document.getElementById('projectForm').addEventListener("submit", async function(e) {
  e.preventDefault();

  const category = this.category.value.trim();
  const title = this.title.value.trim();
  const description = this.description.value.trim();
  const image = this.image.value.trim(); // ensure this is a text input (url)
  const targetFunds = this.targetFunds.value.trim();
  const deadline = this.deadline.value.trim();

  if (!category || !title || !description || !image || !targetFunds || !deadline) {
    alert("Please fill in all fields");
    return;
  }

  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:3000/create-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        category,
        title,
        description,
        image,
        targetFunds,
        deadline
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Project created successfully");
      window.location.href = "/html/home.html";
    } else {
      alert(data.message || "Error creating project");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
});
