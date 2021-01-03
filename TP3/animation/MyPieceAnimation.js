/**
 * MyPieceAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Piece Object} pieceToPlay - Reference to the piece to be played
 * @param {Piece Object} pieceStack - Reference to the piece of the stack to be shown in the scene, on the auxiliary board
 * @param {Array} startPosition - initial position of the piece, in the format [x, y, z]
 * @param {Array} finalPosition - final position of the piece, in the format [x, y, z]
 */
class MyPieceAnimation {
    constructor(scene, boardSet, pieceToPlay,  pieceStack, startPosition, finalPosition) {
        this.scene = scene;
        this.totalTime = 2.5;
        this.currentTime = 0;
        this.startTime = 0;
        this.active = true;
        this.boardSet = boardSet;
        this.end = true;

        this.pieceToPlay = pieceToPlay;
        this.pieceStack = pieceStack;
        this.startPosition = startPosition;
        this.finalPosition = finalPosition;

        this.keyFrameAnim = new MyKeyframeAnimation(this.scene);
        let newKeyFrame1 = new MyKeyframe(0, [this.startPosition[0], this.startPosition[1], this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame1);

        let newKeyFrame2 = new MyKeyframe(1, [this.startPosition[0], this.startPosition[1], this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame2);

        let newKeyFrame3 = new MyKeyframe(1.3, [this.startPosition[0], this.startPosition[1] + 2, this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame3);

        let newKeyFrame4 = new MyKeyframe(2.1, [this.finalPosition[0], this.finalPosition[1] + 2, this.finalPosition[2]], [0, this.finalPosition[3], 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame4);

        let newKeyFrame5 = new MyKeyframe(2.4, [this.finalPosition[0], this.finalPosition[1], this.finalPosition[2]], [0, this.finalPosition[3], 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame5);
        this.keyFrameAnim.updateTimeValues();

        this.keyFrameAnimStack = new MyKeyframeAnimation(this.scene);
        let newKeyFrame6 = new MyKeyframe(0, [this.startPosition[0], this.startPosition[1] - 0.7, this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnimStack.addKeyframe(newKeyFrame6);

        let newKeyFrame7 = new MyKeyframe(1.5, [this.startPosition[0], this.startPosition[1] - 0.7, this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnimStack.addKeyframe(newKeyFrame7);

        let newKeyFrame8 = new MyKeyframe(2.2, [this.startPosition[0], this.startPosition[1], this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnimStack.addKeyframe(newKeyFrame8);
        this.keyFrameAnimStack.updateTimeValues();
    }

    /**
     * Update the keyframes transformations
     * @param {Array} startPosition - Start position of the animation
     * @param {Array} finalPosition - final position of the animation
     */
    updateKeyFrames(startPosition, finalPosition) {
        this.startPosition = startPosition;
        this.finalPosition = finalPosition;
        
        this.keyFrameAnim.keyframes[0].translation = [this.startPosition[0], this.startPosition[1], this.startPosition[2]];
        this.keyFrameAnim.keyframes[1].translation = [this.startPosition[0], this.startPosition[1], this.startPosition[2]];
        this.keyFrameAnim.keyframes[2].translation = [this.startPosition[0], this.startPosition[1] + 2, this.startPosition[2]];
        this.keyFrameAnim.keyframes[3].translation = [this.finalPosition[0], this.finalPosition[1] + 2, this.finalPosition[2]];
        this.keyFrameAnim.keyframes[3].rotation = [0, this.finalPosition[3], 0];
        this.keyFrameAnim.keyframes[4].translation = [this.finalPosition[0], this.finalPosition[1], this.finalPosition[2]];
        this.keyFrameAnim.keyframes[4].rotation = [0, this.finalPosition[3], 0];

        this.keyFrameAnimStack.keyframes[0].translation = [this.startPosition[0], this.startPosition[1] - 0.7, this.startPosition[2]];
        this.keyFrameAnimStack.keyframes[1].translation = [this.startPosition[0], this.startPosition[1] - 0.7, this.startPosition[2]];
        this.keyFrameAnimStack.keyframes[2].translation = [this.startPosition[0], this.startPosition[1], this.startPosition[2]];
    }

    /**
     * Update function, called periodically, which calls the update of the MyKeyframeAnimations objects of the piece being played and the piece in the stack
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.currentTime += elapsedTime;

        if((this.totalTime <= this.currentTime) && (this.end)) {
            this.boardSet.resetPiece();
            this.active = false;
            this.end = false;
            this.boardSet.pieceAnimated = false;
        }

        this.keyFrameAnim.update(elapsedTime);
        this.keyFrameAnimStack.update(elapsedTime);
    }

    /**
     * Applies the keyframe animations refering to the piece being played and the piece in the stack
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    apply() {
        if(!this.active) {
            return 0;
        }

        this.scene.pushMatrix();
        let display = this.keyFrameAnim.apply();
        if(display != 0) {
            this.boardSet.pieceAnimated = true;
            this.pieceToPlay.display();
        } 
        this.scene.popMatrix();

        this.scene.pushMatrix();
        let up = this.keyFrameAnimStack.apply();
        if(up != 0) {
            this.boardSet.pieceAnimated = true;
            this.pieceStack.display();
        } 
        this.scene.popMatrix();
    }
}