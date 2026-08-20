//API APPLY- jsonbin.io 
const CLOUD_BIN_ID = '6a868aaff5f4af5e292b98cc'; //jsonbin.io - Bin ID
const CLOUD_API_KEY = '$2a$10$w5VIyUruWU9m6MUBTU0CfOzt484kzkX9Pzf5UEwGEbg8zL346nepO'; // access key id
const CLOUD_URL = `https://api.jsonbin.io/v3/b/${CLOUD_BIN_ID}`;

//Cookie
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

// jQuery
$(document).ready(function () {

    $('#createTeamModal').appendTo('body'); // package out division .screen-area，prevent from overflow:hidden cut

    // create Bootstrap Modal 
    const teamModal = new bootstrap.Modal(document.getElementById('createTeamModal'));

    // Initialization: check cookie and identify current status and team list
    checkLoginStatus();
    loadTeams();

    // automatic restore data from cloud (see the console and local storage -- it will display msg and store data in local) -- in diff computer or application
    restoreFromCloud();

    // display card 
    $('#show-login-btn').click(function () {
        $('#login-card').slideDown();
        $('#signup-card').hide();
    });

    $('#show-signup-btn').click(function () {
        $('#signup-card').slideDown();
        $('#login-card').hide();
    });

    // Sign In
    $('#btn-do-signup').click(function () {
        const username = $('#signup-username').val().trim();
        const password = $('#signup-password').val().trim();

        if (!username || !password) {
            alert("Please enter your username and password correctly.");
            return;
        }

        let users = JSON.parse(localStorage.getItem('registered_users')) || [];
        const existingUser = users.find(u => u.username === username);

        if (existingUser) {
            alert("This acc have been sign in. Pls log in.");
            $('#signup-card').hide();
            $('#login-card').slideDown();
            $('#login-username').val(username);
            $('#login-password').val('');
            return;
        }

        users.push({ username: username, password: password });
        localStorage.setItem('registered_users', JSON.stringify(users));

        // data save to cloud
        syncToCloud();

        alert("Sign In successfully! Pls Log In now. ");
        $('#signup-card').hide();
        $('#login-card').slideDown();
        $('#login-username').val(username);
        $('#login-password').val('');
    });

    //  Log In
    $('#btn-do-login').click(function () {
        const username = $('#login-username').val().trim();
        const password = $('#login-password').val().trim();

        let users = JSON.parse(localStorage.getItem('registered_users')) || [];
        const validUser = users.find(u => u.username === username && u.password === password);

        if (validUser) {
            alert("Log In sucessfully! Welcome back " + username);
            setCookie("logged_in_user", username, 7); // save 7 days
            checkLoginStatus();
        } else {
            alert("Wrong username or password.Pls always ensure you have a account.");
        }
    });

    // When user click Create a Team button（checking log in）
    $('#create-team-btn').click(function () {
        const currentUser = getCookie("logged_in_user");

        if (!currentUser) {
            alert("Please Log In Before Create a Team!");
        } else {
            // When status(log in), team leader=id name, fill in the info
            $('#team-leader').val(currentUser);
            $('#team-form')[0].reset();
            $('#team-leader').val(currentUser); //team leader=id name
            teamModal.show();
        }
    });

    // Store info in Local Storage
    $('#btn-save-team').click(function () {
        const name = $('#team-name').val().trim();
        const game = $('#team-game').val();
        const leader = $('#team-leader').val();
        const members = $('#team-members').val().trim();
        const desc = $('#team-desc').val().trim();

        if (!name || !members) {
            alert("Please Fill In Team Name and Team Member Namelist.");
            return;
        }

        const newTeam = {
            id: Date.now(),
            name: name,
            game: game,
            leader: leader,
            members: members,
            desc: desc || "No description"
        };

        // Read team info, store in Local Storage
        let teams = JSON.parse(localStorage.getItem('club_teams')) || [];
        teams.push(newTeam);
        localStorage.setItem('club_teams', JSON.stringify(teams));

        // automatic save to cloud
        syncToCloud();

        alert("Team " + name + " created sucessfully");
        teamModal.hide();
        loadTeams(); // Reload
    });

    // Log-out function
    $(document).on('click', '#logout-btn', function () {
        deleteCookie("logged_in_user");
        alert("Log Out Sucessfully.");
        checkLoginStatus();
    });

    // Update UI status
    function checkLoginStatus() {
        const currentUser = getCookie("logged_in_user");

        if (currentUser) {
            $('#status-bar')
                .removeClass('alert-info')
                .addClass('alert-success')
                .html(`Welcome back，<strong>${currentUser}</strong>！You are log in now. <button id="logout-btn" class="btn-generic danger small ms-3">Log Out</button>`);
            
            $('#auth-buttons').hide();
            $('#login-card').hide();
            $('#signup-card').hide();
        } else {
            $('#status-bar')
                .removeClass('alert-success')
                .addClass('alert-info')
                .html('Current status：<strong>Haven\'t Log In</strong> (Please Log In)');
            
            $('#auth-buttons').show();
        }
    }

    // Load Card
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
                <div class="team-card">
                    <span class="team-badge">${team.game}</span>
                    <h4>${team.name}</h4>
                    <p class="team-desc">${team.desc}</p>
                    <p class="team-meta"><strong>Leader:</strong> ${team.leader}<br><strong>Members:</strong> ${team.members}</p>
                </div>
            `;
            $container.append(cardHtml);
        });
    }


    // save the user data and team data to cloud
    function syncToCloud() {
        const payload = {
            users: JSON.parse(localStorage.getItem('registered_users')) || [],
            teams: JSON.parse(localStorage.getItem('club_teams')) || []
        };

        $.ajax({
            url: CLOUD_URL,
            method: 'PUT',
            contentType: 'application/json',
            headers: { 'X-Access-Key': CLOUD_API_KEY },
            data: JSON.stringify(payload),
            success: function () {
                console.log('Save successfully');
            },
            error: function () {
                console.warn('Fail to save');
            }
        });
    }

    // restore data from cloud
    function restoreFromCloud() {
        const hasLocalData =
            (JSON.parse(localStorage.getItem('registered_users')) || []).length > 0 ||
            (JSON.parse(localStorage.getItem('club_teams')) || []).length > 0;

        if (hasLocalData) {
            console.log('Data is in local storage, skip the restore from cloud');
            return;
        }

        $.ajax({
            url: CLOUD_URL + '/latest',
            method: 'GET',
            headers: { 'X-Access-Key': CLOUD_API_KEY },
            success: function (response) {
                const data = response.record || {};

                if (Array.isArray(data.users) && data.users.length > 0) {
                    localStorage.setItem('registered_users', JSON.stringify(data.users));
                }
                if (Array.isArray(data.teams) && data.teams.length > 0) {
                    localStorage.setItem('club_teams', JSON.stringify(data.teams));
                    loadTeams();
                }

                console.log('Restore successfully');
            },
            error: function () {
                console.log('Can\'t cannect to cloud');
            }
        });
    }
});