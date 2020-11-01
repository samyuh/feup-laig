class MyKeyframe {
    constructor(instant, translation, rotation, scale) {
        // --- Time --- //
        this.instant = instant;

        // --- Transformations --- //
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }
}