let currentUser=JSON.parse(localStorage.getItem('pizzaCurrentUser')||'null');

if(!currentUser){window.location.replace('acc.html')}else document.addEventListener('DOMContentLoaded',initDashboard);

function orders(){
    return (JSON.parse(localStorage.getItem('pizzaOrderHistory')||'[]')).filter(o=>o.userId===currentUser.email)
}

function initDashboard(){

    document.getElementById('sidebarUserName').textContent=currentUser.name;
    document.getElementById('sidebarUserEmail').textContent=currentUser.email;
    document.getElementById('formName').value=currentUser.name;
    document.getElementById('formEmail').value=currentUser.email;
    document.getElementById('formPhone').value=currentUser.phone||'';
    let list=orders();
    document.getElementById('totalOrdersCount').textContent=list.length;
    document.getElementById('totalSpentAmount').textContent='$'+list.reduce((s,o)=>s+Number(o.total),0).toFixed(2);
    renderOrders();document.getElementById('addressInput').value=currentUser.address||'';
    document.getElementById('savedAddress').textContent=currentUser.address||'No saved address';
    document.getElementById('promoEmails').checked=!!currentUser.promo;
    document.getElementById('smsNotifications').checked=!!currentUser.sms;
    if(location.hash==='#orders'){bootstrap.Tab.getOrCreateInstance(document.getElementById('orders-tab')).show()}
};
function renderOrders(){
    let container=document.getElementById('ordersListContainer');container.replaceChildren();
    let list=orders();
    if(!list.length){
        container.textContent='You have not placed any orders yet.';
        return
    }
        list.forEach(o=>{let card=document.createElement('div');card.className='card p-3 mb-3';
            let heading=document.createElement('strong');
            heading.textContent=o.id+' — '+o.date;
            card.append(heading);
            o.items.forEach(i=>{ let line=document.createElement('p');line.className='mb-1';
            line.textContent=`${i.name} * ${i.quantity} - $${(i.price*i.quantity).toFixed(2)}`;
            card.append(line)});let total=document.createElement('b');
            total.textContent='Total: $'+Number(o.total).toFixed(2);card.append(total);
            container.append(card)})
    }

function saveUser(){
    localStorage.setItem('pizzaCurrentUser',JSON.stringify(currentUser));
    let accounts=JSON.parse(localStorage.getItem('pizzaDemoAccounts')||'[]');
    let account=accounts.find(a=>a.email===currentUser.email);
    if(account){account.name=currentUser.name;
        localStorage.setItem('pizzaDemoAccounts',JSON.stringify(accounts))}
}

document.getElementById('profileForm').onsubmit=e=>{e.preventDefault();

let oldEmail=currentUser.email,newEmail=document.getElementById('formEmail').value.trim().toLowerCase();
let accounts=JSON.parse(localStorage.getItem('pizzaDemoAccounts')||'[]');
if(newEmail!==oldEmail&&accounts.some(a=>a.email===newEmail))return alert('Email already used');
let account=accounts.find(a=>a.email===oldEmail);

if(account)
{
    account.email=newEmail;account.name=document.getElementById('formName').value.trim();
localStorage.setItem('pizzaDemoAccounts',JSON.stringify(accounts))
}
let history=JSON.parse(localStorage.getItem('pizzaOrderHistory')||'[]');

history.forEach(o=>{if(o.userId===oldEmail)o.userId=newEmail});
localStorage.setItem('pizzaOrderHistory',JSON.stringify(history));

currentUser.name=document.getElementById('formName').value.trim();
currentUser.email=newEmail;
currentUser.phone=document.getElementById('formPhone').value.trim();
saveUser();

initDashboard();
alert('Profile saved!')};
document.getElementById('addressForm').onsubmit=e=>{e.preventDefault();
currentUser.address=document.getElementById('addressInput').value.trim();
saveUser();
initDashboard();
alert('Address saved')};

document.getElementById('savePrefs').onclick=()=>{currentUser.promo=document.getElementById('promoEmails').checked;
    currentUser.sms=document.getElementById('smsNotifications').checked;saveUser();
alert('Preferences saved')};

document.getElementById('logoutBtn').onclick=()=>{localStorage.removeItem('pizzaCurrentUser');
    window.location.href='acc.html'};