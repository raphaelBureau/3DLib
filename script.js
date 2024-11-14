import { PerspectiveScreen, OrthogonalScreen } from "./screen.js";
import UserControls from "./userControls.js";
import { Cube, Triangle, Cylinder, Plane, Sphere } from "./geo3D.js";
import { Draw2D } from "./draw.js";
import { ProjectiveLight } from "./lights.js";
import { Mat } from "./mat.js";

const c = document.getElementById("view");
const ctx = c.getContext('2d');

const s = new PerspectiveScreen(ctx, c, 1, [[0, -200, -150], [0.8, 0, 0]]);
s.UpdateRotMat();

const sOrth = new OrthogonalScreen(ctx, c, 1, [[0, -200, -150], [0.8, 0, 0]]);

sOrth.pos = s.pos;//copy reference
sOrth.rot = s.rot;

const uc = new UserControls(s);
window.addEventListener("wheel", event => ScaleChange(-event.deltaY));
function ScaleChange(amount) {
    amount = amount / 1000;
    s.UpdateScale(amount);
}
window.addEventListener("keydown", (e) => { uc.onKeyDown(e);}, false);  //goofy ahh lambda sinon ca marche pas
window.addEventListener("keyup", (e) => { uc.onKeyUp(e);  }, false);

const d2 = new Draw2D(s);

let time = Date.now();
let elapsed = 0;

let cube = new Cube([0, -150, 0], [0, 0, 0], 40, [10,255,10,1]);
let cube2 = new Cube([0, 0, 0], [0, 0, 0], 30, [255,10,10,1]);

let triangle = new Triangle([0, -60, 0], [0, 0, 0], 20, 20, 10, [10,10,255,1]);

let cylinder = new Cylinder([-60, -10, 30], [0, 0, 2], 20, 40, 10, [70,100,255,1]);

let sphere = new Triangle([0, 0, 0], [0, 0, 0], 10, 10, 20, [255,255,10,1]);

let plane1 = new Plane([-100, 100, -50], [0, 0, 0], 200, 200, [180,130,10,1]);
let plane1Back = new Plane([-100, 100, -50], [0, 0, 0], 200, 200, [10,155,10,1]);
let plane2 = new Plane([-100, 0, 50], [0, 0, 0], 200, 200, [150,10,10,1]);
let plane2Back = new Plane([-100, 0, 50], [0, 0, 0], 200, 200, [80,0,0,1]);

let pLight = new ProjectiveLight([[0, -100, 0], [Math.PI/2, 0, 0]],cube2,plane1);

let sceneObjects = [cube, plane1, plane1Back, plane2, plane2Back];

plane1Back.RotateZ(Math.PI);
plane2.RotateX(Math.PI / 2);
plane2Back.RotateX(Math.PI / 2);
plane2Back.RotateY(Math.PI);

function Game() {
    let fStart = Date.now(); //frame starting time
    let deltaTime = (fStart - time) / 1000; //peut etre mis a 0 pour pause le jeux

    uc.Update(deltaTime);

    cube.RotateX(deltaTime / 2);
    
    triangle.RotateY(deltaTime / 4);
    cylinder.RotateY(deltaTime / 4);
    sphere.RotateZ(deltaTime / 4);

     cube2.SetPosition([Math.sin(elapsed) * 5,Math.sin(elapsed) * 20, Math.cos(elapsed) * 10])
   cube2.RotateX(deltaTime/3);
   cube2.RotateZ(deltaTime /4);

    let zBuffer = [];

    if(uc.keyPToggle) {
        sOrth.scale = s.scale*2;
        sceneObjects.forEach((obj) => obj.Draw(sOrth, zBuffer));
        pLight.Draw(sOrth, zBuffer);
    }
    else{
        sceneObjects.forEach((obj) => obj.Draw(s, zBuffer));
        pLight.Draw(s, zBuffer);
    }
    

    //trier les faces par la profondeur
    //approche rapide mais il est toujours possible qune face soit partiellement en arriere ou en avant d'une autre face
    //parceque le z de la face c'est juste une moyenne des 3 vertex du triangle
    //il faut faire un autre check de profondeur au niveau du pixel avec l'aide dun pixel buffer
    zBuffer = zBuffer.sort((a, b) => b[1] - a[1]);


    s.Clear();
    zBuffer.forEach((face) => {d2.Polygon(face[0], face[2], uc.keyFToggle);});
    d2.Line([s.width / 2 - 5, s.height / 2], [s.width / 2 + 5, s.height / 2]);
    d2.Line([s.width / 2, s.height / 2 - 5], [s.width / 2, s.height / 2 + 5]);

    //end of frame
    elapsed += deltaTime;

    time = fStart;
    window.requestAnimationFrame(Game);
}
Game();