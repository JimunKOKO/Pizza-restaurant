let cartItems=JSON.parse(localStorage.getItem('pizzaCart'))||[];
let orderHistory=JSON.parse(localStorage.getItem('pizzaOrderHistory'))||[];


function user(){
  return JSON.parse(localStorage.getItem('pizzaCurrentUser')||'null')
}

function persistCart(){
  localStorage.setItem('pizzaCart',JSON.stringify(cartItems));
  updateCartBadge()
}

document.addEventListener('DOMContentLoaded',()=>{
  updateAccountUI();updateCartBadge();
  document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();alert('Thank you! Your message has been received in this demo.');e.target.reset()});
});

function updateAccountUI(){
  const u=user();
  document.getElementById('accountBtnText').textContent=u?.name||'Account';
  document.getElementById('accountBtn').href=u?'page.html':'acc.html'
}

function addCart(name,price){let item=cartItems.find(x=>x.name===name);
  if(item)item.quantity++;else cartItems.push({name,price,quantity:1});
  persistCart()
}

function updateCartBadge(){
  document.getElementById('cartCount').textContent=cartItems.reduce((s,x)=>s+x.quantity,0)
}

function cartTotal(){
  return cartItems.reduce((s,x)=>s+x.price*x.quantity,0)
}

function renderCart(){
  let body=document.getElementById('cartModalBody');
  body.replaceChildren();
  if(!cartItems.length){
    body.textContent='Your cart is empty.'
  }else cartItems.forEach((item,i)=>{
    let row=document.createElement('div');
    row.className='d-flex align-items-center justify-content-between border-bottom py-3 gap-2';
    let label=document.createElement('span');
    label.textContent=`${item.name} — $${item.price.toFixed(2)} x ${item.quantity}`;
    row.append(label);for(let [symbol,amount] of [['−',-1],['+',1]]){let btn=document.createElement('button');
      btn.className='btn btn-sm btn-outline-danger';btn.textContent=symbol;
      btn.onclick=()=>changeQuantity(i,amount);row.append(btn)}body.append(row)});
      document.getElementById('cartTotal').textContent='$'+cartTotal().toFixed(2)
    }

function showCart(){
  renderCart();
  bootstrap.Modal.getOrCreateInstance(document.getElementById('cartModal')).show()
}

function changeQuantity(i,amount){
  cartItems[i].quantity+=amount;
  if(cartItems[i].quantity<=0)cartItems.splice(i,1);
  persistCart();renderCart()
}

function removeItem(i)
{
  cartItems.splice(i,1);persistCart();
  renderCart()
}

function clearCart(){
  cartItems=[];
  persistCart();
  renderCart()
}

function checkout(){
  if(!cartItems.length){
    alert('Your cart is empty!');
    return
  }
  const u=user();
  if(!u){
    alert('Please login before checkout.');
    window.location.href='acc.html';
    return
  }
  let history=JSON.parse(localStorage.getItem('pizzaOrderHistory')||'[]');
  history.unshift({id:'ORD-'+Date.now(),date:new Date().toLocaleString(),userId:u.email,items:cartItems.map(x=>({...x})),total:cartTotal()});
  localStorage.setItem('pizzaOrderHistory',JSON.stringify(history));

  orderHistory=history;
  cartItems=[];persistCart();bootstrap.Modal.getOrCreateInstance(document.getElementById('cartModal')).hide();
  alert('Thank you! Your demo order has been saved.')
}

function renderHistory(container){
  container.replaceChildren();
  let u=user();
  let orders=(JSON.parse(localStorage.getItem('pizzaOrderHistory')||'[]')).filter(o=>u&&o.userId===u.email);
  if(!orders.length){container.textContent='No past orders found.';
    return
  }
  orders.forEach(order=>{let card=document.createElement('div');
    card.className='card mb-3 p-3';
    let title=document.createElement('strong');
    title.textContent=order.id+' — '+order.date;
    card.append(title);order.items.forEach(item=>{
      let p=document.createElement('div');
      p.textContent=`${item.name} * ${item.quantity} - $${(item.price*item.quantity).toFixed(2)}`;card.append(p)});
      let total=document.createElement('b');
      total.textContent='Total: $'+Number(order.total).toFixed(2);
      card.append(total);container.append(card)})
    }

function showHistory(){
  renderHistory(document.getElementById('historyModalBody'));
  bootstrap.Modal.getOrCreateInstance(document.getElementById('historyModal')).show()
}

function clearHistory(){
  if(!confirm('Clear your order history?'))return;
  let u=user();
  if(!u)return;
  let all=JSON.parse(localStorage.getItem('pizzaOrderHistory')||'[]');
  localStorage.setItem('pizzaOrderHistory',JSON.stringify(all.filter(o=>o.userId!==u.email)));
  showHistory()
}
function filterPizza(type){
  document.querySelectorAll('.pizza').forEach(el=>el.style.display=type==='all'||el.dataset.type===type?'':'none')
}

function claimOffer(){
  alert('Pizza Night Offer: Buy 2 large pizzas and get 1 classic pizza FREE! (Promotion demo only)')
}
