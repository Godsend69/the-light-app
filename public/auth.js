const auth=firebase.auth();
document.getElementById('loginForm')?.addEventListener('submit',async e=>{
 e.preventDefault();
 const email=document.getElementById('loginEmail').value.trim();
 const pass=document.getElementById('loginPass').value;
 const msg=document.getElementById('loginMsg'); msg.textContent='Signing in…';
 try{ await auth.signInWithEmailAndPassword(email,pass); msg.textContent='Success! Redirecting…'; location.href='/dashboard.html'; }
 catch(err){ msg.textContent=err.message;}
});
document.getElementById('signupForm')?.addEventListener('submit',async e=>{
 e.preventDefault();
 const email=document.getElementById('signupEmail').value.trim();
 const pass=document.getElementById('signupPass').value;
 const msg=document.getElementById('signupMsg'); msg.textContent='Creating…';
 try{ await auth.createUserWithEmailAndPassword(email,pass); msg.textContent='Account created! Redirecting…'; location.href='/dashboard.html'; }
 catch(err){ msg.textContent=err.message;}
});
