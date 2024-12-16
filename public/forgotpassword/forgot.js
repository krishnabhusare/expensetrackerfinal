function forgotpasswor(event){
  event.preventDefault();
  const userDetails ={email: event.target.email.value};
 

  axios.post('http://3.109.208.122:3000/password/forgotpassword',userDetails).then(result=>{
    document.body.innerHTML += `<div style='color:green'>mail sent successfully</div>`;
}).catch(err=>{
    document.body.innerHTML += `<div style='color:red'>${err}</div>`
})
};

