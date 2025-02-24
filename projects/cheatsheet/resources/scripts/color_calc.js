// Declare namedColors globally
let namedColors = {};

// Function to update color based on the input source
function updateColor(source) {
    const hexInput = document.getElementById('hex');
    const rgbInput = document.getElementById('rgb');
    const hslInput = document.getElementById('hsl');
    const colorInput = document.getElementById('color');
    const preview = document.getElementById('colorPreview');
    
    if (source === 'hex') { 
        const rgb = hexToRgb(hexInput.value);
        const hsl = rgbToHsl(...rgb.split(',').map(Number));
        rgbInput.value = rgb;
        hslInput.value = hsl;
        colorInput.value = Object.keys(namedColors).find(name => namedColors[name] === hexInput.value.toUpperCase()) || hexInput.value;
        preview.style.backgroundColor = hexInput.value;
    } else if (source === 'rgb') {
        const hex = rgbToHex(...rgbInput.value.split(',').map(Number));
        const hsl = rgbToHsl(...rgbInput.value.split(',').map(Number));
        hexInput.value = hex;
        hslInput.value = hsl;
        colorInput.value = Object.keys(namedColors).find(name => namedColors[name] === hex) || hex;
        preview.style.backgroundColor = `rgb(${rgbInput.value})`;
    } else if (source === 'hsl') {
        const rgb = hslToRgb(...hslInput.value.replace(/%/g, '').split(',').map(Number));
        const hex = rgbToHex(...rgb.split(',').map(Number));
        hexInput.value = hex;
        rgbInput.value = rgb;
        colorInput.value = Object.keys(namedColors).find(name => namedColors[name] === hex) || hex;
        preview.style.backgroundColor = `hsl(${hslInput.value})`;
    } else if (source === 'color') {
        const hex = namedColors[colorInput.value.toLowerCase()] || colorInput.value;
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(...rgb.split(',').map(Number));
        hexInput.value = hex;
        rgbInput.value = rgb;
        hslInput.value = hsl;
        preview.style.backgroundColor = hex;
    }
    // Update the output text
    document.getElementById('output').textContent = `Selected Color: ${hexInput.value}`;
}

// Function to set up color input event listeners
function setupColorInputs() {
    fetch('./resources/scripts/named_colors.json') // Load named_colors.json
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => { // Store named colors in a global variable
            namedColors = data;
            console.log('namedColors loaded:', namedColors); // Add this line for debugging

            document.getElementById('hex').addEventListener('input', () => updateColor('hex'));
            document.getElementById('rgb').addEventListener('input', () => updateColor('rgb'));
            document.getElementById('hsl').addEventListener('input', () => updateColor('hsl'));
            document.getElementById('color').addEventListener('input', () => updateColor('color'));
            document.getElementById('color').addEventListener('keyup', showColorDropdown);
        })
        .catch(error => console.error('Error loading named_colors.json:', error));
}

// Initialize color input event listeners
setupColorInputs(); // Call this function in the beginning

// Function to clear all input fields and reset the preview
function clearInputs() {
    document.getElementById('hex').value = '';
    document.getElementById('rgb').value = '';
    document.getElementById('hsl').value = '';
    document.getElementById('color').value = '';
    document.getElementById('colorPreview').style.backgroundColor = 'transparent';
    document.getElementById('output').textContent = 'Selected Color:';
}

// Function to show the color dropdown based on the input
function showColorDropdown() {
    const input = document.getElementById('color').value.toLowerCase();
    const dropdown = document.getElementById('colorDropdown');
    dropdown.innerHTML = '';

    if (input) { // Show the dropdown only if input is not empty
        const matchingColors = Object.keys(namedColors).filter(name => name.startsWith(input));
        matchingColors.forEach(color => {
            const div = document.createElement('div');
            div.textContent = color;
            div.onclick = () => {
                document.getElementById('color').value = color;
                updateColor('color');
                dropdown.innerHTML = '';
                dropdown.style.display = 'none'; // Hide the dropdown after selection
            };
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block'; // Show the dropdown
    } else {
        dropdown.style.display = 'none'; // Hide the dropdown if input is empty
    }
}

// Function to convert hex color to RGB
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = (bigint & 255);
    return `${r},${g},${b}`;
}

// Function to convert RGB color to hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Function to convert RGB color to HSL
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

// Function to convert HSL color to RGB
function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/3) return q;
            if (t < 1/2) return p + (q - p) * 6 * (2/3 - t);
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return `${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)}`;
}
