function calculatePrice() {
  const type = document.getElementById('type').value;
  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);
  const color = document.getElementById('color').value;

  if (!width || !height) {
    document.getElementById('result').innerHTML = 'Veuillez saisir largeur et hauteur.';
    return;
  }

  // Simple prix de base par m²
  let basePrice = 200;
  if (type === 'battant1') basePrice = 300;
  if (type === 'battant2') basePrice = 400;
  if (type === 'coulissant') basePrice = 500;

  // Ajustement couleur
  let colorCoef = 1;
  if (color === 'blanc_coloré') colorCoef = 1.15;
  if (color === 'coloré2faces') colorCoef = 1.3;

  const areaM2 = (width * height) / 1000000;
  const price = (basePrice * areaM2 * colorCoef).toFixed(2);

  document.getElementById('result').innerHTML = `<b>Prix estimé :</b> ${price} € (hors pose)`;
}
