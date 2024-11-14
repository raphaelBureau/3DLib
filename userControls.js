export default class UserControls {
    constructor(screen) {
        this.s = screen;
        this.keyW = false;
        this.keyA = false;
        this.keyS = false;
        this.keyD = false;
        this.arrowUp = false;
        this.arrowDown = false;
        this.arrowLeft = false;
        this.arrowRight = false;
        this.space = false;
        this.shift = false;
        this.keyF = false;
        this.keyFToggle = false;
        this.keyP = false;
        this.keyPToggle = false;
        this.keyR = false;
        this.keyRToggle = false;
    }
    onKeyDown(event) {
        let keyCode = event.keyCode;
        //console.log(keyCode);
        switch (keyCode) {
            case 68: //d
                this.keyD = true;
                break;
            case 83: //s
                this.keyS = true;
                break;
            case 65: //a
                this.keyA = true;
                break;
            case 87: //w
                this.keyW = true;
                break;
            case 37:
                this.arrowLeft = true;
                break;
            case 38:
                this.arrowUp = true;
                break;
            case 39:
                this.arrowRight = true;
                break;
            case 40:
                this.arrowDown = true;
                break;
            case 16:
                this.shift = true;
                break;
            case 32:
                this.space = true;
                break;
            case 70:
                if (!this.keyF) {
                    this.keyFToggle = !this.keyFToggle;
                }
                this.keyF = true;
                break;
            case 80:
                if (!this.keyP) {
                    this.keyPToggle = !this.keyPToggle;
                }
                this.keyP = true;
                break;
            case 82:
                if (!this.keyR) {
                    this.keyRToggle = !this.keyRToggle;
                }
                this.keyR = true;
                break;
        }
    }
    onKeyUp(event) {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case 68: //d
                this.keyD = false;
                break;
            case 83: //s
                this.keyS = false;
                break;
            case 65: //a
                this.keyA = false;
                break;
            case 87: //w
                this.keyW = false;
                break;
            case 37:
                this.arrowLeft = false;
                break;
            case 38:
                this.arrowUp = false;
                break;
            case 39:
                this.arrowRight = false;
                break;
            case 40:
                this.arrowDown = false;
                break;
            case 16:
                this.shift = false;
                break;
            case 32:
                this.space = false;
                break;
            case 70:
                this.keyF = false;
                break;
            case 80:
                this.keyP = false;
                break;
            case 82:
                this.keyR = false;
                break;
        }
    }
    Update(deltaTime) {
        let lookSpeed = 1;
        if (this.keyA) {
            this.s.Move([-1, 0, 0], deltaTime);
        }
        if (this.keyD) {
            this.s.Move([1, 0, 0], deltaTime);
        }
        if (this.keyW) {
            this.s.Move([0, 0, 1], deltaTime);
        }
        if (this.keyS) {
            this.s.Move([0, 0, -1], deltaTime);
        }
        if (this.arrowUp) {
            this.s.rot[0] -= lookSpeed * deltaTime;
            this.s.UpdateRotMat();
        }
        if (this.arrowDown) {
            this.s.rot[0] += lookSpeed * deltaTime;
            this.s.UpdateRotMat();
        }
        if (this.arrowLeft) {
            this.s.rot[1] += lookSpeed * deltaTime;
            this.s.UpdateRotMat();
        }
        if (this.arrowRight) {
            this.s.rot[1] -= lookSpeed * deltaTime;
            this.s.UpdateRotMat();
        }
        if (this.space) {
            this.s.pos[1] -= 100 * deltaTime;
        }
        if (this.shift) {
            this.s.pos[1] += 100 * deltaTime;
        }
    }
}
