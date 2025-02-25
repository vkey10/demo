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