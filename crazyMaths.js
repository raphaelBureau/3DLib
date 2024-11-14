export class CrazyMaths {
    static pow(number, power) {
        let result = number;
        while(power>1) {
            result *= number;
            power--;
        }
        return result;
    }
    static factorial(number) {
        if(number == 1) {
            return 1;
        }
        return number * this.factorial(number-1);
    }
    //le formule de mr taylor
    static sin(rads) {
        //7 facteurs pour -pi/2 et +pi/2 range
        let factors= [1, 6, 120, 5040, 40320, 362880, 39916800, 6227020800];
        let PI = this.PI();
        let sign = 1;
        let zero = 1;
        rads = rads % (PI*2);
        if(rads < 0) {
            rads *= -1;
            zero = -1;
        }
        if(rads > 3*PI/2) {
            rads -= 2*PI;
        }
        else{
        if(rads > PI) {
            rads -= PI;
            sign = -1;
        }
        else{
        if(rads > PI/2) {
            rads -= PI;
            sign = -1;
        }
        }
        }
        let result = rads;
        for(let i = 1; i <= 7; i++) {
            let valIteration = this.pow(rads, i*2+1);
            valIteration /= factors[i];
            if(i == 1) {
                result -= valIteration;
            }
            else {
                result += valIteration;
            }
        }
        return result * sign * zero;
    }
    static cos(rads) {
        let factors = [0, 2, 24, 720, 40320, 3628800, 479001600, 87178291200];
        let PI = this.PI();
        let sign = 1;
        let zero = 1;
        rads = rads % (PI*2);
        if(rads < 0) {
            rads *= -1;
            zero = -1;
        }
        if(rads > 3*PI/2) {
            rads -= 2*PI;
        }
        else{
        if(rads > PI) {
            rads -= PI;
            sign = -1;
        }
        else{
        if(rads > PI/2) {
            rads -= PI;
            sign = -1;
        }
        }
        }
        let result = 1;
        for(let i = 1; i <= 7; i++) {
            let valIteration = this.pow(rads, i*2);
            valIteration /= factors[i];
            if(i == 1) {
                result -= valIteration;
            }
            else {
                result += valIteration;
            }
        }
        return result * sign * zero;
    }
    //formule de Leibniz
    static calculatePI(iterations) {
        result = 1;
        for(let i = 1; i < iterations; i++) {
            if(i % 2 == 0) {
                result += 1/(i*2+1);
            }
            else{
                result -= 1/(i*2+1);
            }
        }
        return result * 4;
    }
    static PI() {
        return 3.141592653589793;
    }
}