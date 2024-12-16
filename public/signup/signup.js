function signup(event){
    event.preventDefault();

    const signupdetails = {
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value
    }
    
    axios.post('http://3.109.208.122:3000/user/signup',signupdetails)
    .then(result=>{
        window.location.href = '../login/login.html';
    })
    .catch(err=>{
        document.body.innerHTML += `<div style="color:red">${err}</div>`;
    })
};