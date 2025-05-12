let config = {
  material: '',
  style: '',
  vitrage: '',
  width: 0,
  height: 0
};

document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const step = this.getAttribute('data-step');
    const value = this.getAttribute('data-value');

    config[step] = value;

    // Highlight selected button
    document.querySelectorAll(`.option-btn[data-step="${step}"]`).forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

function showResult() {
  config.width = parseInt(document.getElementById('width').value);
  config.height = parseInt(document.getElementById('height').value);

  if (!config.material || !config.style || !config.vitrage || !config.width || !config.height) {
    alert('Veuillez compléter toutes les étapes.');
    return;
  }

  // Simple calcul de prix
  let basePrice = 200;
  if (config.material === 'Aluminium') basePrice += 150;
  if (config.style === '2 vantaux') basePrice += 100;
  if (config.style === 'coulissant') basePrice += 200;
  if (config.style === 'baie vitrée') basePrice += 300;
  if (config.vitrage === 'triple') basePrice *= 1.2;

  const areaM2 = (config.width * config.height) / 1000000;
  const produit = (basePrice * areaM2).toFixed(2);
  const installation = (produit * 0.3).toFixed(2);
  const livraison = (produit * 0.05).toFixed(2);
  const total = (parseFloat(produit) + parseFloat(installation) + parseFloat(livraison)).toFixed(2);

  document.getElementById('resultat').innerHTML = `
    <h4>Votre devis estimatif</h4>
    <p><strong>Total :</strong> ${total} € TTC</p>
    <ul>
      <li>Produit : ${produit} €</li>
      <li>Installation : ${installation} €</li>
      <li>Livraison : ${livraison} €</li>
    </ul>
    <a href="#contact" class="btn btn-green">Obtenir un devis détaillé</a>
  `;
}
const API_URL = 'https://80a67dd4-043a-437b-9b31-fec40991fe12-00-4rtgpz7r016u.worf.replit.dev/api/devis';

document.getElementById('devisBtn').addEventListener('click', async () => {
  const w = parseInt(document.getElementById('width').value);
  const h = parseInt(document.getElementById('height').value);
  const resultEl = document.getElementById('resultat');
  if (!w || !h) {
    resultEl.textContent = 'Veuillez saisir largeur et hauteur.';
    return;
  }
  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({largeur: w, hauteur: h})
    });
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    resultEl.innerHTML = `
      Taille standard : <strong>${data.matched_width}×${data.matched_height}</strong> mm<br>
      Prix : <strong>${data.base_price} €</strong>
    `;
  } catch (err) {
    console.error('❌ 调用失败：', err);
    resultEl.textContent = 'Erreur lors de la récupération du devis.';
  }
});
