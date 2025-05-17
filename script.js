// 初始化配置
let config = {
  type: '',
  color: '',
  vitrage: '',
  ob: '',
  width: 0,
  height: 0
};

// 注册所有 option-btn 的互斥逻辑
document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.dataset.step;
    const value = btn.dataset.value;
    config[step] = value;

    // 激活当前按钮，取消同组其他按钮
    document.querySelectorAll(`.option-btn[data-step="${step}"]`).forEach(b => {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    // 类型变化需要更新尺寸限制和 OB 可用性
    if (step === 'type') updateSizeHint();
    if (['type', 'width', 'height'].includes(step)) updateOBButtonState();
  });
});

const API_URL = 'https://80a67dd4-043a-437b-9b31-fec40991fe12-00-4rtgpz7r016u.worf.replit.dev/api/devis';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('gh-devisBtn');
  const out = document.getElementById('gh-result');

  btn.addEventListener('click', async () => {
    const w = parseInt(document.getElementById('gh-width').value);
    const h = parseInt(document.getElementById('gh-height').value);

    config.width = w;
    config.height = h;

    // 重置样式
    document.getElementById('gh-width').classList.remove('error');
    document.getElementById('gh-height').classList.remove('error');
    out.textContent = '';

    // 基础校验
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
      out.textContent = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    btn.classList.add("loading");
    out.textContent = "Chargement du devis...";

    try {
      const resp = await fetch(API_URL, {
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
        out.innerHTML = `
          <div style="color:#007BFF">
            ${config.type}<br>
            Taille : <strong>${data.matched_width}×${data.matched_height}</strong> mm<br>
            Prix : <strong>${data.base_price} € TTC</strong>
          </div>`;
      } else {
        out.textContent = "Aucune correspondance pour cette taille.";
      }
    } catch (err) {
      console.error(err);
      out.textContent = "Erreur lors de la récupération du devis.";
    } finally {
      btn.classList.remove("loading");
    }
  });

  document.getElementById('gh-width').addEventListener('input', () => {
    config.width = parseInt(document.getElementById('gh-width').value);
    updateOBButtonState();
  });

  document.getElementById('gh-height').addEventListener('input', () => {
    config.height = parseInt(document.getElementById('gh-height').value);
    updateOBButtonState();
  });

  updateSizeHint();
  updateOBButtonState();
});

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

// 尺寸提示更新
function updateSizeHint() {
  const type = config.type;
  const hintW = document.getElementById('hint-width');
  const hintH = document.getElementById('hint-height');
  if (!type || !sizeLimits[type]) {
    hintW.textContent = '';
    hintH.textContent = '';
    return;
  }

  const w = sizeLimits[type].width;
  const h = sizeLimits[type].height;
  hintW.textContent = `👉 Largeur recommandée : ${w[0]} mm — ${w[1]} mm`;
  hintH.textContent = `👉 Hauteur recommandée : ${h[0]} mm — ${h[1]} mm`;
}

// OB 可用性判断
function updateOBButtonState() {
  const type = config.type;
  const w = config.width;
  const h = config.height;

  const btnOui = document.querySelector('.option-btn[data-step="ob"][data-value="oui"]');

  const forbidden = [
    'FIXED_WINDOW_PRICING', 'COULISSANT_PVC',
    'PORTE_1_VANTAIL_PVC', 'OB_1_VANTAIL_PVC',
    'SOUFFLET_PVC'
  ];

  if (forbidden.includes(type) || !type || isNaN(w) || isNaN(h)) {
    btnOui.classList.add('disabled');
    btnOui.disabled = true;
    return;
  }

  const leafWidth = type.includes('2') ? w / 2 : w;
  if (leafWidth > 800 || h > 2000) {
    btnOui.classList.add('disabled');
    btnOui.disabled = true;
  } else {
    btnOui.classList.remove('disabled');
    btnOui.disabled = false;
  }
}

