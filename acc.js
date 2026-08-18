// ==================== Cookie 工具函式 ====================
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// ==================== 頁面邏輯 (jQuery) ====================
$(document).ready(function () {

    // 建立 Bootstrap Modal 實例
    const teamModal = new bootstrap.Modal(document.getElementById('createTeamModal'));

    // 1. 初始化頁面：檢查 Cookie 登入狀態與載入戰隊清單
    checkLoginStatus();
    loadTeams();

    // 2. 切換表單顯示
    $('#show-login-btn').click(function () {
        $('#login-card').slideDown();
        $('#signin-card').hide();
    });

    $('#show-signin-btn').click(function () {
        $('#signin-card').slideDown();
        $('#login-card').hide();
    });

    // 3. 執行 Sign In (註冊) 邏輯
    $('#btn-do-signin').click(function () {
        const username = $('#signin-username').val().trim();
        const password = $('#signin-password').val().trim();

        if (!username || !password) {
            alert("請完整輸入帳號與密碼！");
            return;
        }

        let users = JSON.parse(localStorage.getItem('registered_users')) || [];
        const existingUser = users.find(u => u.username === username);

        if (existingUser) {
            alert("⚠️ This acc have been sign in. Pls log in.");
            $('#signin-card').hide();
            $('#login-card').slideDown();
            $('#login-username').val(username);
            $('#login-password').val('');
            return;
        }

        users.push({ username: username, password: password });
        localStorage.setItem('registered_users', JSON.stringify(users));

        alert("Sign In successfully! Pls log in now. ");
        $('#signin-card').hide();
        $('#login-card').slideDown();
        $('#login-username').val(username);
        $('#login-password').val('');
    });

    // 4. 執行 Log In (登入) 邏輯
    $('#btn-do-login').click(function () {
        const username = $('#login-username').val().trim();
        const password = $('#login-password').val().trim();

        let users = JSON.parse(localStorage.getItem('registered_users')) || [];
        const validUser = users.find(u => u.username === username && u.password === password);

        if (validUser) {
            alert("Log In sucessfully! Welcome back " + username);
            setCookie("logged_in_user", username, 7); // 存入 Cookie 7 天
            checkLoginStatus();
        } else {
            alert("Wrong username or password.Pls always ensure you have a account.");
        }
    });

    // 5. 點擊 Create a Team 按鈕（阻擋與彈窗邏輯）
    $('#create-team-btn').click(function () {
        const currentUser = getCookie("logged_in_user");

        if (!currentUser) {
            alert("Pls Log In Before Create a Team!");
        } else {
            // 已登入：將隊長欄位寫入當前登入者，並彈出 Modal 表單
            $('#team-leader').val(currentUser);
            $('#team-form')[0].reset();
            $('#team-leader').val(currentUser); // 重置表單後重新填入隊長
            teamModal.show();
        }
    });

    // 6. 儲存戰隊資料至 Local Storage
    $('#btn-save-team').click(function () {
        const name = $('#team-name').val().trim();
        const game = $('#team-game').val();
        const leader = $('#team-leader').val();
        const members = $('#team-members').val().trim();
        const desc = $('#team-desc').val().trim();

        if (!name || !members) {
            alert("Pls Fill In Team Name and Team Namelist.");
            return;
        }

        const newTeam = {
            id: Date.now(),
            name: name,
            game: game,
            leader: leader,
            members: members,
            desc: desc || "無簡介"
        };

        // 讀取舊戰隊資料，合併後存回 Local Storage
        let teams = JSON.parse(localStorage.getItem('club_teams')) || [];
        teams.push(newTeam);
        localStorage.setItem('club_teams', JSON.stringify(teams));

        alert("Team" + name + "created sucessfully");
        teamModal.hide();
        loadTeams(); // 重新渲染頁面上的戰隊清單
    });

    // 7. 登出功能
    $(document).on('click', '#logout-btn', function () {
        deleteCookie("logged_in_user");
        alert("您已成功 Log Out 登出。");
        checkLoginStatus();
    });

    // 更新 UI 狀態
    function checkLoginStatus() {
        const currentUser = getCookie("logged_in_user");

        if (currentUser) {
            $('#status-bar')
                .removeClass('alert-info')
                .addClass('alert-success')
                .html(`Welcome back，<strong>${currentUser}</strong>！You are log in now. <button id="logout-btn" class="btn btn-sm btn-outline-danger ms-3">Log Out (登出)</button>`);
            
            $('#auth-buttons').hide();
            $('#login-card').hide();
            $('#signin-card').hide();
        } else {
            $('#status-bar')
                .removeClass('alert-success')
                .addClass('alert-info')
                .html('Current status：<strong>Haven\'t Log In</strong> (Pls log in)');
            
            $('#auth-buttons').show();
        }
    }

    // 動態載入並渲染戰隊卡片
    function loadTeams() {
        let teams = JSON.parse(localStorage.getItem('club_teams')) || [];
        const $container = $('#team-list');
        $container.empty();

        if (teams.length === 0) {
            $container.html('<p class="text-secondary">Create your first team.</p>');
            return;
        }

        teams.forEach(team => {
            const cardHtml = `
                <div class="col-md-6 col-lg-4">
                    <div class="card bg-secondary text-white h-100 shadow border-0">
                        <div class="card-body">
                            <span class="badge bg-danger mb-2">${team.game}</span>
                            <h4 class="card-title">${team.name}</h4>
                            <p class="card-text text-light small mb-2">${team.desc}</p>
                            <hr class="border-light">
                            <p class="mb-1"><strong>Team Leader: </strong> ${team.leader}</p>
                            <p class="mb-0"><strong>Team member: </strong> ${team.members}</p>
                        </div>
                    </div>
                </div>
            `;
            $container.append(cardHtml);
        });
    }
});