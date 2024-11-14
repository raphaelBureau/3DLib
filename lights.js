import { Vertex3D } from "./vertex.js";
export class ProjectiveLight { //projects shaded polygons on surface and overrides Geo3D.Draw()
    constructor(transform = [[0, 0, 0], [0, 0, 0]], litObject, shadedSurface) {
        this.pos = transform[0];
        this.rot = transform[1];
        this.litObject = litObject;
        this.shadedSurface = shadedSurface;
    }

    Draw(s, zBuffer) { //cull faces facing the light, then project them on the shadedSurface
        let faces = [];
        let facesCastingShadows = [];
        let proj = new Projection(this.pos, this.rot);
        this.litObject.Draw(proj, faces, false);
        for (let i = 0; i < faces.length; i++) {
            let color;
            if (this.Cull(faces[i][0])) {
                facesCastingShadows.push(faces[i][0]);
                color = faces[i][2][0];
            }
            else {
                color = faces[i][2][0] * 0.5;
            }
            let screenFace = [s.ConvertVertexList(proj.InverseConvertVertexList(faces[i][0])), faces[i][1], [color, 0, 0, 1]];
            if (this.Cull(screenFace[0])) {
                zBuffer.push(screenFace);
            }
        }

        //shadows
        let shadows = new Array(facesCastingShadows.length);
        let dist = 0;
        for (let i = 0; i < facesCastingShadows.length; i++) {
            //trouver le vecteur entre la lumiere et le triangle
            //ensuite projeter sur la plane
            const pZ = 99;

            //console.log(facesCastingShadows[i]);
            let shadow = new Array(3);
            
            for (let j = 0; j < 3; j++) {
                let x = facesCastingShadows[i][j][0] - this.pos[0];
                let y = facesCastingShadows[i][j][1] - this.pos[1];
                let z = facesCastingShadows[i][j][2] - this.pos[2];
                //let x = this.pos[0] - facesCastingShadows[i][j][0];
                //let y = this.pos[1] - facesCastingShadows[i][j][1];
                //let z = this.pos[2] - facesCastingShadows[i][j][2];
                let size = pZ / z;
                dist = 0.7;
                shadow[j] = [(x) * size, pZ, (y) * size];
                //console.log(size);
            }
            //dist est entre 1 et 0
            //0 si cole au sol
            //1 si cole a la camera
            shadows[i] = s.ConvertVertexList(shadow);
            
            //console.log(s.ConvertVertexList(proj.InverseConvertVertexList([x*size,y*size,pZ])));
        }
        for(let i = 0; i< shadows.length; i++) {
            zBuffer.push([shadows[i], 0, [180 * dist,130 * dist,10 * dist,1]]);
        }
    }

    Cull(face) {
        return (face[1][1] - face[0][1]) * (face[2][0] - face[1][0]) < (face[2][1] - face[1][1]) * (face[1][0] - face[0][0]);
    }
    Normal(face) {
        return (face[1][0] - face[0][0]);
    }
}

class Projection {
    constructor(pos, rot) {
        this.pos = pos;
        this.rot = rot;
    }

    ConvertVertexList(vertexList) {
        let result = new Array(vertexList.length);
        for (let i = 0; i < result.length; i++) {
            result[i] = Vertex3D.CRotateX(vertexList[i], this.rot[0], this.pos);
            result[i] = Vertex3D.CRotateY(result[i], this.rot[1], this.pos);



        }
        return result;
    }
    InverseConvertVertexList(vertexList) {
        let result = new Array(vertexList.length);
        for (let i = 0; i < result.length; i++) {
            result[i] = Vertex3D.CRotateX(vertexList[i], -this.rot[0], this.pos);
            result[i] = Vertex3D.CRotateY(result[i], -this.rot[1], this.pos);



        }
        return result;
    }
}