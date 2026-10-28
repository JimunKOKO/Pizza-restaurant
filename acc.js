const form = document.getElementById('authForm');
const toggle = document.getElementById('toggleAuth');
let registering = false;

function render() {
    let u = JSON.parse(localStorage.getItem('pizzaCurrentUser') || 'null');


    form.hidden = !!u;
    toggle.parentElement.hidden = !!u;
    document.getElementById('loggedIn').hidden = !u;

    if (u) {
        document.getElementById('welcome').textContent = 'Welcome, ' + u.name;
        return;
    }

    document.getElementById('nameGroup').hidden = !registering;
    document.getElementById('authName').required = registering;
    document.getElementById('submitBtn').textContent = registering ? 'Register' : 'Login';
    document.getElementById('authSubtitle').textContent = registering ? 'Create an account' : 'Login to your account';
    toggle.textContent = registering ? 'Already have an account? Login' : 'Create an account';
}

toggle.onclick = e => {
    e.preventDefault();
    registering = !registering;
    render();
};


form.onsubmit = e => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value.trim().toLowerCase();
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('authName').value.trim();

    let accounts = JSON.parse(localStorage.getItem('pizzaDemoAccounts') || '[]');
    let account;

    if (registering) {
        if (!name) return alert('Enter your name');
        if (accounts.some(a => a.email === email)) return alert('Email already registered');
        
        account = { name, email, password };
        accounts.push(account);
        localStorage.setItem('pizzaDemoAccounts', JSON.stringify(accounts));
    } else {
        account = accounts.find(a => a.email === email && a.password === password);
        if (!account) return alert('Incorrect email or password');
    }

  
    localStorage.setItem('pizzaCurrentUser', JSON.stringify({ name: account.name, email: account.email }));
    
    form.reset();
    render();
};


document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('pizzaCurrentUser');
    render(); // Instantly updates UI to show the login form again
};
render();