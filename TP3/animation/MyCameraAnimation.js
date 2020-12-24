class MyCameraAnimation {
    constructor(scene, initialCamera, finalCamera) {
        this.scene = scene;
        this.initialCamera = initialCamera;
        this.finalCamera = finalCamera;

        this.angleInitialCamera = initialCamera.fov;
        this.nearInitialCamera = initialCamera.near;
        this.farInitialCamera = initialCamera.far;
        this.positionInitialCamera = initialCamera.position;
        this.targetInitialCamera = initialCamera.target;
        
        this.angleFinalCamera = finalCamera.fov;
        this.nearFinalCamera = finalCamera.near;
        this.farFinalCamera = finalCamera.far;
        this.positionFinalCamera = finalCamera.position;
        this.targetFinalCamera = finalCamera.target;

        this.totalTime = 1.5;
        this.currentTime = 0;
        this.startTime = null;
        this.active = true;

        this.currentCamera = this.initialCamera;
    }

    update(elapsedTime) {
        this.currentTime += elapsedTime;

        if (!this.active)
            return 0;

        if(this.currentTime <= this.totalTime) {
            var percentageTime = (this.totalTime - this.currentTime) / (this.totalTime);

            let newPosition = [0, 0, 0];
            vec3.lerp(newPosition, this.positionFinalCamera, this.positionInitialCamera, percentageTime);

            let newTarget = [0, 0, 0];
            vec3.lerp(newTarget, this.targetFinalCamera, this.targetInitialCamera, percentageTime);

            let near = this.nearFinalCamera + percentageTime * (this.nearInitialCamera - this.nearFinalCamera);
            let far = this.farFinalCamera + percentageTime * (this.farInitialCamera - this.farFinalCamera);
            let fov = this.angleFinalCamera + percentageTime * (this.angleInitialCamera - this.angleFinalCamera);
            
            this.currentCamera = new CGFcamera(fov, near, far, newPosition, newTarget);
        }
        else {
            this.active = false;
            this.currentCamera = this.finalCamera;

            this.applyCamera();
        }
    }

    apply() {
        if (!this.active) {
            return 0;
        }

        this.applyCamera();
    }

    applyCamera() {
        this.scene.camera = this.currentCamera;
        this.scene.interface.setActiveCamera(this.scene.camera);
    }
}