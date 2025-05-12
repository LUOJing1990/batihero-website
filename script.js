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
