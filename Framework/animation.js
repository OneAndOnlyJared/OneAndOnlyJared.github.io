document.addEventListener('DOMContentLoaded', function () {
    // Create a Pixi.js Application
    const app = new PIXI.Application({
        width: 800,
        height: 200,
        view: document.getElementById('header'), // Use the header div as the canvas
        transparent: true,
    });

    // Add the Pixi.js canvas as a background for the header
    app.view.style.position = 'absolute';

    // Create a Graphics object for the header background
    const headerBackground = new PIXI.Graphics();
    headerBackground.beginFill(0x333333); // Initial background color
    headerBackground.drawRect(0, 0, app.renderer.width, app.renderer.height);
    headerBackground.endFill();

    // Add the header background to the stage
    app.stage.addChild(headerBackground);

    // Define the new background color on hover
    const newColor = 0x0066ff; // Blue

    // Add interactivity to change the background color on hover
    headerBackground.interactive = true;
    headerBackground.buttonMode = true;

    headerBackground.on('mouseover', () => {
        headerBackground.tween = new TWEEN.Tween(headerBackground)
            .to({ tint: newColor }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                headerBackground.clear();
                headerBackground.beginFill(headerBackground.tint);
                headerBackground.drawRect(0, 0, app.renderer.width, app.renderer.height);
                headerBackground.endFill();
            })
            .start();
    });

    headerBackground.on('mouseout', () => {
        headerBackground.tween = new TWEEN.Tween(headerBackground)
            .to({ tint: 0x333333 }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                headerBackground.clear();
                headerBackground.beginFill(headerBackground.tint);
                headerBackground.drawRect(0, 0, app.renderer.width, app.renderer.height);
                headerBackground.endFill();
            })
            .start();
    });

    // Start the Pixi.js animation loop
    app.ticker.add(() => {
        TWEEN.update();
    });
});
