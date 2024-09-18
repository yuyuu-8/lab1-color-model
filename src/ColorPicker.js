import React, { useState } from 'react';
import { rgbToCmyk, cmykToRgb, rgbToXyz, xyzToLab, labToXyz, xyzToRgb } from './colorUtils';

function ColorPicker() {
  const [colorRGB, setColorRGB] = useState({ r: 255, g: 0, b: 0 });
  const [colorCMYK, setColorCMYK] = useState({ c: 0, m: 0, y: 0, k: 0 });
  const [colorLAB, setColorLAB] = useState({ l: 0, a: 0, b: 0 });
  const [warning, setWarning] = useState('');

  const checkRange = (value, min, max) => {
    return value < min || value > max;
  };

  const updateWarning = () => {
    let warningMessage = '';

    if (checkRange(colorRGB.r, 0, 255) || checkRange(colorRGB.g, 0, 255) || checkRange(colorRGB.b, 0, 255)) {
      warningMessage += 'RGB value out of range (0-255). ';
    }

    if (checkRange(colorCMYK.c, 0, 100) || checkRange(colorCMYK.m, 0, 100) || checkRange(colorCMYK.y, 0, 100) || checkRange(colorCMYK.k, 0, 100)) {
      warningMessage += 'CMYK value out of range (0-100). ';
    }

    if (checkRange(colorLAB.l, 0, 100) || checkRange(colorLAB.a, -128, 127) || checkRange(colorLAB.b, -128, 127)) {
      warningMessage += 'LAB value out of range (L: 0-100, a: -128-127, b: -128-127). ';
    }

    setWarning(warningMessage.trim());
  };

  const updateColors = (rgb) => {
    try {
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
      const lab = xyzToLab(xyz.x, xyz.y, xyz.z);

      setColorCMYK(cmyk);
      setColorLAB(lab);
      updateWarning();
    } catch (error) {
      setWarning('Incorrect color value. Maybe some truncation or rounding occurring..');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(0, Math.min(255, Number(value)));
    setColorRGB(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      updateColors(updated);
      return updated;
    });
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    setColorRGB(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      updateColors(updated);
      return updated;
    });
  };

  const handleCMYKChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(0, Math.min(100, Number(value)));
    setColorCMYK(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      const rgb = cmykToRgb(updated.c, updated.m, updated.y, updated.k);
      setColorRGB(rgb);
      const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
      const lab = xyzToLab(xyz.x, xyz.y, xyz.z);
      setColorLAB(lab);
      updateWarning();
      return updated;
    });
  };

  const handleLABChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(-128, Math.min(127, Number(value)));
    setColorLAB(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      const xyz = labToXyz(updated.l, updated.a, updated.b);
      const rgb = xyzToRgb(xyz.x, xyz.y, xyz.z);
      setColorRGB(rgb);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      setColorCMYK(cmyk);
      updateWarning();
      return updated;
    });
  };

  const rgbColor = `rgb(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b})`;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="color-box" style={{ backgroundColor: rgbColor, width: '200px', height: '200px', marginRight: '20px' }}>
      </div>

      <div>
        {warning && <div className="warning" style={{ color: 'red', marginBottom: '20px' }}>{warning}</div>}

        <h2>RGB</h2>
        <div>
          <label>R:
            <input type="number" name="r" value={colorRGB.r} onChange={handleInputChange} max="255" min="0" />
          </label>
          <label>G:
            <input type="number" name="g" value={colorRGB.g} onChange={handleInputChange} max="255" min="0" />
          </label>
          <label>B:
            <input type="number" name="b" value={colorRGB.b} onChange={handleInputChange} max="255" min="0" />
          </label>
        </div>
        <div>
          <label>R:
            <input type="range" name="r" value={colorRGB.r} onChange={handleSliderChange} max="255" min="0" />
          </label>
          <label>G:
            <input type="range" name="g" value={colorRGB.g} onChange={handleSliderChange} max="255" min="0" />
          </label>
          <label>B:
            <input type="range" name="b" value={colorRGB.b} onChange={handleSliderChange} max="255" min="0" />
          </label>
        </div>

        <h2>CMYK</h2>
        <div>
          <label>C:
            <input type="number" name="c" value={colorCMYK.c} onChange={handleCMYKChange} max="100" min="0" />
          </label>
          <label>M:
            <input type="number" name="m" value={colorCMYK.m} onChange={handleCMYKChange} max="100" min="0" />
          </label>
          <label>Y:
            <input type="number" name="y" value={colorCMYK.y} onChange={handleCMYKChange} max="100" min="0" />
          </label>
          <label>K:
            <input type="number" name="k" value={colorCMYK.k} onChange={handleCMYKChange} max="100" min="0" />
          </label>
        </div>
        <div>
          <label>C:
            <input type="range" name="c" value={colorCMYK.c} onChange={handleCMYKChange} max="100" min="0" />
          </label>
          <label>M:
            <input type="range" name="m" value={colorCMYK.m} onChange={handleCMYKChange} max="100" min="0" />
          </label>
          <label>Y:
            <input type="range" name="y" value={colorCMYK.y} onChange={handleCMYKChange} max="100" min="0" />
          </label>
          <label>K:
            <input type="range" name="k" value={colorCMYK.k} onChange={handleCMYKChange} max="100" min="0" />
          </label>
        </div>

        <h2>LAB</h2>
        <div>
          <label>L:
            <input type="number" name="l" value={colorLAB.l} onChange={handleLABChange} max="100" min="0" />
          </label>
          <label>A:
            <input type="number" name="a" value={colorLAB.a} onChange={handleLABChange} max="127" min="-128" />
          </label>
          <label>B:
            <input type="number" name="b" value={colorLAB.b} onChange={handleLABChange} max="127" min="-128" />
          </label>
        </div>
        <div>
          <label>L:
            <input type="range" name="l" value={colorLAB.l} onChange={handleLABChange} max="100" min="0" />
          </label>
          <label>A:
            <input type="range" name="a" value={colorLAB.a} onChange={handleLABChange} max="127" min="-128" />
          </label>
          <label>B:
            <input type="range" name="b" value={colorLAB.b} onChange={handleLABChange} max="127" min="-128" />
          </label>
        </div>

        <button onClick={() => document.getElementById('colorPicker').click()} style={{ marginTop: '20px' }}>
          Choose from palette
        </button>

        <input
          id="colorPicker"
          type="color"
          value={rgbColor}
          onChange={(e) => {
            const hex = e.target.value;
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            setColorRGB({ r, g, b });
            updateColors({ r, g, b });
          }}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default ColorPicker;
