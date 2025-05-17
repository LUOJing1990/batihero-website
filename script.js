// 初始化配置对象
let config = {
  type: '',
  color: '',
  vitrage: '',
  width: 0,
  height: 0,
  ob: ''
};

// 注册所有 option-btn 按钮行为
document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const step = this.getAttribute('data-step');
    const value = this.getAttribute('data-value');
    config[step] = value;

    // 激活按钮状态
    document.querySelectorAll(`.option-btn[data-step="${step}"]`).forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    // 更新尺寸提示
    if (step === 'type') updateSizeHint();
    if (step === 'type' || step === 'width' || step === 'height') updateOBButtonState();
  });
});

// 设置 API 接口地址
const API_URL = 'https://80a67dd4-043a-437b-9b31-fec40991fe12-00-4rtgpz7r016u.worf.replit.dev/api/devis';

// 绑定主按钮点击行为
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('gh-devisBtn');
  const out = document.getElementById('gh-result');

  btn.addEventListener('click', async () => {
    const w = parseInt(document.getElementById('gh-width').value);
    const h = parseInt(document.getElementById('gh-height').value);
    const type = config.type;
    const color = config.color;
    const vitrage = config.vitrage;
    const ob = config.ob === 'oui';

    config.width = w;
    config.height = h;

    // 重置错误状态
    document.getElementById('gh-width').classList.remove('error');
    document.getElementById('gh-height').classList.remove('error');

    let hasError = false;
    if (!w || isNaN(w)) {
      document.getElementById('gh-width').classList.add('error');
      hasError = true;
    }
    if (!h || isNaN(h)) {
      document.getElementById('gh-height').classList.add('error');
      hasError = true;
    }
    if (!type || !color || !vitrage) {
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
          type: type,
          color: color,
          vitrage: vitrage,
          ob: ob
        })
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
    } finally {
      btn.classList.remove("loading");
    }
  });

  updateSizeHint();
  updateOBButtonState();
});

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

// 显示尺寸范围提示
function updateSizeHint() {
  const type = config.type;
  const hintWidth = document.getElementById('hint-width');
  const hintHeight = document.getElementById('hint-height');

  if (sizeLimits[type]) {
    const w = sizeLimits[type].width;
    const h = sizeLimits[type].height;
    hintWidth.textContent = `👉 Largeur recommandée : ${w[0]} mm — ${w[1]} mm`;
    hintHeight.textContent = `👉 Hauteur recommandée : ${h[0]} mm — ${h[1]} mm`;
  } else {
    hintWidth.textContent = '';
    hintHeight.textContent = '';
  }
}

// OB 开关控制
function updateOBButtonState() {
  const type = config.type;
  const w = config.width;
  const h = config.height;
  const btnOui = document.getElementById('btn-ob-oui');

  const forbiddenTypes = [
    'FIXED_WINDOW_PRICING',
    'COULISSANT_PVC',
    'PORTE_1_VANTAIL_PVC',
    'OB_1_VANTAIL_PVC',
    'SOUFFLET_PVC'
  ];

  if (forbiddenTypes.includes(type)) {
    btnOui.disabled = true;
    btnOui.classList.add('disabled');
    return;
  }

  if (!type || isNaN(w) || isNaN(h)) {
    btnOui.disabled = false;
    btnOui.classList.remove('disabled');
    return;
  }

  let widthPerLeaf = w;
  if (type.includes('2')) widthPerLeaf = w / 2;

  if (widthPerLeaf > 800 || h > 2000) {
    btnOui.disabled = true;
    btnOui.classList.add('disabled');
  } else {
    btnOui.disabled = false;
    btnOui.classList.remove('disabled');
  }
}
