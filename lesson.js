// CANVAS SETUP
const canvas = document.getElementById('lessonCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('angleSlider');
const readout = document.getElementById('readout');

const size = 340;
const center = size / 2;
const scale = 100;

// DETECT PATTERN TYPE FROM HTML
const type = (typeof patternType !== 'undefined') ? patternType : 'cardioid';

function drawGraph() {
    ctx.clearRect(0, 0, size, size);

    // 1. Draw Grid
    ctx.strokeStyle = '#E5ECF5';
    ctx.lineWidth = 1;
    // Draw 3 circles as a reference grid
    for (let r = 0.33; r <= 1; r += 0.33) {
        ctx.beginPath();
        ctx.arc(center, center, scale * r, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 2. Draw The Shape
    ctx.beginPath();
    ctx.strokeStyle = '#D1D9E6'; 
    ctx.lineWidth = 2;

    // Loop through 360 degrees to draw the full shape
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
        let r = calculateR(type, t);
        
        // Convert polar (r, angle) to cartesian (x, y)
        let x = center + r * Math.cos(t);
        let y = center + r * Math.sin(t);
        ctx.lineTo(x, y);
    }
    ctx.closePath(); // Connect the end back to start
    ctx.stroke();

    // 3. Draw Active User Line (The Interactive Part)
    let inputAngle = slider.value; 
    let rad = (inputAngle * Math.PI) / 180;
    
    // Rose curves are drawn starting from 0 (Right side), others usually start from -90 (Top)
    let plotRad = rad; 
    if (type !== 'rose') {
        plotRad = rad - Math.PI / 2;
    }

    let r = calculateR(type, plotRad);

    // Draw Line from center
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + r * Math.cos(plotRad), center + r * Math.sin(plotRad));
    ctx.strokeStyle = (type === 'rose') ? '#ff6b6b' : '#19D3B3'; // Red for Rose, Green for others
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Dot at the tip
    let dotX = center + r * Math.cos(plotRad);
    let dotY = center + r * Math.sin(plotRad);
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = (type === 'rose') ? '#ff6b6b' : '#19D3B3';
    ctx.fill();

    // Update Text Readout
    if (readout) {
        if(type === 'rose') {
             readout.innerHTML = `Angle: ${inputAngle}°`;
        } else {
             let percent = Math.round((Math.abs(r)/scale)*100);
             readout.innerHTML = `Signal: ${percent}%`;
        }
    }
}

// --- THE MATH LOGIC ---
function calculateR(pType, angle) {
    
    // --- ROSE CURVE LOGIC ---
    if (pType === 'rose') {
        // Equation: r = cos(k * theta)
        // k=2 gives 4 petals
        return scale * Math.cos(2 * angle);
    } 
    
    // --- OTHER PATTERNS ---
    else if (pType === 'cardioid') {
        return scale * (1 + Math.cos(angle - Math.PI / 2)) * 0.5;
    } 
    else if (pType === 'omni') {
        return scale * 0.8; 
    } 
    else if (pType === 'figure8') {
        return scale * Math.abs(Math.cos(angle - Math.PI / 2));
    }
    else if (pType === 'spiral') {
        return scale * angle
    }
    return scale;
}

// Start the drawing loop
if (slider) {
    slider.addEventListener('input', drawGraph);
    drawGraph();

}

