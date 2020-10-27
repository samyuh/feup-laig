
class Animation {
    constructor(startTime, endTime, startTransformations, endTransformations) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.startTransformations = startTransformations; // [x, y, z]
        this.endTransformations = endTransformations;  // [x, y, z]

        this.active = false;
    }

    update(currentTime) {
        if (!this.active) 
            return 0;     
        
        if (currentTime < this.endTime) {
            let totalTime = this.endTime - this.startTime; 
            let elapsedTime = currentTime - this.startTime;

            let currentXValue = this.startTransformations[0] + (this.endTransformations[0] - this.startTransformations[0]) * (elapsedTime / totalTime);
            let currentYValue = this.startTransformations[1] + (this.endTransformations[1] - this.startTransformations[1]) * (elapsedTime / totalTime);
            let currentZValue = this.startTransformations[2] + (this.endTransformations[2] - this.startTransformations[2]) * (elapsedTime / totalTime);
        }

        // Update
    }

}