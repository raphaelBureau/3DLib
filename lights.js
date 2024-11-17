import { Vertex3D } from "./vertex.js";
import { Geo3D } from "./geo3D.js";
import { Mat } from "./mat.js";
export class ProjectiveLight { //projects shaded polygons on surface and overrides Geo3D.Draw()
    constructor(transform = [[0, 0, 0], [0, 0, 0]], litObjects, shadedSurfaces) {
        this.pos = transform[0];
        this.rot = transform[1];
        this.litObjects = litObjects;
        this.shadedSurfaces = shadedSurfaces;
    }

    Draw(s, zBuffer) { //cull faces facing the light, then project them on the shadedSurface
        let faces = [];
        let facesCastingShadows = [];
        let proj = new Projection(this.pos, this.rot);
        for(let i = 0; i< this.litObjects.length; i++) {
            this.litObjects[i].Draw(proj, faces, false);
            }
        for (let i = 0; i < faces.length; i++) {
            let color =  [faces[i][2][0],faces[i][2][1],faces[i][2][2],faces[i][2][3]];
            let p1 = [faces[i][0][1][0] - faces[i][0][0][0], faces[i][0][1][1] - faces[i][0][0][1], faces[i][0][1][2]-faces[i][0][0][2]];
            let p2 = [faces[i][0][2][0] - faces[i][0][0][0], faces[i][0][2][1] - faces[i][0][0][1], faces[i][0][2][2]-faces[i][0][0][2]];

            let normal = [p1[1] * p2[2] - p1[2] * p2[1],
                          p1[2] * p2[0] - p1[0] * p2[2],
                          p1[0] * p2[1] - p1[1] * p2[0]];
            let len = Math.sqrt(Math.pow(normal[0],2) + Math.pow(normal[1],2) + Math.pow(normal[2],2));
            //normal[0] /= len;
            normal[1] /= len;
            normal[2] /= len;
            //console.log(normal[1]);
            if (ProjectiveLight.Cull(faces[i][0])) {
                facesCastingShadows.push(proj.InverseConvertVertexList(faces[i][0]));
                color[0] *= Math.max(Math.abs(normal[2]),0.3);
                color[1] *= Math.max(Math.abs(normal[2]),0.3);
                color[2] *= Math.max(Math.abs(normal[2]),0.3);
            }//normalised face normal vector * color
            else {
                color[0] *= 0.3;
                color[1] *= 0.3;
                color[2] *= 0.3;
                facesCastingShadows.push(proj.InverseConvertVertexList(faces[i][0]));//TODO temp (Transform.lookAt Projection class)
            }
            let screenFace = [s.ConvertVertexList(proj.InverseConvertVertexList(faces[i][0])), 0, color]; //recalculate Zsum relative to screen projection
            screenFace[1] = Geo3D.ZSum(screenFace[0]);
            if (ProjectiveLight.Cull(screenFace[0]) && ProjectiveLight.FustrumCull(screenFace[0],s)) {
                zBuffer.push(screenFace);
            }
        }

        //shadows
        let shadows = new Array(facesCastingShadows.length);
        //let shadowsAlpha = new Array(facesCastingShadows.length); //TODO temp
        for (let i = 0; i < facesCastingShadows.length; i++) {
            //trouver le vecteur entre la lumiere et le triangle
            //ensuite projeter sur la plane
            const pY = 99;

            //console.log(facesCastingShadows[i]);
            let shadow = new Array(3);
            
            for (let j = 0; j < 3; j++) {
                //let x = facesCastingShadows[i][j][0] - this.pos[0];
                //let y = facesCastingShadows[i][j][1] - this.pos[1];
                //let z = facesCastingShadows[i][j][2] - this.pos[2];
                let x = this.pos[0] - facesCastingShadows[i][j][0];
                let y = this.pos[1] - facesCastingShadows[i][j][1];
                let z = this.pos[2] - facesCastingShadows[i][j][2];
                let size = (this.pos[1] - pY) / y;
               // if(j == 0) {
               // const lightFactor = 50;
               // shadowsAlpha[i] = 1/(Math.abs(facesCastingShadows[i][j][1]-pY)/lightFactor+1); //1/(x+1) ou x est la distance entre l'objet et le sol
               // console.log(shadowsAlpha[i]);
               // }
                shadow[j] = [-(x) * size, pY, -(z) * size];
                //console.log(size);
            }
            //dist est entre 1 et 0
            //0 si cole au sol
            //1 si cole a la camera
            shadows[i] = s.ConvertVertexList(shadow);
            
            //console.log(s.ConvertVertexList(proj.InverseConvertVertexList([x*size,y*size,pZ])));
        }
        for(let i = 0; i< shadows.length; i++) {
            if(ProjectiveLight.FustrumCull(shadows[i], s) && ProjectiveLight.Cull(shadows[i])) {
            //zBuffer.push([shadows[i], 0, [180 * dist,130 * dist,10 * dist,1]]); //Geo3D.ZSum(shadows[i])
            zBuffer.push([shadows[i], Geo3D.ZSum(shadows[i]), [140,100,5,0.6]]); //Geo3D.ZSum(shadows[i])
        }}
    }

    static Cull(face) {
        return (face[1][1] - face[0][1]) * (face[2][0] - face[1][0]) < (face[2][1] - face[1][1]) * (face[1][0] - face[0][0]);
    }
    static FustrumCull(face, s) {
            return ((face[0][2] > s.near && face[1][2] > s.near && face[2][2] > s.near) && //near culling
                (((face[0][0] >= 0 || face[1][0] >= 0 || face[2][0] >= 0) && (face[0][1] >= 0 || face[1][1] >= 0 || face[2][1] >= 0)) && //frustum culling
                  ((face[0][0] < s.width || face[1][0] < s.width || face[2][0] < s.width) && (face[0][1] < s.height || face[1][1] < s.height || face[2][1] < s.height))));
    }
    Normal(face) {
        return (face[1][0] - face[0][0]);
    }
    SetPosition(vect3D = [0,0,0]) {
        this.pos = vect3D; //reference copy
    }
}

class Projection {
    constructor(pos, rot) {
        this.pos = pos;
        this.rot = rot;
        this.rotMat = [];
        this.inverseRotMat = [];
        this.UpdateRotation(rot);
    }
    UpdateRotation(newRot) {
        let x = [[1 , 0 , 0],
                [0 , Math.cos(this.rot[0]), -Math.sin(this.rot[0])],
                [0, Math.sin(this.rot[0]), Math.cos(this.rot[0])]];

        let y = [[Math.cos(this.rot[1]), 0 , Math.sin(this.rot[1])],
                 [0 , 1 , 0],
                 [-Math.sin(this.rot[1]), 0 , Math.cos(this.rot[1])]];

        this.rotMat = Mat.Product(x,y);

        x = [[1 , 0 , 0],
            [0 , Math.cos(-this.rot[0]), -Math.sin(-this.rot[0])],
            [0, Math.sin(-this.rot[0]), Math.cos(-this.rot[0])]];

        y = [[Math.cos(-this.rot[1]), 0 , Math.sin(-this.rot[1])],
            [0 , 1 , 0],
            [-Math.sin(-this.rot[1]), 0 , Math.cos(-this.rot[1])]];

        this.inverseRotMat = Mat.Product(x,y);
    }

    LookAt(vect3D) { //changes this.rot to have +z facing targeted vector
        
    }

    ConvertVertexList(vertexList) {
        let result = new Array(vertexList.length);
        for (let i = 0; i < result.length; i++) {
            result[i] = Mat.MatToVec(
                Mat.Product(this.rotMat,
                 Mat.Sub(Mat.VecToMat(vertexList[i]), Mat.VecToMat(this.pos))
                ));
        }
        return result;
    }
    InverseConvertVertexList(vertexList) {
        let result = new Array(vertexList.length);
        for (let i = 0; i < result.length; i++) {
            result[i] = this.InverseConvertVertex(vertexList[i]);
        }
        return result;
    }
    InverseConvertVertex(vertex) {
        return Mat.MatToVec(
            Mat.Sum(Mat.VecToMat(this.pos),
            Mat.Product(this.inverseRotMat, Mat.VecToMat(vertex))
        ));
        
    }
}