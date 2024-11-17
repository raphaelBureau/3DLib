import { PerspectiveScreen, OrthogonalScreen } from "./screen.js";
import UserControls from "./userControls.js";
import { Cube, Triangle, Cylinder, Plane, Sphere } from "./geo3D.js";
import { Draw2D } from "./draw.js";
import { ProjectiveLight } from "./lights.js";
import { Mat } from "./mat.js";
import {Metrics} from "./metrics.js";

const c = document.getElementById("view");
const ctx = c.getContext('2d');

const s = new PerspectiveScreen(ctx, c, 1, [[431.0327656317742, -326.39999999999986, -418.4552934301423], [0.5339999999999998, 0.7810000000000006, 0]]);
s.UpdateRotMat();

const sOrth = new OrthogonalScreen(ctx, c, 1, [[431.0327656317742, -326.39999999999986, -418.4552934301423], [0.5339999999999998, 0.7810000000000006, 0]]);

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

let cube = new Cube([0, -150, 0], [0, 0, 0], 10, [255,255,255,1]);
let cube2 = new Cube([0, 0, 0], [0, 0, 0], 30, [255,10,10,1]);
let cube3 = new Cube([0,0,80], [1,0,0], 40, [0,0,255,1]);

let triangle = new Triangle([0, -60, 0], [0, 0, 0], 20, 20, 15, [0,200,200,1]);
let triangle2 = new Triangle([0, 0, 0], [0, 0, 0], 20, 20, 3, [0,200,200,1]);

let cylinder = new Cylinder([-60, -10, 30], [0, 0, 2], 20, 40, 60, [70,100,255,1]);

let sphere = new Sphere([0,0,-50], [0, 0, 0], 30, 30, [255,255,10,1]);

let plane1 = new Plane([-400, 100, -400], [0, 0, 0], 800, 800, [180,130,10,1]);
let plane2 = new Plane([-200, 100, -200], [0, 0, 0], 400, 400, [180,130,10,1]);
let plane3 = new Plane([-100, 100, -100], [0, 0, 0], 200, 200, [180,130,10,1]);
let plane4 = new Plane([-50, 100, -50], [0, 0, 0], 100, 100, [180,130,10,1]);

let pLight = new ProjectiveLight([[0, -100, 0], [Math.PI/2, 0, 0]],[cube2,cube3,triangle,cylinder, sphere, triangle2],[plane1]);

let sceneObjects = [cube, plane1, plane2, plane3, plane4];

let avgFPS = 0;
let frameCount = 0;
let previousElapsed = 0;
function Game() {
    frameCount++;
    sOrth.UpdateRotMat(); //TODO changer Screen
    let fStart = Date.now(); //frame starting time
    let deltaTime = (fStart - time) / 1000; //peut etre mis a 0 pour pause le jeux
    uc.Update(deltaTime);

    cube.RotateX(deltaTime / 2);
    
    triangle.RotateX(deltaTime / 4);
    triangle.SetPosition([Math.sin(elapsed/2) * 5 + 20,Math.sin(elapsed/2) * 50, Math.cos(elapsed/2) * 10 + 50])

    triangle2.RotateZ(deltaTime);
    triangle2.SetPosition([Math.cos(elapsed) * 4 - 50, Math.sin(elapsed) * 5, -55])

    cylinder.RotateY(deltaTime / 4);
    cylinder.RotateZ(deltaTime / 2);

    sphere.RotateZ(deltaTime / 2);
    sphere.RotateX(deltaTime / 3)
    sphere.SetPosition([Math.sin(elapsed/2) * 10 + 30,Math.sin(elapsed/3) * 10, Math.cos(elapsed/2) * 10 - 50])

   cube2.SetPosition([Math.sin(elapsed) * 5,Math.sin(elapsed) * 50, Math.cos(elapsed) * 10])
   cube2.RotateX(deltaTime/3);
   cube2.RotateZ(deltaTime /4);

   cube3.RotateX(deltaTime);
   cube3.RotateZ(deltaTime/2);
   cube3.SetPosition([Math.cos(elapsed/2)*100,0,80])

   pLight.SetPosition([Math.cos(elapsed/3) * 50, -100, Math.sin(elapsed/3) * 50]);
   cube.SetPosition([Math.cos(elapsed/3) * 50, -100, Math.sin(elapsed/3) * 50]);

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

    if(elapsed > previousElapsed+1) {
    avgFPS += Metrics.DeltaToFPS(deltaTime);
    avgFPS /= 2;
    previousElapsed = elapsed;
    }
    d2.Text(Math.floor(avgFPS),0,30);

    //end of frame
    elapsed += deltaTime;

    time = fStart;
    window.requestAnimationFrame(Game);
}
Game();