const API = "http://localhost:5000/api";

document
.getElementById("loginForm")
.addEventListener("submit", login);

async function login(e){

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const response =
        await fetch(`${API}/auth/login`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                email,

                password

            })

        });
        const data = await response.json();

if (data.success) {

    // Save JWT
    localStorage.setItem("token", data.token);

    // Save logged-in user
    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

    window.location.href = "index.html";

} else {

    alert(data.message);

}

    // else{

    //     document.getElementById("message").innerHTML =
    //         result.message;

    }