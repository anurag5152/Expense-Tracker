// Determine which page we're on: signup.html or login.html
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

if (signupForm) {
  // SIGNUP PAGE LOGIC
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const errorP = document.getElementById('signupError');
    errorP.textContent = '';

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        errorP.textContent = data.msg || 'Signup failed.';
      } else {
        // Save token & user to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'main.html';
      }
    } catch (err) {
      console.error(err);
      errorP.textContent = 'Server error. Try again later.';
    }
  });
}

if (loginForm) {
  // LOGIN PAGE LOGIC
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const errorP = document.getElementById('loginError');
    errorP.textContent = '';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        errorP.textContent = data.msg || 'Login failed.';
      } else {
        // Save token & user to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'main.html';
      }
    } catch (err) {
      console.error(err);
      errorP.textContent = 'Server error. Try again later.';
    }
  });
}
