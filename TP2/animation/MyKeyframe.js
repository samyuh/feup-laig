/**
 * MyDefBarrel
 * @constructor
 * @param {integer} instant - keyframe instant
 * @param {Array} translation - vector with the translation of keyframe
 * @param {Array} rotation - vector with the rotation of keyframe
 * @param {Array} scale - vector with scale of keyframe
 */
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