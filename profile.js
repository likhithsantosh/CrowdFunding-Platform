const token = localStorage.getItem("token");

window.addEventListener("DOMContentLoaded", async ()=>{
    if(!token){
        alert('please login first');
        window.location.href="/html/home.html";
        return;
    }
    try{
        const res = await fetch("http://localhost:3000/user/posts",{
            method: "GET",
            headers: {
                "Authorization":token
            }
        });
        const posts = await res.json();

        const container = document.getElementById("profilePosts");
        if(posts.length === 0){
            container.innerHTML= "<p> No posts created yet</p>";
            return;
        }
        posts.forEach(post =>{
            const box = document.createElement("div");
            box.className="profile-post";
            box.innerHTML= `
            <h3>${post.title}</h3>
            <img src="${post.image}" alt="Post Image" style="width:100%; height:150px; object-fit:cover;">
            <p><strong>Category:</strong> ${post.category}</p>
            <p><strong>Description:</strong> ${post.description}</p>
            <p><strong>Target:</strong> ${post.targetFunds}</p>
            <p><strong>Raised:</strong> ${post.raisedFunds || 0}</p>
            <p><strong>Deadline:</strong> ${post.deadline}</p> 
            `;
            container.appendChild(box);
        });

    }
    catch(error){
        console.error("error fetching user posts", error);
    }
});

function logout(){
    localStorage.removeItem("token");
    window.location.href="/html/home.html";
}