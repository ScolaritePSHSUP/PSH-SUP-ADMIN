// js/actualites.js
async function loadActualites() {
  const { data, error } = await supabaseClient
    .from("actualites")
    .select("title, summary, image_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur actualités :", error);
    return;
  }

  const container = document.getElementById("actualites");
  container.innerHTML = "";

  data.forEach(actu => {
    container.innerHTML += `
      <div class="card">
        ${actu.image_url ? `<img src="${actu.image_url}" class="card-img">` : ""}
        <h3>${actu.title}</h3>
        <p>${actu.summary}</p>
      </div>
    `;
  });
}

loadActualites();
