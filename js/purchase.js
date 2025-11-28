// Update total amount based on quantity
document.getElementById('quantity').addEventListener('change', function() {
    const quantity = parseInt(this.value);
    const pricePerShirt = 800;
    const totalAmount = quantity * pricePerShirt;
    
    document.getElementById('totalAmount').textContent = `KSH ${totalAmount.toLocaleString()}`;
    document.getElementById('paymentAmount').textContent = `KSH ${totalAmount.toLocaleString()}`;
});

// Copy to clipboard function
function copyToClipboard(text, button, type) {
    // Prevent any default behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    navigator.clipboard.writeText(text).then(function() {
        // Show success feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
        button.style.background = '#10b981';
        
        // Save copied state to localStorage
        localStorage.setItem(`copied_${type}`, 'true');
        localStorage.setItem(`copied_${type}_time`, Date.now());
        
        setTimeout(() => {
            // Only revert if user hasn't navigated away and come back
            if (localStorage.getItem(`copied_${type}`) === 'true') {
                button.innerHTML = originalText;
                button.style.background = '';
                localStorage.removeItem(`copied_${type}`);
                localStorage.removeItem(`copied_${type}_time`);
            }
        }, 2000);
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        alert('Failed to copy text. Please copy manually.');
    });
}

// Restore copied state when page loads
function restoreCopiedState() {
    const businessCopied = localStorage.getItem('copied_business');
    const accountCopied = localStorage.getItem('copied_account');
    
    if (businessCopied === 'true') {
        const businessBtn = document.getElementById('copyBusinessNo');
        if (businessBtn) {
            businessBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            businessBtn.style.background = '#10b981';
        }
    }
    
    if (accountCopied === 'true') {
        const accountBtn = document.getElementById('copyAccountNo');
        if (accountBtn) {
            accountBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            accountBtn.style.background = '#10b981';
        }
    }
}

// Initialize copy buttons and prevent form submission
document.addEventListener('DOMContentLoaded', function() {
    // Restore any previously copied states
    restoreCopiedState();
    
    // Business Number copy button
    const businessNoBtn = document.getElementById('copyBusinessNo');
    if (businessNoBtn) {
        businessNoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard('880100', this, 'business');
        });
        
        // Set button type to prevent form submission
        businessNoBtn.setAttribute('type', 'button');
    }
    
    // Account Number copy button
    const accountNoBtn = document.getElementById('copyAccountNo');
    if (accountNoBtn) {
        accountNoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard('9676730018', this, 'account');
        });
        
        // Set button type to prevent form submission
        accountNoBtn.setAttribute('type', 'button');
    }
});

// Form submission handler - ONLY for the submit button
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value || 'Not provided',
        size: document.getElementById('size').value,
        quantity: document.getElementById('quantity').value,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value || 'Not provided',
        totalAmount: document.getElementById('totalAmount').textContent,
        timestamp: new Date().toLocaleString('en-KE')
    };
    
    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.size || !formData.quantity || !formData.location) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Validate phone number format
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
        alert('Please enter a valid Kenyan phone number (e.g., 0712345678)');
        return;
    }
    
    // Send to WhatsApp
    sendOrderToWhatsApp(formData);
});

function sendOrderToWhatsApp(orderData) {
    const whatsappNumber = '254757202147';
    
    // Format message for WhatsApp
    const whatsappMessage = `
🎽 *NEW TTK T-SHIRT ORDER* 🎽

*Customer Information:*
👤 Name: ${orderData.fullName}
📞 Phone: ${orderData.phone}
📧 Email: ${orderData.email}

*Order Details:*
👕 Size: ${orderData.size}
📦 Quantity: ${orderData.quantity}
💰 Total Amount: ${orderData.totalAmount}

*Delivery Information:*
📍 Location: ${orderData.location}
🏠 Address: ${orderData.address}

*Payment Details:*
Payment was done through:
• Business No: 880100
• Account No: 9676730018
• Amount: ${orderData.totalAmount}

⏰ Order Time: ${orderData.timestamp}

_This order was submitted through the TTK website._
    `.trim();
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    
    alert('Order submitted successfully! Your order details are being opened in WhatsApp. Please send the message to complete your order.');
    
    localStorage.removeItem('copied_business');
    localStorage.removeItem('copied_account');
    localStorage.removeItem('copied_business_time');
    localStorage.removeItem('copied_account_time');
    
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Order Sent!';
        submitBtn.style.background = '#10b981';
        submitBtn.disabled = true;
        
        const actionButtons = document.querySelector('.action-buttons');
        const newOrderBtn = document.createElement('button');
        newOrderBtn.type = 'button';
        newOrderBtn.className = 'new-order-btn';
        newOrderBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Place New Order';
        newOrderBtn.onclick = function() {
            document.getElementById('orderForm').reset();
            document.getElementById('totalAmount').textContent = 'KSH 800';
            document.getElementById('paymentAmount').textContent = 'KSH 800';
            submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Order';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            newOrderBtn.remove();
            clearErrorMessages();
        };
        
        actionButtons.appendChild(newOrderBtn);
    }
    
    // Reset form after 5 seconds if user doesn't click "New Order"
    setTimeout(() => {
        if (!document.querySelector('.new-order-btn')) {
            document.getElementById('orderForm').reset();
            document.getElementById('totalAmount').textContent = 'KSH 800';
            document.getElementById('paymentAmount').textContent = 'KSH 800';
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Order';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }
        }
    }, 5000);
}

// Clear copied states after 5 minutes (300,000 ms) to prevent permanent "Copied" state
setInterval(function() {
    const businessTime = localStorage.getItem('copied_business_time');
    const accountTime = localStorage.getItem('copied_account_time');
    const now = Date.now();
    
    if (businessTime && (now - parseInt(businessTime)) > 300000) { // 5 minutes
        localStorage.removeItem('copied_business');
        localStorage.removeItem('copied_business_time');
    }
    
    if (accountTime && (now - parseInt(accountTime)) > 300000) { // 5 minutes
        localStorage.removeItem('copied_account');
        localStorage.removeItem('copied_account_time');
    }
}, 60000); // Check every minute