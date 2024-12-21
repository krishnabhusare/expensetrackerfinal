


function expense(e) {
    e.preventDefault();

    const expenseDetails = {
        amount: e.target.amount.value,
        description: e.target.description.value,
        category: e.target.category.value
    }
    const token = localStorage.getItem('token');
    axios.post('http://15.207.20.132:3000/expense/add-expense', expenseDetails, { headers: { Authorization: token } })
        .then(result => {

            addExpenseToUi(result.data.expenseData);
        })
        .catch(err => {
            document.body.innerHTML += `<div style="color:red">${err}</div>`
        })
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const isadmin = parseJwt(token);
    if(isadmin.ispremiumuser){
        document.getElementById('premium').remove();
        document.getElementById('message').innerHTML = 'you are a premium user now <button onclick="leadeboard(event)">show leaderboard</button>';
       
    }



    axios.get('http://15.207.20.132:3000/expense/get-expense', { headers: { "Authorization": token } })
        .then(result => {

            for (let i = 0; i < result.data.allExpense.length; i++) {
                addExpenseToUi(result.data.allExpense[i]);
            }
        })
})

function addExpenseToUi(obj) {
    const parentElement = document.getElementById('expenslist');
    listId = `expense-${obj.id}`;
    parentElement.innerHTML += `
     <li id=${listId}>
        ${obj.amount}---${obj.description}---${obj.category}
        <button onclick = "deleteExpenseFromUi(event,${obj.id})">Delete</button>
     </li>`

};

function deleteExpenseFromUi(e, obj) {
    const token = localStorage.getItem('token');

    axios.delete(`http://15.207.20.132:3000/expense/delete-expense/${obj}`, { headers: { Authorization: token } });
    const parentElement = document.getElementById(`expense-${obj}`);

    parentElement.remove();

}


function rzp(e) {
    const token = localStorage.getItem('token');


    axios.get('http://15.207.20.132:3000/premium/buy-premium', { headers: { Authorization: token } })
        .then(result => {
            const options = {
                key_id: result.data.key_id,
                order_id: result.data.order.id,
                handler: async function (result) {
                    const res = await axios.post('http://15.207.20.132:3000/premium/updatetransictionstatus', {
                        order_id: options.order_id,
                        payment_id: result.razorpay_payment_id,
                    }, { headers: { Authorization: token } });

                    alert('you are a premium user now');
                  
                    
                    

                    document.getElementById('premium').remove();
                    document.getElementById('message').innerHTML = 'you are a premium user now <button onclick="leadeboard(event)">show leaderboard</button>';

                    
                    
                   
                    localStorage.setItem('token',res.data.token);








                }
            }

            const rzp1 = new Razorpay(options);

            rzp1.open();
            e.preventDefault();

            rzp1.on('payment.failed', function (result) {
                console.log('>>>', result);
                alert('something went wrong');
            });

        })


}

async function leadeboard(event){
    try{
        const token = localStorage.getItem('token');

    
     

   const leaderboarddata = await  axios.get('http://15.207.20.132:3000/premium/showleaderboard',{headers:{Authorization:token}});
       document.getElementById('leaderboard').innerHTML +=`<h1>Leaderboard</h1>`;
       
       leaderboarddata.data.leaderboard.forEach(element => {
        document.getElementById('leaderboard').innerHTML +=`<li>name:${element.name}--totalexpense:${element.totalexpense}</li>`
       });
    

    }
   
    
    catch(err){
        console.log(err);
    }
    
}


function download(){
    const token = localStorage.getItem('token');
    axios.get('http://15.207.20.132:3000/expense/download',{headers:{Authorization:token}})
    .then(response=>{
        if(response.status===200){
            var a = document.createElement('a');
            a.href = response.data.fileUrl;
            // a.download = 'myexpense.csv';
            a.click();
            
            

            document.getElementById('downloadedfile').innerHTML=`<li>
                        <a href="${response.data.fileUrl}">${response.data.files.filename}
                        </a>
                      </li>`
        }else{
          throw new Error('something went wrong');   
        }
    }).catch(err=>{
        console.log(err);
    })
}










