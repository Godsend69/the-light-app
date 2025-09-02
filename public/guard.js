const auth=firebase.auth();
auth.onAuthStateChanged(user=>{
 if(!user){ location.replace('/login.html'); return; }
 document.getElementById('logoutBtn')?.addEventListener('click',()=>auth.signOut().then(()=>location.href='/'));
 const line=document.getElementById('userLine'); if(line) line.textContent=`Signed in as ${user.email}`;
});
