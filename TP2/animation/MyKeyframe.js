class KeyFrame {
    constructor(instant, translation, rotationX, rotationY, rotationZ, scale) {
        this.instant = instant;
        this.translation = translation;
        this.rotationX = rotationX;
        this.rotationY = rotationY;
        this.rotationZ = rotationZ;
        this.scale = scale;
        this.values;    // Calculate final [x,y,z] values of keyframe
    }
}