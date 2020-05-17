import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';
import '../style_index.css';
//import '../images/3d/loader.png'
import CANOBJ from '../images/3d/can.obj';

//importation de tous les fichiers jpg et mtl 
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
const images = importAll(require.context('../images/3d', false, /\.(mtl|jpe?g)$/));


//declaration des variables globales
let container, stats;
let camera, controls, scene, renderer;

let raycaster = new THREE.Raycaster();
let INTERSECTED;

let loaderAnim = document.getElementById('js-loader');

//creation d'un array contenant le nom de tous les fichiers mtl, qui nous permettront de charger nos objets 3D
let mtlfilenames = Object.keys(images).filter(val => val.includes('.mtl'));


//--------------------- main
init();
animate();

//-------------------- fonctions 
function init() {

    container = document.getElementById("container");

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x21c4ff); //0x1cb9fe skyblue

    scene.add(new THREE.AmbientLight(0x555555));

    let light = new THREE.SpotLight(0xffffff, 0.8);
    light.position.set(0, 500, 2000);
    scene.add(light);

    let light2 = new THREE.SpotLight(0xffffff, 0.8);
    light2.position.set(200, 50, 8000);
    scene.add(light2); 

    let light3 = new THREE.SpotLight(0xffffff, 0.8);
    light3.position.set(-200, -50, -8000);
    scene.add(light3);

    //Chargement des objets 3D
    let mtlLoader = new MTLLoader();

    mtlfilenames.forEach(mtlfilename => {
        mtlLoader.load('./3dmodel/' + mtlfilename, (mtlParseResult) => {
            const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
            let objLoader = new OBJLoader2();
            objLoader.addMaterials(materials, true);
            objLoader.load(CANOBJ, (root) => {
                let name = mtlfilename.slice(0, mtlfilename.length - 4); //on supprime l'extension '.mtl'     
                //on clone l'objet 3d pour ajouter sa copie i fois a la scene               
                for (let i = 0; i < 400; i++) {
                    let clonedCan = root.clone();
                    clonedCan.name = name + i; //pour chaque clone, on associe un nom suivi d'un indice    
                    randomPosition(clonedCan);
                    scene.add(clonedCan);
                }
                loaderAnim.remove();
            });
        });  
    });

    //Creation du renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //TrackBall Controls
    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    //Stats pannel
    stats = new Stats();
    container.appendChild(stats.dom);


    /*
    document.addEventListener('mousemove', function (e) {
        raycast(e);
    })
    */


}


function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}


function render() {

    controls.update();

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

}

function randomPosition(geometry) {
    let matrix = new THREE.Matrix4();
    let quaternion = new THREE.Quaternion();
    let position = new THREE.Vector3();
    //position.x = Math.random() * 10000 - 5000;
    //position.y = Math.random() * 6000 - 3000;
    //position.z = Math.random() * 8000 - 4000;
    position.x = Math.random() * 20000 - 10000;
    position.y = Math.random() * 12000 - 6000;
    position.z = Math.random() * 16000 - 8000;

    let rotation = new THREE.Euler();
    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    let scale = new THREE.Vector3();
    scale.x = 120; //150 pour 50 canettes 
    scale.y = 120; //110 pour 100
    scale.z = 120; //80 pour 200 

    quaternion.setFromEuler(rotation);
    matrix.compose(position, quaternion, scale);
    geometry.applyMatrix4(matrix);

}


function raycast(e) {
    let mouse = {};
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);
    // if there is one (or more) intersections
    if (intersects.length !== 0) {
        // if the closest object intersected is not the currently stored intersection object
        if (intersects[0].object != INTERSECTED && intersects[0].object.material[2]) { //la 2e condition pour eviter erreur de materiau quand on intercepte le helper
            // restore previous intersection object (if it exists) to its original color
            if (INTERSECTED) INTERSECTED.material[2].color.setHex(INTERSECTED.currentHex);
            // store reference to closest object as current intersection object
            INTERSECTED = intersects[0].object;
            // store color of closest object (for later restoration)
            INTERSECTED.currentHex = INTERSECTED.material[2].color.getHex();
            // set a new color for closest object
            var geometry = new THREE.BoxGeometry(10,10,10);
            var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set = INTERSECTED.position;
            scene.add(cube);
            INTERSECTED.material[2].color.setHex(0xff00d4);
            let url = INTERSECTED.userData['url'];
            //window.onclick = () => {canInfo(INTERSECTED.name)};
        }
        // there are no intersections
    } else {
        // restore previous intersection object (if it exists) to its original color
        if (INTERSECTED) INTERSECTED.material[2].color.setHex(INTERSECTED.currentHex);
        // remove previous intersection object reference  by setting current intersection object to "nothing"
        INTERSECTED = null;
    }

}

function canInfo(canName){
    //ajoute une nouvelle div avec des infos sur la canette cliquee (en cours)
    let infoContainer = document.createElement("div"); 
    infoContainer.id = 'infoContainer';
    container.appendChild(infoContainer);
    window.onclick = () => {
        console.log("ja");
        container.removeChild(infoContainer);
        }  

}

