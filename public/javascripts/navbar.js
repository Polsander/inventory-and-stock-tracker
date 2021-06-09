
// This is a DOM manipulation so that the navbar can highlight the nav-link depending on what page the user is on.

function pageLocation() {
    const currentUrl = window.location.pathname;

    
    if ((currentUrl === '/login') || (currentUrl === '/')) {
        
        document.querySelector('#login').classList.add('active');
    }
    if (currentUrl === '/register') {
        document.querySelector('#register').classList.add('active');
    }
    if (currentUrl === '/admin/dashboard') {
        document.querySelector('#admin').classList.add('active');
    }
    if (currentUrl.slice(0,9) === '/cabinets') {
        document.querySelector('#cabinets').classList.add('active');
    }
    if (currentUrl.slice(0,6) === '/units') {
        document.querySelector('#units').classList.add('active');
    }
    if (currentUrl === '/reports') {
        document.querySelector('#reports').classList.add('active');
    }
}

pageLocation();