document.getElementById('billingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.querySelector('.pay-btn');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    setTimeout(() => {
        btn.textContent = 'Payment Completed';
        setTimeout(() => { window.location.href = '../index.html'; }, 1000);
    }, 1500);
});
