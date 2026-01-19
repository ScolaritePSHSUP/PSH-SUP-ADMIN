// js/salles.js
async function loadSalles() {
  const { data, error } = await supabaseClient
    .from("salles")
    .select("numero, campus, capacite")
    .order("campus")
    .order("numero");

  if (error) {
    console.error(error);
    return;
  }

  const div = document.getElementById("salles");
  div.innerHTML = "";

  data.forEach(s => {
    div.innerHTML += `
      <div class="card">
        <h3>Salle ${s.numero}</h3>
        <p>📍 Campus : ${s.campus}</p>
        <p>👥 Capacité : ${s.capacite}</p>
      </div>
    `;
  });
}

loadSalles();
