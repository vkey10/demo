class OpticsSimulator {
    constructor() {
        this.canvas = document.getElementById('opticsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentType = 'convex-lens';
        this.focalLength = 100;
        this.objectDistance = 150;
        this.objectHeight = 50;
        
        this.setupCanvas();
    }

    setupCanvas() {
        // Set canvas dimensions
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerY = this.height / 2;
        this.opticalCenter = this.width / 2;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawAxis() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000';
        this.ctx.setLineDash([5, 5]);
        
        // Principal axis
        this.ctx.moveTo(0, this.centerY);
        this.ctx.lineTo(this.width, this.centerY);
        
        // Optical axis
        this.ctx.moveTo(this.opticalCenter, 0);
        this.ctx.lineTo(this.opticalCenter, this.height);
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawLens() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 2;

        if (this.currentType === 'convex-lens') {
            // Draw convex lens
            this.ctx.moveTo(this.opticalCenter - 10, this.centerY - 80);
            this.ctx.quadraticCurveTo(this.opticalCenter + 20, this.centerY, this.opticalCenter - 10, this.centerY + 80);
            this.ctx.moveTo(this.opticalCenter + 10, this.centerY - 80);
            this.ctx.quadraticCurveTo(this.opticalCenter - 20, this.centerY, this.opticalCenter + 10, this.centerY + 80);
        } else {
            // Draw concave lens
            this.ctx.moveTo(this.opticalCenter - 10, this.centerY - 80);
            this.ctx.quadraticCurveTo(this.opticalCenter - 30, this.centerY, this.opticalCenter - 10, this.centerY + 80);
            this.ctx.moveTo(this.opticalCenter + 10, this.centerY - 80);
            this.ctx.quadraticCurveTo(this.opticalCenter + 30, this.centerY, this.opticalCenter + 10, this.centerY + 80);
        }

        this.ctx.stroke();
    }

    drawMirror() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 2;

        if (this.currentType === 'concave-mirror') {
            // Draw concave mirror
            this.ctx.arc(this.opticalCenter + 100, this.centerY, 100, Math.PI - 0.5, Math.PI + 0.5);
        } else {
            // Draw convex mirror
            this.ctx.arc(this.opticalCenter - 100, this.centerY, 100, -0.5, 0.5);
        }

        this.ctx.stroke();
    }

    drawObject() {
        const objectX = this.opticalCenter - this.objectDistance;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#2ecc71';
        this.ctx.lineWidth = 2;
        
        // Draw object arrow
        this.ctx.moveTo(objectX, this.centerY);
        this.ctx.lineTo(objectX, this.centerY - this.objectHeight);
        this.ctx.lineTo(objectX - 5, this.centerY - this.objectHeight + 10);
        this.ctx.moveTo(objectX, this.centerY - this.objectHeight);
        this.ctx.lineTo(objectX + 5, this.centerY - this.objectHeight + 10);
        
        this.ctx.stroke();
    }

    calculateImage() {
        // Simple thin lens equation: 1/f = 1/u + 1/v
        const f = this.focalLength;
        const u = this.objectDistance;
        
        // Calculate image distance
        const v = (u * f) / (u - f);
        
        // Calculate magnification
        const m = -v / u;
        
        // Calculate image height
        const imageHeight = this.objectHeight * m;
        
        return {
            distance: v,
            height: imageHeight
        };
    }

    drawImage() {
        const image = this.calculateImage();
        const imageX = this.opticalCenter + image.distance;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.setLineDash([5, 5]);
        
        // Draw image arrow
        this.ctx.moveTo(imageX, this.centerY);
        this.ctx.lineTo(imageX, this.centerY - image.height);
        this.ctx.lineTo(imageX - 5, this.centerY - image.height + 10);
        this.ctx.moveTo(imageX, this.centerY - image.height);
        this.ctx.lineTo(imageX + 5, this.centerY - image.height + 10);
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    render() {
        this.clear();
        this.drawAxis();
        
        if (this.currentType.includes('lens')) {
            this.drawLens();
        } else {
            this.drawMirror();
        }
        
        this.drawObject();
        this.drawImage();
    }

    updateType(type) {
        this.currentType = type;
        this.render();
    }

    updateParameters(focalLength, objectDistance, objectHeight) {
        this.focalLength = focalLength;
        this.objectDistance = objectDistance;
        this.objectHeight = objectHeight;
        this.render();
    }
}
class RayTracer {
    constructor(simulator) {
        this.simulator = simulator;
        this.ctx = simulator.ctx;
    }

    drawRay(startX, startY, endX, endY, color = '#e67e22') {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    traceParallelRay() {
        const objectX = this.simulator.opticalCenter - this.simulator.objectDistance;
        const objectY = this.simulator.centerY - this.simulator.objectHeight;
        
        // Ray parallel to principal axis
        this.drawRay(
            objectX,
            objectY,
            this.simulator.opticalCenter,
            objectY
        );

        // Ray through focal point
        const image = this.simulator.calculateImage();
        const imageX = this.simulator.opticalCenter + image.distance;
        const imageY = this.simulator.centerY - image.height;
        
        this.drawRay(
            this.simulator.opticalCenter,
            objectY,
            imageX,
            imageY
        );
    }

    traceFocalRay() {
        const objectX = this.simulator.opticalCenter - this.simulator.objectDistance;
        const objectY = this.simulator.centerY - this.simulator.objectHeight;
        const focalX = this.simulator.opticalCenter + this.simulator.focalLength;
        
        // Ray through focal point
        this.drawRay(
            objectX,
            objectY,
            this.simulator.opticalCenter,
            this.simulator.centerY + (this.simulator.focalLength * Math.tan(Math.atan2(objectY - this.simulator.centerY, objectX - this.simulator.opticalCenter)))
        );

        // Refracted ray
        const image = this.simulator.calculateImage();
        const imageX = this.simulator.opticalCenter + image.distance;
        const imageY = this.simulator.centerY - image.height;
        
        this.drawRay(
            this.simulator.opticalCenter,
            this.simulator.centerY + (this.simulator.focalLength * Math.tan(Math.atan2(objectY - this.simulator.centerY, objectX - this.simulator.opticalCenter))),
            imageX,
            imageY
        );
    }

    trace() {
        this.traceParallelRay();
        this.traceFocalRay();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const simulator = new OpticsSimulator();
    const rayTracer = new RayTracer(simulator);

    // Tab controls
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            simulator.updateType(tab.dataset.type);
            updateInfo(tab.dataset.type);
        });
    });

    // Slider controls
    const focalLengthSlider = document.getElementById('focalLength');
    const objectDistanceSlider = document.getElementById('objectDistance');
    const objectHeightSlider = document.getElementById('objectHeight');

    const focalValue = document.getElementById('focalValue');
    const distanceValue = document.getElementById('distanceValue');
    const heightValue = document.getElementById('heightValue');

    function updateSimulation() {
        simulator.updateParameters(
            parseInt(focalLengthSlider.value),
            parseInt(objectDistanceSlider.value),
            parseInt(objectHeightSlider.value)
        );
        rayTracer.trace();
        
        focalValue.textContent = focalLengthSlider.value;
        distanceValue.textContent = objectDistanceSlider.value;
        heightValue.textContent = objectHeightSlider.value;
    }

    focalLengthSlider.addEventListener('input', updateSimulation);
    objectDistanceSlider.addEventListener('input', updateSimulation);
    objectHeightSlider.addEventListener('input', updateSimulation);

   
    // Initial render
    simulator.render();
    rayTracer.trace();
    updateInfo('convex-lens');
});