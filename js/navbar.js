// ===== 导航栏 HTML =====
function loadNavbar() {
    const navbarHTML = `
        <header class="navbar">
            <nav class="nav-container">
                <!-- 左边 Logo -->
                <a href="index.html" class="logo-link">
                    <div class="logo-img"></div>
                </a>

                <!-- 导航链接 -->
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="tournament.html">Tournaments</a></li>
                    <li><a href="ranking.html">Rankings</a></li>
                    <li><a href="player.html">Player</a></li>
                    <li><a href="schedule.html">Schedule</a></li>
                    <li><a href="about.html">About Us</a></li>
                </ul>
            </nav>
        </header>
    `;

    // 把导航栏插入到页面最前面（在 #pageContent 里面）
    const pageContent = document.getElementById('pageContent');
    if (pageContent) {
        pageContent.insertAdjacentHTML('afterbegin', navbarHTML);
    }

    // 高亮当前页面
    highlightActiveLink();
}

// ===== 高亮当前页面链接 =====
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

// ===== 页面加载完成后执行 =====
document.addEventListener('DOMContentLoaded', loadNavbar);
console.log('Navbar has ready');