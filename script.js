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
// 一定使用和 HTML 完全一样的 ID
const API_URL = 'https://80a67dd4-043a-437b-9b31-fec40991fe12-00-4rtgpz7r016u.worf.replit.dev/api/devis';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('gh-devisBtn');
  btn.addEventListener('click', async () => {
    const w = parseInt(document.getElementById('gh-width').value);
    const h = parseInt(document.getElementById('gh-height').value);
    const type = document.getElementById('gh-type').value;
    const color = document.getElementById('gh-color').value;
    const vitrage = document.getElementById('gh-vitrage').value;
    const out = document.getElementById('gh-result');
    const ob = config.ob === 'oui';  
    
    if (!w || !h || !type || !color || !vitrage) {
      out.textContent = 'Veuillez remplir tous les champs.';
      return;
    }

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ largeur: w, hauteur: h, type: type, color: color, vitrage: vitrage, ob: ob })
      });

      if (!resp.ok) throw new Error(resp.statusText);
      const data = await resp.json();

      if (data.base_price) {
        out.innerHTML = `
          <div style="color:#007BFF">
            ${type}<br>
            Taille : <strong>${data.matched_width}×${data.matched_height}</strong> mm<br>
            Prix : <strong>${data.base_price} € TTC</strong>
          </div>`;
      } else {
        out.textContent = "Aucune correspondance pour cette taille.";
      }
    } catch (err) {
      console.error('Devis fetch error:', err);
      out.textContent = 'Erreur lors de la récupération du devis.';
    }
  });
document.getElementById('gh-type').addEventListener('change', updateOBButtonState);
document.getElementById('gh-width').addEventListener('input', updateOBButtonState);
document.getElementById('gh-height').addEventListener('input', updateOBButtonState);
});

function updateOBButtonState() {
  const type = document.getElementById('gh-type').value;
  const w = parseInt(document.getElementById('gh-width').value);
  const h = parseInt(document.getElementById('gh-height').value);

  const btnOui = document.getElementById('btn-ob-oui');

  // 🚫 明确禁止添加 OB 的窗型（来自你红框的 value）
  const forbiddenTypes = [
  'FIXED_WINDOW_PRICING',
  'COULISSANT_PVC',
  'PORTE_1_VANTAIL_PVC',
  'PORTE_FENETRE_ALL',
  'OB_1_VANTAIL_PVC',
  'SOUFFLET_PVC'
];


  if (forbiddenTypes.includes(type)) {
    btnOui.disabled = true;
    btnOui.classList.add('disabled');
    return;
  }

  // ⛔ 尺寸不合格：宽 > 800（或双扇每扇宽 > 800），高 > 2000
  if (!type || isNaN(w) || isNaN(h)) {
    btnOui.disabled = false;
    btnOui.classList.remove('disabled');
    return;
  }

  // 判断是否是双扇
  let widthPerLeaf = w;
  if (type.includes('2') || type.includes('DOUBLE')) {
    widthPerLeaf = w / 2;
  }

  if (widthPerLeaf > 800 || h > 2000) {
    btnOui.disabled = true;
    btnOui.classList.add('disabled');
  } else {
    btnOui.disabled = false;
    btnOui.classList.remove('disabled');
  }
}



