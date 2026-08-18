function loadNavbar() {
    const navbarHTML = `
        <header class="navbar">
            <nav class="nav-container">
                <a href="index.html" class="logo-link">
                    <div class="logo-img"></div>
                </a>

                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="ranking.html">Rankings</a></li>
                    <li><a href="player.html">Player</a></li>
                    <li><a href="schedule.html">Schedule</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="account.html">Account</a></li>
                </ul>
            </nav>
        </header>
    `;


    const pageContent = document.getElementById('pageContent');
    if (pageContent) {
        pageContent.insertAdjacentHTML('afterbegin', navbarHTML);
    }

    highlightActiveLink();
}

function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', loadNavbar);