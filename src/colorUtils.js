export const rgbToCmyk = (r, g, b) => {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  const k = Math.min(c, Math.min(m, y));

  if (k < 1) {
    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);
  } else {
    c = 0;
    m = 0;
    y = 0;
  }
  return { c: c * 100, m: m * 100, y: y * 100, k: k * 100 };
};

export const cmykToRgb = (c, m, y, k) => {
  const r = 255 * (1 - c / 100) * (1 - k / 100);
  const g = 255 * (1 - m / 100) * (1 - k / 100);
  const b = 255 * (1 - y / 100) * (1 - k / 100);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
};

export const rgbToXyz = (r, g, b) => {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;
  return { x, y, z };
};

export const xyzToLab = (x, y, z) => {
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  x = x / refX;
  y = y / refY;
  z = z / refZ;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (x * 7.787) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (y * 7.787) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (z * 7.787) + (16 / 116);

  const l = (116 * y) - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return { l, a, b };
};

export const labToXyz = (l, a, b) => {
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  const y = (l + 16) / 116;
  const x = a / 500 + y;
  const z = y - b / 200;

  const y3 = Math.pow(y, 3);
  const x3 = Math.pow(x, 3);
  const z3 = Math.pow(z, 3);

  const xConverted = x3 > 0.008856 ? x3 * refX : (x - 16 / 116) / 7.787 * refX;
  const yConverted = y3 > 0.008856 ? y3 * refY : (y - 16 / 116) / 7.787 * refY;
  const zConverted = z3 > 0.008856 ? z3 * refZ : (z - 16 / 116) / 7.787 * refZ;

  return { x: xConverted, y: yConverted, z: zConverted };
};

export const xyzToRgb = (x, y, z) => {
  const rLinear = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const gLinear = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  const bLinear = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  const r = rLinear > 0.0031308 ? 1.055 * Math.pow(rLinear, 1 / 2.4) - 0.055 : 12.92 * rLinear;
  const g = gLinear > 0.0031308 ? 1.055 * Math.pow(gLinear, 1 / 2.4) - 0.055 : 12.92 * gLinear;
  const b = bLinear > 0.0031308 ? 1.055 * Math.pow(bLinear, 1 / 2.4) - 0.055 : 12.92 * bLinear;

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};