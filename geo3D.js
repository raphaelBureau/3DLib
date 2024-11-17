import { Mat } from "./mat.js";
import { Vertex2D, Vertex3D } from "./vertex.js";

export class Geo3D {
    constructor(position = [0,0,0], rotation = [0,0,0], size = 5, color = [255,0,0,1], vertices, center) {
        vertices = Vertex3D.ApplyRotationList(vertices,rotation,center);
        this.pos = position;
        this.rot = rotation;
        this.size = size;
        this.color = color;
        this.vertices = vertices;
        this.center = center;
    }
    SetPosition(vect3D = [0,0,0]) {
        this.Translate(Vertex3D.Sub(vect3D,this.pos));
    }
    SetRotation(rotation = [0,0,0]) {
        let newRotation = Vertex3D.Sub(this.rot,rotation);
        this.RotateX(-newRotation[0]);
        this.RotateY(-newRotation[1]);
        this.RotateZ(-newRotation[2]);
    }
    Translate(vect3D) {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = Vertex3D.Translate(this.vertices[i], vect3D);
        }
        this.center = Vertex3D.Translate(this.center, vect3D);
        this.pos = Vertex3D.Translate(this.pos, vect3D);
    }
    Scale(factor) {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = Vertex3D.CScale(this.vertices[i], factor, this.center);
        }
    }
    RotateX(rad) {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = Vertex3D.CRotateX(this.vertices[i], rad, this.center);
        }
        this.rot[0] += rad;
    }
    RotateY(rad) {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = Vertex3D.CRotateY(this.vertices[i], rad, this.center);
        }
        this.rot[1] += rad;
    }
    RotateZ(rad) {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = Vertex3D.CRotateZ(this.vertices[i], rad, this.center);
        }
        this.rot[2] += rad;
    }
    Draw(s, buffer) {
        console.log("doit implementer Draw(s,buffer)");
    }
    static CullFaces(faces, s) {
        let culledfaces = [];
        faces.forEach(face => {
            if ((face[0][2] > s.near && face[1][2] > s.near && face[2][2] > s.near) && //near culling
                (face[1][1] - face[0][1]) * (face[2][0] - face[1][0]) < (face[2][1] - face[1][1]) * (face[1][0] - face[0][0]) &&//back face culling
                (((face[0][0] >= 0 || face[1][0] >= 0 || face[2][0] >= 0) && (face[0][1] >= 0 || face[1][1] >= 0 || face[2][1] >= 0)) && //frustum culling
                  ((face[0][0] < s.width || face[1][0] < s.width || face[2][0] < s.width) && (face[0][1] < s.height || face[1][1] < s.height || face[2][1] < s.height)))) {
                culledfaces.push(face);
            }
        });
        return culledfaces//.sort((a, b) => ZSum(b) - ZSum(a)); //initial z-layering (pas necessaire)
    }
    static ZSum(a) {
        return (a[0][2] + a[1][2] + a[2][2]) //Math.abs((a[0][0] + a[1][0] + a[2][0])/3 - s.width/2 + (a[0][1] + a[1][1] + a[2][1])/3 - s.height/2)
    }
}


function RoundVertices(faces) {
    for(let i = 0; i< faces.length;i++) {
        for(let v = 0; v< faces[i].length;v++) {
            faces[i][v] = [Math.floor(faces[i][v][0] + 0.5), Math.floor(faces[i][v][1] + 0.5), faces[i][v][2]];
        }
    }
    return faces;
}


export class Cube extends Geo3D {
    constructor(position = [0,0,0], rotation = [0,0,0], size = 5, color = [0,255,0,1]) {
        let p = position;
        let center = [p[0] + size / 2, p[1] + size / 2, p[2] + size / 2];                                                                                      //    2.+------+3
        let vertices = [p, [p[0] + size, p[1], p[2]], [p[0], p[1], p[2] + size], [p[0] + size, p[1], p[2] + size],//top face                                   //   .' |    .'| 
        [p[0], p[1] + size, p[2]], [p[0] + size, p[1] + size, p[2]], [p[0], p[1] + size, p[2] + size], [p[0] + size, p[1] + size, p[2] + size]];//bottom face  // 0+---+--+'1 |
                                                                                               //  | 6.+--+---+7
        super(p,rotation, size, color, vertices, center);                                                                                                      //  |   |  |   |                                         
    }                                                                                                                                               
    Draw(s, buffer, cull = true) { //override                                                                                                                               // 4+------+'5 
        let vertices = s.ConvertVertexList(this.vertices);
        let faces = [];

        faces.push([vertices[0], vertices[2], vertices[1]]); //sus pas le temps de faire des maths
        faces.push([vertices[1], vertices[2], vertices[3]]); //cest probablement autant ou peut etre meme plus efficace qun algo (copium)
        faces.push([vertices[0], vertices[1], vertices[4]]);
        faces.push([vertices[4], vertices[1], vertices[5]]);
        faces.push([vertices[2], vertices[0], vertices[6]]);
        faces.push([vertices[0], vertices[4], vertices[6]]);
        faces.push([vertices[2], vertices[6], vertices[3]]);
        faces.push([vertices[3], vertices[6], vertices[7]]);
        faces.push([vertices[1], vertices[3], vertices[7]]);
        faces.push([vertices[1], vertices[7], vertices[5]]);
        faces.push([vertices[4], vertices[7], vertices[6]]);
        faces.push([vertices[4], vertices[5], vertices[7]]);

       if(cull) {
        Geo3D.CullFaces(faces,s).forEach(face => { buffer.push([face, Geo3D.ZSum(face), this.color]); });
       }
       else{
        faces.forEach(face => {buffer.push([face, Geo3D.ZSum(face), this.color])});
       }
    }
}

export class Triangle extends Geo3D {
    constructor(position = [0,0,0], rotation = [0,0,0], width = 5, height = 5, sides = 4, color = [0,255,0,1]) {
        let vertices = [position];
        for (let i = 0; i < sides; i++) {
            let [tX, tZ] = Vertex2D.Rotate([width, 0], Math.PI * 2 / (sides) * i); //tip = vertice[0]
            vertices.push([tX + position[0], position[1] + height, tZ + position[2]]);
        }
        vertices.push([position[0], position[1] + height, position[2]]);
        let center = position;
        super(position, rotation, width * height, color, vertices, center);
    }

    Draw(s, buffer, cull = true) { //override                                                      
        let vertices = s.ConvertVertexList(this.vertices);
        let faces = [];

        for (let i = 1; i < vertices.length - 2; i += 1) {
            faces.push([vertices[i], vertices[0], vertices[i + 1]]);
            faces.push([vertices[i + 1], vertices[vertices.length - 1], vertices[i]]);
        }
        faces.push([vertices[vertices.length - 2], vertices[0], vertices[1]]);
        faces.push([vertices[1], vertices[vertices.length - 1], vertices[vertices.length - 2]]);

        if(cull) {
            Geo3D.CullFaces(faces,s).forEach(face => { buffer.push([face, Geo3D.ZSum(face), this.color]); });
           }
           else{
            faces.forEach(face => {buffer.push([face, Geo3D.ZSum(face), this.color])});
           }
    }
}

export class Plane extends Geo3D {
    constructor(position = [0,0,0], rotation = [0,0,0], width = 5, length = 5, color = [0,255,0,1]) {
        let vertices = [position,[position[0]+width,position[1],position[2]],[position[0]+width,position[1],position[2]+length],[position[0],position[1],position[2]+length]];
        let center = [position[0]+width/2, position[1], position[2]+length/2];
        super(position, rotation, width * length, color, vertices, center);
}
Draw(s, buffer) { //override                                                      
    let vertices = s.ConvertVertexList(this.vertices);
    let faces = [[vertices[0],vertices[2],vertices[1]],[vertices[0],vertices[3],vertices[2]]];

    Geo3D.CullFaces(faces,s).forEach(face => { buffer.push([face, Geo3D.ZSum(face) + 1000, this.color]); });
}
}

export class Cylinder extends Geo3D {
    constructor(position = [0,0,0], rotation = [0,0,0], width = 5, height = 5, segments = 4, color = [0,255,0,1]) {
        let vertices = [position];
        for (let i = 0; i < segments; i++) {
            let [tX, tZ] = Vertex2D.Rotate([width, 0], Math.PI * 2 / (segments) * i);
            vertices.push([position[0] + tX, position[1], position[2] + tZ]);
            vertices.push([position[0] + tX, position[1] +height, position[2] + tZ]);
        }
        vertices.push([position[0], position[1] + height, position[2]]);
        let center = [position[0], position[1]+height/2, position[2]];
        super(position,rotation, width * height, color, vertices, center);
    }
    Draw(s, buffer, cull = true) { //override                                                      
        let vertices = s.ConvertVertexList(this.vertices);
        let faces = [];

        for (let i = 1; i < vertices.length - 3; i += 2) {
            faces.push([vertices[i+2], vertices[i+1], vertices[i]]);
            faces.push([vertices[i+3], vertices[vertices.length-1], vertices[i+1]]);
            faces.push([vertices[i+1], vertices[i+2], vertices[i+3]]);
            faces.push([vertices[i], vertices[0], vertices[i+2]]);
            
        }
        faces.push([vertices[2], vertices[vertices.length-1], vertices[vertices.length-2]]);
        faces.push([vertices[vertices.length-3], vertices[0], vertices[1]]);
        faces.push([vertices[vertices.length-2], vertices[1], vertices[2]]);
        faces.push([vertices[vertices.length-2], vertices[vertices.length-3], vertices[1]]);

        if(cull) {
            Geo3D.CullFaces(faces,s).forEach(face => { buffer.push([face, Geo3D.ZSum(face), this.color]); });
           }
           else{
            faces.forEach(face => {buffer.push([face, Geo3D.ZSum(face), this.color])});
           }
    }
}

export class Sphere extends Geo3D {
    constructor(position = [0,0,0], rotation = [0,0,0], scale = 5, segments = 4, color = [0,255,0,1]) {
        let vertices = [];
        for(let i =0; i<segments;i++) {
            for(let c=0; c<=segments;c++) {
                let tX = Math.cos(Math.PI*2/(segments)*c) * scale;
                let tZ = Math.sin(Math.PI*2/(segments)*c) * scale;
                //x,z rotation viewed from top

                //scale x and z coordinates based on local y height
                tX *= Math.max(Math.sin(Math.PI/(segments) * i),0);
                tZ *= Math.max(Math.sin(Math.PI/(segments) * i),0);

                let tY = 0;
                if(i != 0) {
                tY = Math.cos(Math.PI/(segments)*i) * scale;
                }
                else{
                tY = -Math.cos(Math.PI/(segments)*(segments)) * scale;
                }


                //let [tX2,tY] = Vertex2D.Rotate([tX,0],Math.PI*2/(segments)*c);
                vertices.push([position[0]+tX,position[1]+ tY,position[2]+tZ]);
            }
        }
        vertices.push([position[0],position[1] - 1 *scale,position[2]]);
        let center = [position[0], position[1], position[2]];
        super(position,rotation, scale, color, vertices, center);
        this.segments = segments;
    }
    Draw(s, buffer, cull = false) { //override                                                      
        let vertices = s.ConvertVertexList(this.vertices);
        let faces = [];
        //top / bottom
        for(let i = this.vertices.length-1; i>this.vertices.length-this.segments; i--) {
            faces.push([vertices[this.vertices.length-1], vertices[i], vertices[i-1]]);
        }
        faces.push([vertices[this.vertices.length-1], vertices[this.vertices.length-this.segments], vertices[this.vertices.length-this.segments-1]]); //edge case
        
        //sides
        if(true) {
        for(let i = 0; i < vertices.length - this.segments-1; i++) {
            if(i % this.segments+1 == 0 && i != 0) {
            faces.push([vertices[i-this.segments],vertices[i],vertices[i+this.segments]]); //edge case
            faces.push([vertices[i-this.segments],vertices[this.segments+i],vertices[i+this.segments+1]]);
            }
            else{
            faces.push([vertices[i+1],vertices[i],vertices[i+this.segments+1]]);
            faces.push([vertices[i],vertices[i+this.segments],vertices[i+this.segments+1]]);
            }
        }
    }

        if(false) {
            Geo3D.CullFaces(faces,s).forEach(face => { buffer.push([face, Geo3D.ZSum(face), this.color]); });
           }
           else{
            faces.forEach(face => {buffer.push([face, 0, this.color])});   
           }
    }
}