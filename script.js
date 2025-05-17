// 初始化配置对象
let config = {
  material: '',
  style: '',
  vitrage: '',
  width: 0,
  height: 0,
  ob: ''
};

// OB 按钮切换配置
document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const step = this.getAttribute('data-step');
    const value = this.getAttribute('data-value');
    config[step] = value;

    // 设置按钮状态
    document.querySelectorAll(`.option-btn[data-step="${step}"]`).forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

const API_URL = 'https://80a67dd4-043a-437b-9b31-fec40991fe12-00-4rtgpz7r016u.worf.replit.dev/api/devis';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('gh-devisBtn');
  const out = document.getElementById('gh-result');

  btn.addEventListener('click', async () => {
    // 获取输入值
    const w = parseInt(document.getElementById('gh-width').value);
    const h = parseInt(document.getElementById('gh-height').value);
    const type = document.getElementById('gh-type').value;
    const color = document.getElementById('gh-color').value;
    const vitrage = document.getElementById('gh-vitrage').value;
    const ob = config.ob === 'oui';

    // 重置错误状态
    ["gh-width", "gh-height", "gh-type", "gh-color", "gh-vitrage"].forEach(id => {
      document.getElementById(id).classList.remove('error');
    });

    // 简单验证
    let hasError = false;
    if (!w || isNaN(w)) {
      document.getElementById('gh-width').classList.add('error');
      hasError = true;
    }
    if (!h || isNaN(h)) {
      document.getElementById('gh-height').classList.add('error');
      hasError = true;
    }
    if (!type) {
      document.getElementById('gh-type').classList.add('error');
      hasError = true;
    }
    if (!color) {
      document.getElementById('gh-color').classList.add('error');
      hasError = true;
    }
    if (!vitrage) {
      document.getElementById('gh-vitrage').classList.add('error');
      hasError = true;
    }

    if (hasError) {
      out.textContent = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    // 动态按钮 loading 效果
    btn.classList.add("loading");
    out.textContent = "Chargement du devis...";

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
    } finally {
      btn.classList.remove("loading");
    }
  });

  // OB 按钮是否启用
  document.getElementById('gh-type').addEventListener('change', updateOBButtonState);
  document.getElementById('gh-width').addEventListener('input', updateOBButtonState);
  document.getElementById('gh-height').addEventListener('input', updateOBButtonState);
  updateOBButtonState();
});

function updateOBButtonState() {
  const type = document.getElementById('gh-type').value;
  const w = parseInt(document.getElementById('gh-width').value);
  const h = parseInt(document.getElementById('gh-height').value);

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
const typeSelect = document.getElementById('gh-type');
const hintWidth = document.getElementById('hint-width');
const hintHeight = document.getElementById('hint-height');

// 尺寸限制规则（你可按实际修改）
// 尺寸限制规则：每种窗户类型的推荐宽高范围（单位 mm）
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

// 更新尺寸提示
function updateSizeHint() {
  const type = typeSelect.value;
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

// 初始加载 & 下拉变化时更新
typeSelect.addEventListener('change', updateSizeHint);
window.addEventListener('DOMContentLoaded', updateSizeHint);

