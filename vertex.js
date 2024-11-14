//toutes les transformation possibles en 2d

export class Vertex2D {
    static Normalize(vect2D) {
        let magnitude = Vertex2D.Magnitude(vect2D);

        return [vect2D[0] / magnitude, vect2D[1] / magnitude];
    }
    static Magnitude(vect2D) {
        return Math.sqrt(vect2D[0] * vect2D[0] + vect2D[1] * vect2D[1]);
    }
    static Scale(vertex, factor) {
        let result = [0, 0];

        result[0] = vertex[0] * factor;
        result[1] = vertex[1] * factor;

        return result;
    }

    static Translate(vertex, vertex2) {
        let result = [0, 0];
        result[0] = vertex[0] + vertex2[0];
        result[1] = vertex[1] + vertex2[1];
        return result;
    }

    static Rotate(vertex, rad) { //tourne autour de 0,0
        let result = [0, 0];

        result[0] = Math.cos(rad) * vertex[0] - Math.sin(rad) * vertex[1];
        result[1] = Math.sin(rad) * vertex[0] + Math.cos(rad) * vertex[1];

        return result;
    }

    static CRotate(vertex, rad, center) { // tourne autour du vertex centre
        let result = [0, 0];

        result[0] = Math.cos(rad) * (vertex[0] - center[0]) - Math.sin(rad) * (vertex[1] - center[1]) + center[0];
        result[1] = Math.sin(rad) * (vertex[0] - center[0]) + Math.cos(rad) * (vertex[1] - center[1]) + center[1];

        return result;
    }

    static Center(vertex, origin) {
        let result = [0, 0];

        result[0] = vertex[0] - origin[0];
        result[1] = vertex[1] - origin[1];

        return result;
    }

    static Copy(vertex, vertex2) {
        for (let i = 0; i < vertex.length; i++) {
            vertex2[i] = vertex[i];
        }
    }
}

export class Vertex3D {
    static Copy(vertex, vertex2) {
        for (let i = 0; i < vertex.length; i++) {
            vertex2[i] = vertex[i];
        }
    }
    static Add(vect1, vect2) {
        let result = [0,0,0];
        result[0] = vect1[0] + vect2[0];
        result[1] = vect1[1] + vect2[1];
        result[2] = vect1[2] + vect2[2];
        return result;
    }
    static Sub(vect1, vect2) {
        let result = [0,0,0];
        result[0] = vect1[0] - vect2[0];
        result[1] = vect1[1] - vect2[1];
        result[2] = vect1[2] - vect2[2];
        return result;
    }
    static ApplyRotation(vertex = [0,0,0], rotation = [0,0,0], center = [0,0,0]) {
        let result = this.CRotateX(vertex,rotation[0],center);
        result = this.CRotateY(result,rotation[1],center);
        return this.CRotateZ(result,rotation[2],center);
    }
    static ApplyRotationList(vertices = [[0,0,0]], rotation = [0,0,0], center = [0,0,0]) {
        let result = [];
        vertices.forEach(vertex => {
            let rotated = Vertex3D.CRotateX(vertex,rotation[0],center);
            rotated = Vertex3D.CRotateY(rotated,rotation[1],center);
             result.push(Vertex3D.CRotateZ(rotated,rotation[2],center));
        });
        return result;
    }
    static Scale(vertex, factor) { //doit centre avant (scale selon [0,0,0])
        let result = [0, 0, 0];
        result[0] = vertex[0] * factor;
        result[1] = vertex[1] * factor;
        result[2] = vertex[2] * factor;

        return result;
    }

    static CScale(vertex, factor, center) {
        let result = [0, 0, 0];
        result[0] = (vertex[0] - center[0]) * factor + center[0];
        result[1] = (vertex[1] - center[1]) * factor + center[1];
        result[2] = (vertex[2] - center[2]) * factor + center[2];

        return result;
    }

    static Center(vertex, origin) {
        let result = [0, 0, 0];

        result[0] = vertex[0] - origin[0];
        result[1] = vertex[1] - origin[1];
        result[2] = vertex[2] - origin[2];

        return result;
    }

    static Translate(vertex, vector) {
        let result = [0, 0, 0];

        result[0] = vertex[0] + vector[0];
        result[1] = vertex[1] + vector[1];
        result[2] = vertex[2] + vector[2];

        return result;
    }
    //imagine pas utiliser des quaternions
    static RotateX(vertex, rad) {  //doit centrer avant (tourne autour de x(0) )
        let result = [vertex[0], 0, 0];

        result[1] = vertex[1] * Math.cos(rad) - vertex[2] * Math.sin(rad);
        result[2] = vertex[1] * Math.sin(rad) + vertex[2] * Math.cos(rad);

        return result;
    }
    static RotateY(vertex, rad) {  //doit centrer avant (tourne autour de y(0) )
        let result = [0, vertex[1], 0];

        result[2] = vertex[2] * Math.cos(rad) - vertex[0] * Math.sin(rad);
        result[0] = vertex[2] * Math.sin(rad) + vertex[0] * Math.cos(rad);

        return result;
    }
    static RotateZ(vertex, rad) {  //doit centrer avant (tourne autour de z(0) )
        let result = [0, 0, vertex[2]];

        result[0] = vertex[0] * Math.cos(rad) - vertex[1] * Math.sin(rad);
        result[1] = vertex[0] * Math.sin(rad) + vertex[1] * Math.cos(rad);

        return result;
    }
    static CRotateX(vertex, rad, center) {  //deja centré (tourne autour de x(centre))
        let result = [vertex[0], 0, 0];

        result[1] = ((vertex[1] - center[1]) * Math.cos(rad) - (vertex[2] - center[2]) * Math.sin(rad)) + center[1];
        result[2] = ((vertex[1] - center[1]) * Math.sin(rad) + (vertex[2] - center[2]) * Math.cos(rad)) + center[2];

        return result;
    }
    static CRotateY(vertex, rad, center) {  //deja centré (tourne autour de y(centre))
        let result = [0, vertex[1], 0];

        result[2] = ((vertex[2] - center[2]) * Math.cos(rad) - (vertex[0] - center[0]) * Math.sin(rad)) + center[2];
        result[0] = ((vertex[2] - center[2]) * Math.sin(rad) + (vertex[0] - center[0]) * Math.cos(rad)) + center[0];

        return result;
    }
    static CRotateZ(vertex, rad, center) {  //deja centré (tourne autour de z(centre))
        let result = [0, 0, vertex[2]];

        result[0] = ((vertex[0] - center[0]) * Math.cos(rad) - (vertex[1] - center[1]) * Math.sin(rad)) + center[0];
        result[1] = ((vertex[0] - center[0]) * Math.sin(rad) + (vertex[1] - center[1]) * Math.cos(rad)) + center[1];

        return result;
    }
}