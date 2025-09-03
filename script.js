// Replace this with your actual Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSIu_8Q2HLVWVWAexqnyH5BTb5uQL1JemC8aoSk7sL3m61HbEP6sOiOU0-sZHXKRn_Ow/exec';

// Replace these with your actual URLs for consent and report
const CONSENT_URL = 'https://script.google.com/a/macros/pietos.com/s/AKfycbyQ7vIk8Mpr_lyd7xoY6_PVP6-PvtL8US7EX3EfU1GH6Rn4AXp1EcFGEQnAFqscqWA/exec'; // Replace with your consent URL
const REPORT_URL = 'https://script.google.com/a/macros/pietos.com/s/AKfycbz5-mX9g25HmJnuQ2DyVRp98-PsKZMz3XzNyH84bvfm8y15SWHP0jMUYaYVD9rEbHvD/exec'; // Replace with your report URL

document.addEventListener('DOMContentLoaded', function() {
    // A simple key for XOR encryption. In a real app, this should be more complex and secure.
    const XOR_KEY = 42; 

    // Encryption and Decryption functions for password storage
    function encrypt(str) {
        return btoa(str.split('').map(char => String.fromCharCode(char.charCodeAt(0) ^ XOR_KEY)).join(''));
    }

    function decrypt(str) {
        return atob(str).split('').map(char => String.fromCharCode(char.charCodeAt(0) ^ XOR_KEY)).join('');
    }

    // Load users from localStorage or initialize with default users
    let users = [];
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Simulated user database with encrypted passwords
        users = [{
            username: 'admin',
            password: encrypt('first_time_password'),
            role: 'admin'
        }, {
            username: 'user1',
            password: encrypt('password123'),
            role: 'user'
        }];
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Get elements
    const aadhaarCard = document.getElementById('aadhaar-card');
    const panCard = document.getElementById('pan-card');
    const dlCard = document.getElementById('dl-card');
    const aadhaarModal = document.getElementById('aadhaar-modal');
    const panModal = document.getElementById('pan-modal');
    const dlModal = document.getElementById('dl-modal');
    const consentModal = document.getElementById('consent-modal');
    const panConsentModal = document.getElementById('pan-consent-modal');
    const dlConsentModal = document.getElementById('dl-consent-modal');
    const detailsModal = document.getElementById('details-modal');
    const panDetailsModal = document.getElementById('pan-details-modal');
    const dlDetailsModal = document.getElementById('dl-details-modal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const sendConsentBtn = document.getElementById('send-consent-btn');
    const panSendConsentBtn = document.getElementById('pan-send-consent-btn');
    const dlSendConsentBtn = document.getElementById('dl-send-consent-btn');
    const redirectDigilockerBtn = document.getElementById('redirect-digilocker');
    const panRedirectDigilockerBtn = document.getElementById('pan-redirect-digilocker');
    const dlRedirectDigilockerBtn = document.getElementById('dl-redirect-digilocker');
    const closeDetailsBtn = document.getElementById('close-details-btn');
    const closePanDetailsBtn = document.getElementById('close-pan-details-btn');
    const closeDlDetailsBtn = document.getElementById('close-dl-details-btn');
    const userEmail = document.getElementById('user-email');
    const userMobile = document.getElementById('user-mobile');
    const panUserEmail = document.getElementById('pan-user-email');
    const panUserMobile = document.getElementById('pan-user-mobile');
    const dlUserEmail = document.getElementById('dl-user-email');
    const dlUserMobile = document.getElementById('dl-user-mobile');
    const consentSpinner = document.getElementById('consent-spinner');
    const panConsentSpinner = document.getElementById('pan-consent-spinner');
    const dlConsentSpinner = document.getElementById('dl-consent-spinner');
    const consentContent = document.getElementById('consent-content');
    const panConsentContent = document.getElementById('pan-consent-content');
    const dlConsentContent = document.getElementById('dl-consent-content');
    const emailError = document.getElementById('email-error');
    const mobileError = document.getElementById('mobile-error');
    const panEmailError = document.getElementById('pan-email-error');
    const panMobileError = document.getElementById('pan-mobile-error');
    const dlEmailError = document.getElementById('dl-email-error');
    const dlMobileError = document.getElementById('dl-mobile-error');

    const loginBtn = document.getElementById('login-btn');
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const loginModal = document.getElementById('login-modal');
    const adminPanelModal = document.getElementById('admin-panel-modal');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const loginError = document.getElementById('login-error');
    const initialPage = document.getElementById('initial-page');
    const mainPortal = document.getElementById('main-portal');

    const newUsernameInput = document.getElementById('new-username');
    const newPasswordInput = document.getElementById('new-password');
    const addUserBtn = document.getElementById('add-user-btn');
    const userTableBody = document.getElementById('user-table-body');
    const addUserError = document.getElementById('add-user-error');

    const adminCurrentPasswordInput = document.getElementById('admin-current-password');
    const adminNewPasswordInput = document.getElementById('admin-new-password');
    const adminConfirmPasswordInput = document.getElementById('admin-confirm-password');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordChangeError = document.getElementById('password-change-error');
    
    const viewConsentBtn = document.getElementById('view-consent-btn');
    const viewReportBtn = document.getElementById('view-report-btn');
    
    let currentUser = null;

    // Open login modal
    loginBtn.addEventListener('click', function() {
        if (loginBtn.textContent === 'Logout') {
            handleLogout();
        } else {
            loginModal.style.display = 'flex';
            loginError.style.display = 'none';
        }
    });

    // Open admin panel modal
    adminPanelBtn.addEventListener('click', function() {
        if (currentUser && currentUser.role === 'admin') {
            renderUserTable();
            adminPanelModal.style.display = 'flex';
        } else {
            alert('You must be an admin to access this panel.');
        }
    });

    // Handle login logic
    loginSubmitBtn.addEventListener('click', function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.username === username);

        if (user && decrypt(user.password) === password) {
            currentUser = user;
            loginModal.style.display = 'none';
            initialPage.style.display = 'none';
            mainPortal.style.display = 'block';
            loginBtn.textContent = 'Logout';

            if (currentUser.role === 'admin') {
                adminPanelBtn.style.display = 'inline-block';
            } else {
                adminPanelBtn.style.display = 'none';
            }

            // Clear login fields
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';

        } else {
            loginError.style.display = 'block';
        }
    });

    // Handle logout
    function handleLogout() {
        currentUser = null;
        loginBtn.textContent = 'Login';
        adminPanelBtn.style.display = 'none';
        mainPortal.style.display = 'none';
        initialPage.style.display = 'block';
    }

    // Auto-generate password for new user
    function generatePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // Handle Add User logic
    addUserBtn.addEventListener('click', function() {
        const newUsername = newUsernameInput.value.trim();
        addUserError.style.display = 'none';

        if (!newUsername) {
            addUserError.textContent = 'Username cannot be empty';
            addUserError.style.display = 'block';
            return;
        }

        if (users.some(user => user.username === newUsername)) {
            addUserError.textContent = 'Username already exists';
            addUserError.style.display = 'block';
            return;
        }

        const newPassword = generatePassword();
        const newUser = {
            username: newUsername,
            password: encrypt(newPassword),
            role: 'user'
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        newUsernameInput.value = '';
        newPasswordInput.value = newPassword;
        renderUserTable();
        alert(`New user created: ${newUsername} with password ${newPassword}`);
    });

    // Handle Delete User logic
    function deleteUser(username) {
        if (username === 'admin') {
            alert("Admin user cannot be deleted.");
            return;
        }
        users = users.filter(user => user.username !== username);
        localStorage.setItem('users', JSON.stringify(users));
        renderUserTable();
        alert(`User ${username} deleted.`);
    }

    // Handle Change Password logic for Admin
    changePasswordBtn.addEventListener('click', function() {
        const currentPassword = adminCurrentPasswordInput.value;
        const newPassword = adminNewPasswordInput.value;
        const confirmPassword = adminConfirmPasswordInput.value;
        passwordChangeError.style.display = 'none';

        const adminUser = users.find(u => u.username === 'admin');

        if (currentPassword !== decrypt(adminUser.password)) {
            passwordChangeError.textContent = 'Incorrect current password.';
            passwordChangeError.style.display = 'block';
            return;
        }

        if (newPassword.length < 6) {
            passwordChangeError.textContent = 'New password must be at least 6 characters long.';
            passwordChangeError.style.display = 'block';
            return;
        }

        if (newPassword !== confirmPassword) {
            passwordChangeError.textContent = 'New passwords do not match.';
            passwordChangeError.style.display = 'block';
            return;
        }

        adminUser.password = encrypt(newPassword);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Admin password changed successfully!');

        // Clear password fields
        adminCurrentPasswordInput.value = '';
        adminNewPasswordInput.value = '';
        adminConfirmPasswordInput.value = '';
    });

    // Render user table
    function renderUserTable() {
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            const actionsHtml = user.role !== 'admin' ?
                `<td><button onclick="deleteUser('${user.username}')">Delete</button></td>` :
                `<td>N/A</td>`;

            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${decrypt(user.password)}</td>
                ${actionsHtml}
            `;
            userTableBody.appendChild(row);
        });
    }

    // Open Consent Data in new tab when button is clicked
    viewConsentBtn.addEventListener('click', function() {
        if (currentUser) {
            window.open(CONSENT_URL, '_blank');
        } else {
            alert('Please log in to view consent data.');
        }
    });

    // Open Final Report in new tab when button is clicked
    viewReportBtn.addEventListener('click', function() {
        if (currentUser) {
            window.open(REPORT_URL, '_blank');
        } else {
            alert('Please log in to view the final report.');
        }
    });
    
    // Open Aadhaar modal when card is clicked
    aadhaarCard.addEventListener('click', function() {
        if (currentUser) {
            aadhaarModal.style.display = 'flex';
        } else {
            alert('Please log in to verify documents.');
        }
    });

    // Open PAN modal when card is clicked
    panCard.addEventListener('click', function() {
        if (currentUser) {
            panModal.style.display = 'flex';
        } else {
            alert('Please log in to verify documents.');
        }
    });

    // Open DL modal when card is clicked
    dlCard.addEventListener('click', function() {
        if (currentUser) {
            dlModal.style.display = 'flex';
        } else {
            alert('Please log in to verify documents.');
        }
    });

    // Close modals when X is clicked
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Validate email or mobile before sending consent for Aadhaar
    sendConsentBtn.addEventListener('click', function() {
        const email = userEmail.value.trim();
        const mobile = userMobile.value.trim();

        // Reset error messages
        emailError.style.display = 'none';
        mobileError.style.display = 'none';

        if (!email && !mobile) {
            emailError.style.display = 'block';
            mobileError.style.display = 'block';
            return;
        }

        if (mobile && !/^\d{10}$/.test(mobile)) {
            mobileError.style.display = 'block';
            return;
        }

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            emailError.style.display = 'block';
            return;
        }

        // Show loading in consent modal
        aadhaarModal.style.display = 'none';
        consentModal.style.display = 'flex';
        consentSpinner.style.display = 'block';
        consentContent.style.display = 'none';

        // Send data to Google Apps Script
        const formData = new FormData();
        formData.append('email', email);
        formData.append('mobile', mobile);
        formData.append('action', 'send_consent');
        formData.append('document_type', 'aadhaar');

        fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show success message
                    consentSpinner.style.display = 'none';
                    consentContent.style.display = 'block';
                } else {
                    alert('Error sending consent link: ' + data.message);
                    consentModal.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error sending consent link. Please try again.');
                consentModal.style.display = 'none';
            });
    });

    // Validate email or mobile before sending consent for PAN
    panSendConsentBtn.addEventListener('click', function() {
        const email = panUserEmail.value.trim();
        const mobile = panUserMobile.value.trim();

        // Reset error messages
        panEmailError.style.display = 'none';
        panMobileError.style.display = 'none';

        if (!email && !mobile) {
            panEmailError.style.display = 'block';
            panMobileError.style.display = 'block';
            return;
        }

        if (mobile && !/^\d{10}$/.test(mobile)) {
            panMobileError.style.display = 'block';
            return;
        }

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            panEmailError.style.display = 'block';
            return;
        }

        // Show loading in consent modal
        panModal.style.display = 'none';
        panConsentModal.style.display = 'flex';
        panConsentSpinner.style.display = 'block';
        panConsentContent.style.display = 'none';

        // Send data to Google Apps Script
        const formData = new FormData();
        formData.append('email', email);
        formData.append('mobile', mobile);
        formData.append('action', 'send_consent');
        formData.append('document_type', 'pan');

        fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show success message
                    panConsentSpinner.style.display = 'none';
                    panConsentContent.style.display = 'block';
                } else {
                    alert('Error sending consent link: ' + data.message);
                    panConsentModal.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error sending consent link. Please try again.');
                panConsentModal.style.display = 'none';
            });
    });

    // Validate email or mobile before sending consent for DL
    dlSendConsentBtn.addEventListener('click', function() {
        const email = dlUserEmail.value.trim();
        const mobile = dlUserMobile.value.trim();

        // Reset error messages
        dlEmailError.style.display = 'none';
        dlMobileError.style.display = 'none';

        if (!email && !mobile) {
            dlEmailError.style.display = 'block';
            dlMobileError.style.display = 'block';
            return;
        }

        if (mobile && !/^\d{10}$/.test(mobile)) {
            dlMobileError.style.display = 'block';
            return;
        }

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            dlEmailError.style.display = 'block';
            return;
        }

        // Show loading in consent modal
        dlModal.style.display = 'none';
        dlConsentModal.style.display = 'flex';
        dlConsentSpinner.style.display = 'block';
        dlConsentContent.style.display = 'none';

        // Send data to Google Apps Script
        const formData = new FormData();
        formData.append('email', email);
        formData.append('mobile', mobile);
        formData.append('action', 'send_consent');
        formData.append('document_type', 'dl');

        fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show success message
                    dlConsentSpinner.style.display = 'none';
                    dlConsentContent.style.display = 'block';
                } else {
                    alert('Error sending consent link: ' + data.message);
                    dlConsentModal.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error sending consent link. Please try again.');
                dlConsentModal.style.display = 'none';
            });
    });

    // Redirect to Digilocker for Aadhaar
    redirectDigilockerBtn.addEventListener('click', function() {
        // Open DigiLocker authorization in a new window
        const authWindow = window.open(getAuthorizationUrl(), '_blank');

        // Show the details modal after a delay (simulating verification)
        consentModal.style.display = 'none';

        // Show loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.display = 'block';
        detailsModal.querySelector('.modal-body').prepend(spinner);
        detailsModal.querySelector('.success-message').style.display = 'none';
        detailsModal.querySelector('.aadhaar-details').style.display = 'none';
        detailsModal.style.display = 'flex';

        // Check if the auth window is closed (user completed the process)
        const checkAuthWindow = setInterval(function() {
            if (authWindow.closed) {
                clearInterval(checkAuthWindow);

                // Simulate verification process
                setTimeout(function() {
                    spinner.style.display = 'none';
                    detailsModal.querySelector('.success-message').style.display = 'block';
                    detailsModal.querySelector('.aadhaar-details').style.display = 'block';
                }, 2000);
            }
        }, 1000);
    });

    // Redirect to Digilocker for PAN
    panRedirectDigilockerBtn.addEventListener('click', function() {
        // Open DigiLocker authorization in a new window
        const authWindow = window.open(getAuthorizationUrl(), '_blank');

        // Show the details modal after a delay (simulating verification)
        panConsentModal.style.display = 'none';

        // Show loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.display = 'block';
        panDetailsModal.querySelector('.modal-body').prepend(spinner);
        panDetailsModal.querySelector('.success-message').style.display = 'none';
        panDetailsModal.querySelector('.pan-details').style.display = 'none';
        panDetailsModal.style.display = 'flex';

        // Check if the auth window is closed (user completed the process)
        const checkAuthWindow = setInterval(function() {
            if (authWindow.closed) {
                clearInterval(checkAuthWindow);

                // Simulate verification process
                setTimeout(function() {
                    spinner.style.display = 'none';
                    panDetailsModal.querySelector('.success-message').style.display = 'block';
                    panDetailsModal.querySelector('.pan-details').style.display = 'block';
                }, 2000);
            }
        }, 1000);
    });

    // Redirect to Digilocker for DL
    dlRedirectDigilockerBtn.addEventListener('click', function() {
        // Open DigiLocker authorization in a new window
        const authWindow = window.open(getAuthorizationUrl(), '_blank');

        // Show the details modal after a delay (simulating verification)
        dlConsentModal.style.display = 'none';

        // Show loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.display = 'block';
        dlDetailsModal.querySelector('.modal-body').prepend(spinner);
        dlDetailsModal.querySelector('.success-message').style.display = 'none';
        dlDetailsModal.querySelector('.dl-details').style.display = 'none';
        dlDetailsModal.style.display = 'flex';

        // Check if the auth window is closed (user completed the process)
        const checkAuthWindow = setInterval(function() {
            if (authWindow.closed) {
                clearInterval(checkAuthWindow);

                // Simulate verification process
                setTimeout(function() {
                    spinner.style.display = 'none';
                    dlDetailsModal.querySelector('.success-message').style.display = 'block';
                    dlDetailsModal.querySelector('.dl-details').style.display = 'block';
                }, 2000);
            }
        }, 1000);
    });

    // Close details modal
    closeDetailsBtn.addEventListener('click', function() {
        detailsModal.style.display = 'none';
    });

    // Close PAN details modal
    closePanDetailsBtn.addEventListener('click', function() {
        panDetailsModal.style.display = 'none';
    });

    // Close DL details modal
    closeDlDetailsBtn.addEventListener('click', function() {
        dlDetailsModal.style.display = 'none';
    });

    // Enhanced 3D effect on cards
    const cards = document.querySelectorAll('.verification-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        card.addEventListener('mouseenter', (e) => {
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', (e) => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    });

    // Auto-run animation for cards
    cards.forEach(card => {
        card.style.animation = 'cardFloat 6s infinite';
    });

    // Generate Digilocker authorization URL
    function getAuthorizationUrl() {
        const params = {
            response_type: 'code',
            client_id: 'RD38A71A31',
            redirect_uri: 'https://www.pietos.co.in/',
            state: 'abc123xyz456',
            code_challenge: '2op6e3nwmHwna_7zxV9rba-vSzW6jPCNTPEFQuyWt-M',
            code_challenge_method: 'S256'
        };

        return 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?' +
            Object.keys(params).map(key =>
                encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
            ).join('&');
    }

    // Make deleteUser function available globally for onclick in renderUserTable
    window.deleteUser = deleteUser;

    // Initial render of user table for the admin panel
    renderUserTable();
});