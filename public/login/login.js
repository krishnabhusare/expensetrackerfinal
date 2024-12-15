function login(e){
    e.preventDefault();

    const loginDetails = {
        email:e.target.email.value,
        password:e.target.password.value
    }

    axios.post('http://13.235.90.148:3000/user/login',loginDetails)
    .then(result=>{
       
        alert(result.data.message);
        localStorage.setItem('token',result.data.token);
        window.location.href ='../expense/expense.html';
    })
    .catch(err=>{
       
        document.body.innerHTML += `<div style="color:red">${err.response.data.message}</div>`
    })
}

function forgotpassword(){
    window.location.href = '../forgotpassword/forgot.html';
}