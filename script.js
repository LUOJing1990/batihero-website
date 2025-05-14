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
