import { Vertex2D, Vertex3D } from "./vertex.js";
import { Mat } from "./mat.js";

class Screen {
    constructor(context, canvas, scale = 1, transform = [[0, 0, 0], [0, 0, 0]]) {
        this.ctx = context;
        this.canvas = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pos = transform[0];
        this.rot = transform[1];
        this.speed = 100;
        this.near = 0;
        this.perspective = 1000;
        this.scale = scale;
        this.rotMat = [];
        canvas.width = this.width;
        canvas.height = this.height;
    }

    Clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    UpdateScale(deltaScale) {
        if (this.scale + deltaScale > 0) {
            this.scale += deltaScale;
        }
    }

    ConvertVertexList(vertex3DList) {
        let result = new Array(vertex3DList.length);

        for (let i = 0; i < result.length; i++) {
            result[i] = this.ConvertVertex(vertex3DList[i]);
        }
        return result;
    }
    Convert2DVertex(vertex2D) {
        let center = [this.pos[0] + this.width / 2, this.pos[1] + this.height / 2];
        let result = Vertex2D.CRotate(vertex2D, this.rot[0], center);

        result = Vertex2D.Translate(result, [-this.pos[0] + s.width / 2, -this.pos[1] + s.height / 2]);

        return result;
    }
    Convert2DVertexList(vertex2DList) {

        let result = new Array(vertex2DList.length);

        for (let i = 0; i < result.length; i++) {
            result[i] = this.Convert2DVertex(vertex2DList[i]);
        }
        return result;
    }
    Move(vect3D, deltaTime) {
        let result = Vertex3D.RotateY(vect3D, -this.rot[1]);
        //  result = Vertex3D.RotateX(result,-this.rX);
        //  result = Vertex3D.RotateZ(result,-this.rZ);
        for (let i = 0; i < 3; i++) {
            this.pos[i] += result[i] * deltaTime * this.speed;
        }
    }
    ConvertVertex(vertex3D) {
        console.log("Screen doit implementer ConvertVertex");
    }
    UpdateRotMat() {//yxz rotation
        let x = [[1 , 0 , 0],
                [0 , Math.cos(this.rot[0]), -Math.sin(this.rot[0])],
                [0, Math.sin(this.rot[0]), Math.cos(this.rot[0])]];

        let y = [[Math.cos(this.rot[1]), 0 , Math.sin(this.rot[1])],
                 [0 , 1 , 0],
                 [-Math.sin(this.rot[1]), 0 , Math.cos(this.rot[1])]];
        this.rotMat = Mat.Product(x,y);
    }
}

export class PerspectiveScreen extends Screen {
    constructor(context, canvas, scale = 1, transform) { super(context, canvas, scale,transform); }

    ConvertVertex(vertex3D) {
        let vec = Mat.MatToVec(
            Mat.Product(this.rotMat,
                 Mat.Sub(Mat.VecToMat(vertex3D), Mat.VecToMat(this.pos))));

        vec[0] = this.width / 2 + (vec[0] / vec[2] * this.perspective) * this.scale;
        vec[1] = this.height / 2 + (vec[1] / vec[2] * this.perspective) * this.scale;  //le code magique
        return vec;
    }
}

export class OrthogonalScreen extends Screen {
    constructor(context, canvas, scale = 1,transform) {
        super(context, canvas, scale,transform);
        this.near = -1/0;
    }

    ConvertVertex(vertex3D) {
        
        let result = Mat.Sub([[vertex3D[0]],[vertex3D[1]],[vertex3D[2]]], [[this.pos[0]],[this.pos[1]],[this.pos[2]]]);
        result = Mat.Product(this.rotMat, result);

        let vec = Mat.MatToVec(result);

        vec[0] = this.width / 2 + vec[0] * this.scale;
        vec[1] = this.height / 2 + vec[1] * this.scale;

        return vec;
    }
}