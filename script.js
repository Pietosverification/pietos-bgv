// Replace this with your actual Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSIu_8Q2HLVWVWAexqnyH5BTb5uQL1JemC8aoSk7sL3m61HbEP6sOiOU0-sZHXKRn_Ow/exec';
// Replace these with your actual URLs for consent and report
const CONSENT_URL = 'https://script.google.com/a/macros/pietos.com/s/AKfycbyQ7vIk8Mpr_lyd7xoY6_PVP6-PvtL8US7EX3EfU1GH6Rn4AXp1EcFGEQnAFqscqWA/exec';
// Replace with your consent URL
const REPORT_URL = 'https://script.google.com/a/macros/pietos.com/s/AKfycbz5-mX9g25HmJnuQ2DyVRp98-PsKZMz3XzNyH84bvfm8y15SWHP0jMUYaYVD9rEbHvD/exec';
// Replace with your report URL

document.addEventListener('DOMContentLoaded', function() {
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
    const consentDataModal = document.getElementById('consent-data-modal');
    const finalReportModal = document.getElementById('final-report-modal');
    
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
    const viewConsentBtn = document.getElementById('view-consent-btn');
    const viewReportBtn = document.getElementById('view-report-btn');
    const closeConsentDataBtn = document.getElementById('close-consent-data-btn');
    const closeFinalReportBtn = document.getElementById('close-final-report-btn');
    
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
    
    // Open Aadhaar modal when card is clicked
    aadhaarCard.addEventListener('click', function() {
        aadhaarModal.style.display = 'flex';
    });
    
    // Open PAN modal when card is clicked
    panCard.addEventListener('click', function() {
        panModal.style.display = 'flex';
    });
    
    // Open DL modal when card is clicked
    dlCard.addEventListener('click', function() {
        dlModal.style.display = 'flex';
    });
    
    // Open Consent Data in new tab when button is clicked
    viewConsentBtn.addEventListener('click', function() {
        window.open(CONSENT_URL, '_blank');
    });
    
    // Open Final Report in new tab when button is clicked
    viewReportBtn.addEventListener('click', function() {
        window.open(REPORT_URL, '_blank');
    });
    
    // Close modals when X is clicked
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close consent data modal
    closeConsentDataBtn.addEventListener('click', function() {
        consentDataModal.style.display = 'none';
    });
    
    // Close final report modal
    closeFinalReportBtn.addEventListener('click', function() {
        finalReportModal.style.display = 'none';
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

    // Card hover effect using JavaScript
    const cards = document.querySelectorAll('.verification-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const xAxis = (centerX - x) / 5;
            const yAxis = (y - centerY) / 5;
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
});