// 初始化配置对象
let config = {
  type: '',
  color: '',
  vitrage: '',
  ob: '',
  width: 0,
  height: 0
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

// 图像路径绑定表
function updateFenetreImage(type) {
  const imgEl = document.getElementById('preview-img');
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
// 接口地址
const API_URL = 'https://80a67dd4-043a-437b-9b31-fec40991fe12-00-4rtgpz7r016u.worf.replit.dev/api/devis';

  if (imageMap[type]) {
    imgEl.src = imageMap[type];
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
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
  if (["type", "width", "height"].includes(step)) updateOBButtonState();
}

// OB 按钮启用/禁用逻辑
function toggleOBDisabled(disabled) {
  const btn = document.querySelector('.option-btn[data-step="ob"][data-value="oui"]');
  if (!btn) return;
  btn.disabled = disabled;
  btn.classList.toggle('disabled', disabled);
}

// 尺寸提示更新
function updateSizeHint() {
  const type = config.type;
  const hintW = document.getElementById('hint-width');
@@ -83,42 +66,52 @@
  hintH.textContent = `👉 Hauteur recommandée : ${range.height[0]} mm — ${range.height[1]} mm`;
}

// OB 条件判断逻辑
function updateOBButtonState() {
  const type = config.type;
  const w = config.width;
  const h = config.height;

  const notAllowed = ['FIXED_WINDOW_PRICING', 'COULISSANT_PVC', 'PORTE_1_VANTAIL_PVC', 'OB_1_VANTAIL_PVC', 'SOUFFLET_PVC'];

  const notAllowed = [
    'FIXED_WINDOW_PRICING', 'COULISSANT_PVC', 'PORTE_1_VANTAIL_PVC',
    'OB_1_VANTAIL_PVC', 'SOUFFLET_PVC'
  ];
  if (!type || isNaN(w) || isNaN(h) || notAllowed.includes(type)) {
    toggleOBDisabled(true);
    return;
  }

  const leafWidth = type.includes('2') ? w / 2 : w;
  toggleOBDisabled(leafWidth > 800 || h > 2000);
}

// 按钮激活 + 类型联动处理
function setActiveBtnGroup(step, value) {
  document.querySelectorAll(`.option-btn[data-step="${step}"]`).forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.value === value) btn.classList.add('active');
  });
  config[step] = value;

  if (step === 'type') {
    updateSizeHint();
    updateFenetreImage(value);
function updateFenetreImage(type) {
  const imgEl = document.getElementById('preview-img');
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
  if (imageMap[type]) {
    imgEl.src = imageMap[type];
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  if (['type', 'width', 'height'].includes(step)) updateOBButtonState();
}

// 页面初始化与交互绑定
document.addEventListener('DOMContentLoaded', () => {
  // 所有选项按钮点击绑定
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.dataset.step;
@@ -127,7 +120,6 @@
    });
  });

  // 尺寸输入绑定
  ['gh-width', 'gh-height'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      config.width = Number(document.getElementById('gh-width').value);
@@ -136,7 +128,6 @@
    });
  });

  // 获取报价按钮点击
  const btn = document.getElementById('gh-devisBtn');
  const out = document.getElementById('gh-result');
  btn.addEventListener('click', async () => {
@@ -145,7 +136,6 @@
    config.width = w;
    config.height = h;

    // 清除错误状态
    out.textContent = '';
    ['gh-width', 'gh-height'].forEach(id => document.getElementById(id).classList.remove('error'));

@@ -171,7 +161,7 @@
    out.textContent = "Chargement du devis...";

    try {
      const resp = await fetch('https://80a67dd4-043a-437b-9b31-fec40991fe12-00-4rtgpz7r016u.worf.replit.dev/api/devis', {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
@@ -202,7 +192,6 @@
    }
  });

  // 初始显示
  updateSizeHint();
  updateOBButtonState();
});
