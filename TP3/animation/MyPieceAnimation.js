class MyPieceAnimation {
    constructor() {
        this.totalTime = 5;
        this.currentTime = 0;

        this.active = true;
    }

    update(time) {
        this.currentTime += time;

        if(this.totalTime <= this.currentTime) this.active = false;
    }

    display() {
        console.log("animacao" + this.currentTime);
    }
}