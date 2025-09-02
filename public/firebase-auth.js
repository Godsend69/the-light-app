window.addEventListener('load',()=>{
  const ready=()=>!!(window.firebase&&firebase.app);const wait=new Promise(r=>{const c=()=>ready()?r():setTimeout(c,50);c()});
  wait.then(()=>{
    const auth=firebase.auth();
    const nav=document.getElementById('nav-auth');
    auth.onAuthStateChanged(async(u)=>{ if(nav){ if(u){nav.textContent='Dashboard';nav.href='/dashboard.html'} else {nav.textContent='Sign in';nav.href='/login.html'}}});
    const login=document.getElementById('loginForm'); if(login){ login.addEventListener('submit',async e=>{e.preventDefault();const email=document.getElementById('loginEmail').value;const pw=document.getElementById('loginPassword').value;const msg=document.getElementById('loginMsg');msg.textContent='Signing in…';try{await auth.signInWithEmailAndPassword(email,pw);msg.textContent='Success! Redirecting…';setTimeout(()=>location.href='/dashboard.html',300)}catch(err){msg.textContent=err.message}})}
    const signup=document.getElementById('signupForm'); if(signup){ signup.addEventListener('submit',async e=>{e.preventDefault();const email=document.getElementById('signupEmail').value;const pw=document.getElementById('signupPassword').value;const msg=document.getElementById('signupMsg');msg.textContent='Creating account…';try{await auth.createUserWithEmailAndPassword(email,pw);msg.textContent='Account created! Redirecting…';setTimeout(()=>location.href='/dashboard.html',300)}catch(err){msg.textContent=err.message}})}
    const userInfo=document.getElementById('userInfo'); const signOutBtn=document.getElementById('signOutBtn');
    if(userInfo){ auth.onAuthStateChanged(async u=>{ if(!u){userInfo.textContent='Not signed in.'; return;} await u.getIdToken(true); const tr=await auth.currentUser.getIdTokenResult(); const prem=!!tr.claims.premium; userInfo.textContent=`Signed in as ${u.email}`; const badge=document.getElementById('premiumBadge'); if(badge) badge.classList.toggle('hidden',!prem); });}
    if(signOutBtn){ signOutBtn.addEventListener('click',async()=>{await auth.signOut(); location.href='/index.html'}) }
  });
});
