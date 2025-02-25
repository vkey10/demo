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
