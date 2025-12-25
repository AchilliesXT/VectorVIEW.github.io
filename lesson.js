// CANVAS SETUP
const canvas = document.getElementById('lessonCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('angleSlider');
const readout = document.getElementById('readout');

const size = 340;
const center = size / 2;
const scale = 100;

// DETECT PATTERN TYPE FROM HTML
// We will look for a variable 'patternType' defined in the HTML file
// If not found, default to cardioid
const type = (typeof patternType !== 'undefined') ? patternType : 'cardioid';

function drawGraph() {
    ctx.clearRect(0, 0, size, size);

    // 1. Draw Grid (Concentric Circles)
    ctx.strokeStyle = '#E5ECF5';
    ctx.lineWidth = 1;
    for (let r = 0.25; r <= 1; r += 0.25) {
        ctx.beginPath();
        ctx.arc(center, center, scale * r, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 2. Draw The Shape (Based on Page Type)
    ctx.beginPath();
    ctx.strokeStyle = '#D1D9E6'; // Grey outline (Static)
    ctx.lineWidth = 2;

    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
        let r = calculateR(type, t);
        ctx.lineTo(center + r * Math.cos(t), center + r * Math.sin(t));
    }
    ctx.stroke();

    // 3. Draw Active User Line
    let inputAngle = slider.value; 
    let rad = (inputAngle * Math.PI) / 180;
    
    // Rotate -90 degrees so 0 is at the top
    let plotRad = rad - Math.PI / 2; 

    // Calculate R for the red active line
    let r = calculateR(type, plotRad);

    // Draw the Line
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + Math.cos(plotRad) * scale, center + Math.sin(plotRad) * scale);
    ctx.strokeStyle = '#19D3B3';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw the Dot
    let dotX = center + r * Math.cos(plotRad);
    let dotY = center + r * Math.sin(plotRad);
    
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#19D3B3';
    ctx.fill();

    // Update Text Readout (0-100%)
    // We normalize the 'r' value to a percentage
    let percentage = Math.round((r / scale) * 100);
    // Fix: Ensure percentage doesn't exceed 100 or drop below 0 due to math quirks
    if (percentage > 100) percentage = 100;
    readout.innerHTML = `Signal Strength: ${percentage}%`;
}

// MATH HELPER: Calculates Radius 'r' for different shapes
function calculateR(pType, angle) {
    if (pType === 'cardioid') {
        // Heart shape: 1 + cos(theta)
        return scale * (1 + Math.cos(angle - Math.PI / 2)) * 0.5;
    } 
    else if (pType === 'figure8') {
        // Figure 8: Two lobes (front and back)
        // Math.abs(cos(theta)) creates the two loops
        return scale * Math.abs(Math.cos(angle - Math.PI / 2));
    } 
    else if (pType === 'omni') {
        // Circle: Constant radius
        return scale * 0.8; 
    } 
    else if (pType === 'spiral') {
        // Archimedean Spiral: r increases with angle
        // We normalize angle to be 0 to 2PI for a clean loop
        let normalizedAngle = (angle + Math.PI/2) % (Math.PI*2);
        if(normalizedAngle < 0) normalizedAngle += Math.PI*2;
        return scale * (normalizedAngle / (Math.PI*2));
    }
    return scale; // Default
}

// Listeners
slider.addEventListener('input', drawGraph);
drawGraph(); // Run once on load


// --- CHALLENGE LOGIC (Works for all pages) ---
const select = document.getElementById('challengeSelect');
const feedback = document.getElementById('challengeFeedback');

if (select) { // Only run if the dropdown exists
    select.addEventListener('change', function() {
        let choice = select.value;
        let correct = select.getAttribute('data-correct'); // Read correct answer from HTML

        if (choice === correct) {
            feedback.textContent = "Correct! You chose the right pattern for this job.";
            feedback.className = "feedback-box success";
        } else if (choice === 'select') {
            feedback.textContent = "";
        } else {
            feedback.textContent = "Not quite. Think about where the sound is coming from.";
            feedback.className = "feedback-box fail";
        }
    });
}