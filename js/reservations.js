// js/reservation.js
async function reserver() {
  const { data } = await supabaseClient.auth.getUser();
  const user = data.user;

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const salleId = document.getElementById("salle").value;
  const debut = document.getElementById("debut").value;
  const fin = document.getElementById("fin").value;
  const motif = document.getElementById("motif").value.trim();

  if (fin <= debut) {
    alert("❌ L’heure de fin doit être après l’heure de début");
    return;
  }

  const { error } = await supabaseClient
    .from("reservations")
    .insert({
      demandeur_id: user.id,
      salle_id: salleId,
      date_debut: new Date(debut).toISOString(),
      date_fin: new Date(fin).toISOString(),
      motif: motif || null,
      statut: "en_attente"
    });

  if (error) {
    console.error(error);
    alert("❌ Salle indisponible ou erreur");
  } else {
    alert("✅ Demande de réservation envoyée");
  }
}
