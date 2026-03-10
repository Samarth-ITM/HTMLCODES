document.addEventListener('DOMContentLoaded', () => {
    const plan = new URLSearchParams(window.location.search).get('plan');
    const payBtn = document.querySelector('.pay-btn');

    if (plan === 'pro') {
        document.getElementById('planName').textContent = 'Monthly Pro';
        document.getElementById('planPrice').textContent = '₹2000 / mo';
        document.getElementById('totalPrice').textContent = '₹2000';
        payBtn.textContent = 'Pay ₹2000';
    } else {
        document.getElementById('planName').textContent = 'One-Time Host';
        document.getElementById('planPrice').textContent = '₹50 / event';
        document.getElementById('totalPrice').textContent = '₹50';
        payBtn.textContent = 'Pay ₹50';
    }

    document.getElementById('billingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        payBtn.disabled = true;
        payBtn.textContent = 'Processing...';
        setTimeout(() => {
            payBtn.textContent = 'Payment Completed';
            setTimeout(() => { window.location.href = '../index.html'; }, 1000);
        }, 1500);
    });
});