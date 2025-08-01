const token = localStorage.getItem("token");
let currentUserId = null;

if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    currentUserId = payload.id;
  } catch (err) {
    console.log("Invalid token");
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/posts", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      alert("Please login to view posts.");
      return;
    }

    const posts = await res.json();
    const postsGrid = document.getElementById("postsGrid");
    postsGrid.innerHTML = "";

    posts.forEach((post) => {
      const box = document.createElement("div");
      box.className = "post-box";
      const percentage = Math.min((post.raisedFunds / post.targetFunds) * 100, 100).toFixed(1);

      box.innerHTML = `
        <h4>${post.category}</h4>
        <img src="${post.image}" alt="Post image" style="width:100%; height:150px; object-fit:cover;" />
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <p><strong>Target:</strong> ₹${post.targetFunds}</p>
        <p><strong>Raised:</strong> ₹${post.raisedFunds || 0}</p>
        <p><strong>Deadline:</strong> ${post.deadline}</p>

        <div style="background:#ddd; border-radius:5px; overflow:hidden; height:10px; margin:10px 0;">
          <div style="width:${percentage}%; background:green; height:100%;"></div>
        </div>

        <input type="number" placeholder="Amount" class="fund-input" />
        <button onclick="fundPost('${post._id}', this)">Fund Now</button>
      `;

      const likeBtn = document.createElement("button");
      likeBtn.textContent = `❤️ Like (${post.likes?.length || 0})`;
      likeBtn.onclick = async () => {
        const res = await fetch(`http://localhost:3000/posts/like/${post._id}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) window.location.reload();
      };
      box.appendChild(likeBtn);

      if (post.userId === currentUserId) {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deletePost(post._id);
        box.appendChild(deleteBtn);
      }

      postsGrid.appendChild(box);
    });

  } catch (error) {
    console.log("Error loading posts:", error);
  }
});

async function deletePost(postId) {
  try {
    const res = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (res.ok) {
      alert("Post deleted successfully");
      window.location.reload();
    } else {
      alert("Failed to delete the post");
    }
  } catch (error) {
    console.log("Error deleting post", error);
  }
}

async function fundPost(postId, btn) {
  const input = btn.previousElementSibling;
  const amount = parseInt(input.value);

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/posts/fund/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Thanks for funding!");
      window.location.reload();
    } else {
      alert(data.message || "Funding failed");
    }
  } catch (error) {
    console.log("Error funding post", error);
  }
}

function logout(){
  localStorage.removeItem("token");
  alert("logged out succesfully");
  window.location.href= "/html/login.html";
}
window.addEventListener("DOMContentLoaded",()=>{
  const token = localStorage.getItem("token");
  if(!token){
    const logoutLink = document.querySelector('a[onclick="logout()"]');
    if(logoutLink) logoutLink.computedStyleMap.display= "none";
  }
})

document.getElementById('sortFilter').addEventListener("change", function(){
  const sortValue = this.value;
  loadPosts(sortValue);

});
async function loadPosts( sort = 'latest'){
  const res = await fetch(`http://localhost:3000/posts?sort=${sort}`);
  const posts = await res.json();
  displayPosts(posts);
}