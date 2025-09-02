firebase.auth().onAuthStateChanged(user=>{
  const link=document.getElementById('navAuth'); if(!link) return;
  if(user){ link.textContent='Dashboard'; link.href='/dashboard.html'; }
  else { link.textContent='Sign In'; link.href='/login.html'; }
});
