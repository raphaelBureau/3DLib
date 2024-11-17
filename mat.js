//matrix transformations
//matrices need to be arrays of arrays of primitive values
export class Mat {
    static Sum(mat1, mat2) { //mat1 needs to be the same length as mat2
        let result = new Array(mat1.length);
        for (let i = 0; i < mat1.length; i++) {
            result[i] = new Array(mat1[i].length);
            for (let j = 0; j < mat1[i].length; j++) {
                result[i][j] = mat1[i][j] + mat2[i][j];
            }
        }
        return result;
    }

    static Sub(mat1, mat2) { //mat1 needs to be the same length as mat2
        let result = new Array(mat1.length);
        for (let i = 0; i < mat1.length; i++) {
            result[i] = new Array(mat1[i].length);
            for (let j = 0; j < mat1[i].length; j++) {
                result[i][j] = mat1[i][j] - mat2[i][j];
            }
        }
        return result;
    }

    //mat1 needs to have the same length as mat2.
    static Product(mat1, mat2) {
        let result = new Array(mat1.length);
        for (let i = 0; i < mat1.length; i++) { //rows a
            result[i] = new Array(mat2.length);
            for (let j = 0; j < mat2[0].length; j++) { //colls b
                let sum = 0;
                for (let k = 0; k < mat2.length; k++) { //rows b
                    sum += mat1[i][k] * mat2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    static VecToSquareMat(vec) { //converts vec to empty square mat 00 = x, 11 = y, 22 = z, ...
        let result = new Array(vec.length);
        for(let i =0 ; i< vec.length; i++) {
            result[i] = new Array(vec.length);
            for(let j =0; j< vec.length; j++) {
                result[i][j] = 0;
            }
            result[i][i] = vec[i];
        }
        return result;
    }

    static MatToVec(mat) {
        let result = new Array(mat.length);
        for(let i =0; i< mat.length; i++) {
            result[i] = mat[i][0]; //convert 3x1 matrix to 3d vector
        }
        return result;
    }
    static SquareMatToVec(mat) {
        let result = new Array(mat.length);
        for(let i = 0; i< result.length; i++) {
            result[i] = mat[i][i]; //selects 00, 11, 22, 33, ...
        }
        return result;
    }
    static VecToMat(vec) {
        let result = new Array(vec.length);
        for(let i = 0 ; i < vec.length; i++) {
            result[i] = [vec[i]]; //encapsulate in 1x3 matrix
        }
        return result;
    }
}