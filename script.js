const canvas = document.getElementById('polarCanvas');


const ctx = canvas.getContext('2d');

  // ⬇️ KEEP ALL YOUR EXISTING CODE HERE ⬇️
  // (size, center, scale, draw(), animation, everything)


// Canvas Settings (High DPI fix)
const size = 400;
canvas.width = size;
canvas.height = size;
const center = size / 2;
const scale = 140; // Size of the graph

let angle = 0; // Current angle for the scanning ray

function draw() {
    ctx.clearRect(0, 0, size, size);

    // 1. Draw Polar Grid (Concentric Circles)
    ctx.strokeStyle = '#E5ECF5'; // Very light grey
    ctx.lineWidth = 1;
    
    for (let r = 0.2; r <= 1; r += 0.2) {
        ctx.beginPath();
        ctx.arc(center, center, scale * r, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 2. Draw Spokes (Lines radiating from center)
    for (let i = 0; i < 360; i += 45) {
        let rad = (i * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + Math.cos(rad) * scale, center + Math.sin(rad) * scale);
        ctx.stroke();
    }

    // 3. Draw Cardioid Curve
    // Formula: r = 1 - cos(theta) (Rotated to point up/front)
    ctx.beginPath();
    ctx.strokeStyle = '#19D3B3'; // Teal
    ctx.lineWidth = 3;

    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
        // Standard Cardioid Equation: r = a(1 - cos(t))
        // We rotate it -90 degrees (Math.PI/2) so the "front" faces up
        let r = scale * (1 - Math.cos(t - Math.PI / 2)) * 0.5; 
        
        let x = center + r * Math.cos(t);
        let y = center + r * Math.sin(t);
        
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // 4. Draw Rotating Scan Ray
    let rad = (angle * Math.PI) / 180;
    
    // Calculate R at this specific angle for the dot
    let currentR = scale * (1 - Math.cos(rad - Math.PI / 2)) * 0.5;
    
    // Draw the Ray
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + Math.cos(rad) * scale, center + Math.sin(rad) * scale);
    ctx.strokeStyle = 'rgba(25, 211, 179, 0.4)'; // Transparent Teal
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the Intersection Dot
    let dotX = center + currentR * Math.cos(rad);
    let dotY = center + currentR * Math.sin(rad);

    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#19D3B3';
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#19D3B3';

    // Reset shadow for next frame
    ctx.shadowBlur = 0;

    // Increment Angle
    angle = (angle + 1) % 360;

    requestAnimationFrame(draw);
}

// Start Animation

draw();

