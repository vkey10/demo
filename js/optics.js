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
