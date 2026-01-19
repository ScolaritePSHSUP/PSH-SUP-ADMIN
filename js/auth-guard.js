// js/auth-guard.js
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "login.html";
  }
});
