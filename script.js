// 初始化配置对象
let config = {
  type: '',
  color: '',
  vitrage: '',
  ob: '',
  width: 0,
  height: 0
};

// 显示用类型标签映射
const typeLabelMap = {
  FIXED_WINDOW_PRICING: "Fenêtre fixe",
  COULISSANT_PVC: "Fenêtre coulissante",
  OB_1_VANTAIL_PVC: "Oscillo-battante 1 vantail",
  OF_1_VANTAIL_PVC: "Fenêtre ouvrante 1 vantail",
  OF_2_VANTAUX_PVC: "Fenêtre ouvrante 2 vantaux",
  OF_3_VANTAUX_PVC: "Fenêtre ouvrante 3 vantaux",
  OF_4_VANTAUX_PVC: "Fenêtre ouvrante 4 vantaux",
  OF2_1_FIXE_PVC: "2 ouvrants + 1 fixe",
  OF2_2_FIXES_PVC: "2 ouvrants + 2 fixes latéraux",
  PORTE_1_VANTAIL_PVC: "Porte vitrée simple battant",
  PORTE_FENETRE_1_PVC: "Porte-fenêtre 1 vantail",
  PORTE_FENETRE_2_FIXE_1_PVC: "Porte-fenêtre 2 fixes + 1 vantail",
  PORTE_FENETRE_2_FIXE_2_PVC: "Porte-fenêtre 2 fixes + 2 vantaux",
  PORTE_FENETRE_2_PVC: "Porte-fenêtre 2 vantaux",
  PORTE_FENETRE_3_PVC: "Porte-fenêtre 3 vantaux",
  PORTE_FENETRE_4_PVC: "Porte-fenêtre 4 vantaux",
  SOUFFLET_PVC: "Fenêtre à soufflet"
};

// 尺寸推荐表
const sizeLimits = {
  FIXED_WINDOW_PRICING:         { width: [400, 2000], height: [350, 2350] },
  COULISSANT_PVC:               { width: [1000, 2600], height: [850, 2350] },
  OB_1_VANTAIL_PVC:             { width: [500, 1400], height: [450, 1750] },
  OF_1_VANTAIL_PVC:             { width: [500, 1000], height: [450, 2150] },
  OF_2_VANTAUX_PVC:             { width: [700, 1600], height: [550, 2150] },
  OF_3_VANTAUX_PVC:             { width: [1500, 2400], height: [550, 2150] },
  OF_4_VANTAUX_PVC:             { width: [1800, 2800], height: [550, 2150] },
  OF2_1_FIXE_PVC:               { width: [1500, 2400], height: [550, 2150] },
  OF2_2_FIXES_PVC:              { width: [1800, 2800], height: [550, 2150] },
  PORTE_1_VANTAIL_PVC:          { width: [900, 1100], height: [1950, 2350] },
  PORTE_FENETRE_1_PVC:          { width: [700, 1000], height: [1950, 2350] },
  PORTE_FENETRE_2_FIXE_1_PVC:   { width: [1700, 2700], height: [1950, 2350] },
  PORTE_FENETRE_2_FIXE_2_PVC:   { width: [2000, 2800], height: [1950, 2350] },
  PORTE_FENETRE_2_PVC:          { width: [1000, 1800], height: [1950, 2350] },
  PORTE_FENETRE_3_PVC:          { width: [1700, 2700], height: [1950, 2350] },
  PORTE_FENETRE_4_PVC:          { width: [2000, 2800], height: [1950, 2350] },
  SOUFFLET_PVC:                 { width: [600, 1500], height: [450, 950] }
};

// 图片路径和文字
function updateFenetreImage(type) {
  const imgEl = document.getElementById('preview-img');
  const captionEl = document.getElementById('preview-caption');

  const imageMap = {
    FIXED_WINDOW_PRICING: 'images/fenetre_fixe.png',
    COULISSANT_PVC: 'images/coulissant.png',
    OB_1_VANTAIL_PVC: 'images/ob_1.png',
    OF_1_VANTAIL_PVC: 'images/of_1.png',
    OF_2_VANTAUX_PVC: 'images/of_2.png',
    OF_3_VANTAUX_PVC: 'images/of_3.png',
    OF_4_VANTAUX_PVC: 'images/of_4.png',
    OF2_1_FIXE_PVC: 'images/of2_1.png',
    OF2_2_FIXES_PVC: 'images/of2_2.png',
    PORTE_1_VANTAIL_PVC: 'images/porte_1.png',
    PORTE_FENETRE_1_PVC: 'images/porte_fenetre_1.png',
    PORTE_FENETRE_2_FIXE_1_PVC: 'images/pf_2_f1.png',
    PORTE_FENETRE_2_FIXE_2_PVC: 'images/pf_2_f2.png',
    PORTE_FENETRE_2_PVC: 'images/pf_2.png',
    PORTE_FENETRE_3_PVC: 'images/pf_3.png',
    PORTE_FENETRE_4_PVC: 'images/pf_4.png',
    SOUFFLET_PVC: 'images/soufflet.png'
  };

  const captionMap = {
    FIXED_WINDOW_PRICING: "Fenêtre fixe (non ouvrante) — Simple et lumineuse.",
    COULISSANT_PVC: "Fenêtre coulissante — Idéale pour les petits espaces.",
    OB_1_VANTAIL_PVC: "Oscillo-battante — Pour l’aération sans ouvrir entièrement.",
    OF_1_VANTAIL_PVC: "Fenêtre ouvrante 1 vantail — Classique et fonctionnelle.",
    OF_2_VANTAUX_PVC: "Fenêtre ouvrante 2 vantaux — Grande ouverture traditionnelle.",
    OF_3_VANTAUX_PVC: "Fenêtre 3 vantaux — Pour maximiser la lumière.",
    OF_4_VANTAUX_PVC: "Fenêtre 4 vantaux — Pour très grandes ouvertures.",
    OF2_1_FIXE_PVC: "2 ouvrants + 1 fixe — Pratique pour grandes baies équilibrées.",
    OF2_2_FIXES_PVC: "2 ouvrants + 2 fixes — Design symétrique moderne.",
    PORTE_1_VANTAIL_PVC: "Porte vitrée simple — Accès direct avec clarté.",
    PORTE_FENETRE_1_PVC: "Porte-fenêtre 1 vantail — Pour les petites sorties terrasse.",
    PORTE_FENETRE_2_FIXE_1_PVC: "PF 2 fixes + 1 vantail — Idéal pour lumière et passage.",
    PORTE_FENETRE_2_FIXE_2_PVC: "PF 2 fixes + 2 vantaux — Large ouverture et esthétique.",
    PORTE_FENETRE_2_PVC: "Porte-fenêtre 2 vantaux — Classique balcon/jardin.",
    PORTE_FENETRE_3_PVC: "Porte-fenêtre 3 vantaux — Design généreux et pratique.",
    PORTE_FENETRE_4_PVC: "Porte-fenêtre 4 vantaux — Pour les grandes pièces ouvertes.",
    SOUFFLET_PVC: "Soufflet — Petit ouvrant haut pour WC ou buanderie."
  };

  if (imageMap[type]) {
    imgEl.src = imageMap[type];
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  if (captionEl) {
    captionEl.textContent = captionMap[type] || '';
  }
}

function toggleOBDisabled(disabled) {
  const btn = document.querySelector('.option-btn[data-step="ob"][data-value="oui"]');
  if (!btn) return;
  btn.disabled = disabled;
  btn.classList.toggle('disabled', disabled);
}

function updateSizeHint() {
  const type = config.type;
  const hintW = document.getElementById('hint-width');
  const hintH = document.getElementById('hint-height');
  if (!type || !sizeLimits[type]) {
    hintW.textContent = '';
    hintH.textContent = '';
    return;
  }
  const range = sizeLimits[type];
  hintW.textContent = `👉 Largeur recommandée : ${range.width[0]} mm — ${range.width[1]} mm`;
  hintH.textContent = `👉 Hauteur recommandée : ${range.height[0]} mm — ${range.height[1]} mm`;
}

function updateOBButtonState() {
  const type = config.type;
  const w = config.width;
  const h = config.height;
  const notAllowed = ['FIXED_WINDOW_PRICING', 'COULISSANT_PVC', 'PORTE_1_VANTAIL_PVC', 'OB_1_VANTAIL_PVC', 'SOUFFLET_PVC'];
  if (!type || isNaN(w) || isNaN(h) || notAllowed.includes(type)) {
    toggleOBDisabled(true);
    return;
  }
  const leafWidth = type.includes('2') ? w / 2 : w;
  toggleOBDisabled(leafWidth > 800 || h > 2000);
}

function setActiveBtnGroup(step, value) {
  document.querySelectorAll(`.option-btn[data-step="${step}"]`).forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.value === value) btn.classList.add('active');
  });
  config[step] = value;
  if (step === 'type') {
    updateSizeHint();
    updateFenetreImage(value);
  }
  if (['type', 'width', 'height'].includes(step)) updateOBButtonState();
}

document.addEventListener('DOMContentLoaded', () => {

    // 🔥 显式设置 config 值
  config.type = 'FIXED_WINDOW_PRICING';
  config.color = 'blanc';
  config.vitrage = '4-20-4';
  config.ob = 'non';

  // 设置按钮样式 + 图像提示等
  setActiveBtnGroup('type', 'FIXED_WINDOW_PRICING');
  setActiveBtnGroup('color', 'blanc');
  setActiveBtnGroup('vitrage', '4-20-4');
  setActiveBtnGroup('ob', 'non');

  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.dataset.step;
      const value = btn.dataset.value;
      setActiveBtnGroup(step, value);
    });
  });

  ['gh-width', 'gh-height'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      config.width = Number(document.getElementById('gh-width').value);
      config.height = Number(document.getElementById('gh-height').value);
      updateOBButtonState();
    });
  });

  const btn = document.getElementById('gh-devisBtn');
  const out = document.getElementById('gh-result');
  btn.addEventListener('click', async () => {
    const w = Number(document.getElementById('gh-width').value);
    const h = Number(document.getElementById('gh-height').value);
    config.width = w;
    config.height = h;

    out.textContent = '';
    ['gh-width', 'gh-height'].forEach(id => document.getElementById(id).classList.remove('error'));

    let hasError = false;
    if (!w || isNaN(w)) {
      document.getElementById('gh-width').classList.add('error');
      hasError = true;
    }
    if (!h || isNaN(h)) {
      document.getElementById('gh-height').classList.add('error');
      hasError = true;
    }
    if (!config.type || !config.color || !config.vitrage) {
      hasError = true;
    }
    if (hasError) {
      out.textContent = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    btn.classList.add("loading");
    out.textContent = "Chargement du devis...";

    try {
      const resp = await fetch('https://batihero-backend.onrender.com/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          largeur: w,
          hauteur: h,
          type: config.type,
          color: config.color,
          vitrage: config.vitrage,
          ob: config.ob === 'oui'
        })
      });
      const data = await resp.json();
      
if (data.base_price) {
  const base = data.base_price;
  const min = Math.round(base * 0.45);
  const max = Math.round(base * 0.65);
  out.innerHTML = `
    <div class="price-card">
      <h3>✅ Résumé de votre demande</h3>
      <p><strong>🪟 Type :</strong> ${typeLabelMap[config.type] || config.type}</p>
      <p><strong>Dimensions :</strong> ${w} mm × ${h} mm</p>
      <p><strong>Couleur :</strong> ${config.color}</p>
      <p><strong>Vitrage :</strong> ${config.vitrage}</p>
      <p><strong>OB :</strong> ${config.ob}</p>
      <p class="highlight-price"><strong>Estimation :</strong> entre <strong>${min} €</strong> et <strong>${max} €</strong> HT</p>
      <p class="price-note">
        🧾 Prix indicatif pour la fourniture seule – hors pose.
        <br>💡 Le tarif dépend de la configuration choisie et de la provenance du profilé (France, UE ou import).
      </p>
      <div class="quick-feedback">
        <p>💬 Ce prix vous paraît utile ?</p>
        <button class="feedback-btn" onclick="openModal('oui')">👍 Oui</button>
        <button class="feedback-btn" onclick="openModal('parler')">❓ Je préfère en parler</button>
      </div>
      <div class="price-note" style="margin-top: 14px; background: #f9f9f9; padding: 10px; border-left: 4px solid #007BFF; border-radius: 6px;">
        <strong>❓ Pourquoi un prix indicatif ?</strong><br>
        Les fenêtres sur mesure varient beaucoup selon :
        <ul style="margin-top: 6px; margin-bottom: 6px; padding-left: 18px;">
          <li>le type de profilé (origine française, allemande ou import)</li>
          <li>les options choisies (OB, vitrage renforcé…)</li>
          <li>la quantité ou le mode de livraison (en palette ou à l’unité)</li>
        </ul>
        👉 Le prix affiché donne une <strong>fourchette réaliste</strong>, sans engagement.<br><br>
        📩 Si vous avez déjà reçu un devis, comparez-le à cette fourchette. S’il est très différent, 
        envoyez-nous le <strong>nom de la marque</strong> et le <strong>prix obtenu</strong>, 
        ainsi que votre email : nous vous dirons s’il est cohérent.
      </div>
    </div>`;
}
      
      else {
        out.textContent = "Aucune correspondance pour cette taille.";
      }
    } catch (err) {
      console.error('Fetch error:', err);
      out.textContent = "Erreur lors de la récupération du devis.";
    } finally {
      btn.classList.remove("loading");
    }
  });

  const toggleBtn = document.querySelector('.collapsible-toggle');
  const content = document.querySelector('.collapsible-content');
  if (toggleBtn && content) {
    toggleBtn.addEventListener('click', () => {
      content.classList.toggle('active');
      toggleBtn.innerHTML = content.classList.contains('active')
        ? '💡 Qu’est-ce qui influence le prix ? ⬆️'
        : '💡 Qu’est-ce qui influence le prix ? ⬇️';
    });
  }

  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

function openModal(feedbackType) {
  const modal = document.getElementById('feedback-modal');
  modal.classList.add('active');
  window.currentFeedbackType = feedbackType;
}

function closeModal() {
  const modal = document.getElementById('feedback-modal');
  modal.classList.remove('active');
}
async function submitFeedback() {
  const text = document.getElementById('feedback-text').value.trim();
  if (!text) {
    alert("Merci de remplir le message 🙏");
    return;
  }
  const payload = {
    feedback_type: window.currentFeedbackType,
    message: text,
    timestamp: new Date().toISOString()
  };
  try {
    await fetch("https://batihero-backend.onrender.com/api/feedback", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert("Merci pour votre retour !");
    document.getElementById('feedback-text').value = '';
    closeModal();
  } catch (err) {
    alert("Erreur lors de l’envoi du message.");
  }
}
