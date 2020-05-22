//This website is just a tribute that I made for fun to the Dr. Pepper knock-offs collectors
//Some information about the cans may not be correct, and even false. The truth is I've never had the chance to drink any of these beverages
//Most of the pictures I used for the textures and some infos come from multiple websites : fakedrpepper.wordpress.com, skintigh.tripod.com/drpepper/index.html, angelfire.com/al/polariswatercraft/thunder.html, and some Reddit posts
//If something bothers you, feel free to contact me

import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';
import '../style_index.css';
//import '../images/3d/loader2.jpg'
import CANOBJ from '../images/3d/can.obj';
import { cans } from '../images/3d/cans_object.js';

//importation de tous les fichiers jpg et mtl 
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
const images = importAll(require.context('../images/3d', false, /\.(mtl|jpe?g)$/));


//--------------------- main
main();


//-------------------- fonctions
function main() {

    //declaration des variables globales
    let container, stats;
    let camera, controls, scene, renderer;
    let camera2, controls2, scene2, renderer2;

    let raycaster = new THREE.Raycaster();
    let INTERSECTED;

    let loaderAnim = document.getElementById('js-loader');

    //creation d'un array contenant le nom de tous les fichiers mtl, qui nous permettront de charger nos objets 3D
    let mtlfilenames = Object.keys(images).filter(val => val.includes('.mtl'));


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
                for (let i = 0; i < 50; i++) {
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
    container = document.getElementById("container");
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
    //container.appendChild(stats.dom);


    let canvas = document.getElementById('c');
    renderer2 = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer2.shadowMap.enabled = true;
    renderer2.setPixelRatio(window.devicePixelRatio);

    //creation de la deuxieme scene
    const fov = 45;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);

    scene2 = new THREE.Scene();
    //scene2.background = new THREE.Color(0x001ed1);

    const light4 = makeLight(-1, 2, 4);
    const light5 = makeLight(1, -2, -4);
    scene2.add(light4);
    scene2.add(light5);
    const light6 = new THREE.AmbientLight(0x404040, 1.7); // soft white light
    scene2.add(light6);


    controls2 = new OrbitControls(camera2, canvas);
    controls2.target.set(0, 1.41, 0);
    controls2.autoRotate = true;
    controls2.enableZoom = false;
    controls2.update();

    document.addEventListener('mousemove', function (e) {
        //lorsque l'on survole une canette, on active la fonction raycast
        raycast2(e);
    })

    document.addEventListener('touchstart', function(e){
        raycast2(e);
    })

    animate();



    // -- animate / render / raycast

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer2)) {
            const canvas = renderer2.domElement;
            camera2.aspect = canvas.clientWidth / canvas.clientHeight;
            camera2.updateProjectionMatrix();
        }
        controls.update();
        controls2.update();
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
        renderer2.render(scene2, camera2);
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    };


    function raycast2(e) {
        let mouse = {};
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children, true);
        // if there is one (or more) intersections
        if (intersects.length !== 0) {
            // if the closest object intersected is not the currently stored intersection object
            if (intersects[0].object != INTERSECTED) {
                // restore previous intersection object (if it exists) to its original color
                if (INTERSECTED) INTERSECTED.rotation.x = 0;
                // store reference to closest object as current intersection object
                INTERSECTED = intersects[0].object;
                // set a new rotation  for closest object                
                INTERSECTED.rotation.x = 6;
                //Event listener, losque l'on doubleclique sur une canette, on recupere le nom de la marque, et on l'envoie dans la focntion canInfo
                let trademark = INTERSECTED.parent.name;
                window.ondblclick = () => { showCanInfo(trademark) };
                window.ontouchstart = () => { showCanInfo(trademark) }
            }
            // there are no intersections
        } else {
            // restore previous intersection object (if it exists) to its original color
            if (INTERSECTED) INTERSECTED.rotation.x = 0;
            // remove previous intersection object reference  by setting current intersection object to "nothing"
            INTERSECTED = null;
        }
    }

    // ------ fonctions associees a la div d'information

    function showCanInfo(trademark) {
        //On affiche la div qui contient les infos sur la canette cliquee en changeant la propriete 'visibility' 
        let infoContainer = document.getElementById('infoContainer');
        infoContainer.style.visibility = "visible";

        //fermer la div avec le bouton X
        let xButton = document.querySelector('button');
        xButton.onclick = () => { infoContainer.style.visibility = "hidden"; }
        xButton.ontouchstart = () => { infoContainer.style.visibility = "hidden"; }

        //on retire les chiffres dans le nom
        trademark = trademark.replace(/[0-9]/g, '');

        fillCanInfo(trademark);

    }

    function fillCanInfo(trademark) {
        //enregistrement des balises qui vont contenir les informations sur les canettes
        let name = document.querySelector('#name');
        let ingredients = document.querySelector('#ingredients');
        let nutrition = document.querySelector('#nutrition');
        let description = document.querySelector('#description');
        let manufacturer = document.querySelector('#manufacturer');

        if (cans.hasOwnProperty(trademark)) {
            name.innerHTML = cans[trademark].name;
            ingredients.innerHTML = cans[trademark].ingredients;
            nutrition.innerHTML = cans[trademark].nutrition;
            description.innerHTML = cans[trademark].description;
            manufacturer.innerHTML = cans[trademark].manufacturer;
        }
        else {
            //
            let allInfo = document.querySelectorAll('.informations'); //on selectionne toutes les balises p de classe pInfo, celles qui contiennent toutes les informations sur les canettes
            allInfo.forEach(informations => { informations.innerHTML = "" }); //on vide les informations
            name.innerHTML = trademark;
            description.innerHTML = "There is no data about " + trademark + " at the moment.";
        }

        //charger l'objet 3D avec la bonne texture et modifier le texte des balises
        let objLoader2 = new OBJLoader2();
        let mtlLoader2 = new MTLLoader();
        mtlLoader2.load('./3dmodel/' + trademark + '.mtl', (mtlParseResult) => {
            const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
            objLoader2.addMaterials(materials, true); //override existing = true pour que la nouvelle texture s'affiche
            objLoader2.load(CANOBJ, (root) => {
                scene2.add(root);
                //pour que la camera soit devant la canette et pas a l'interieur
                const box = new THREE.Box3().setFromObject(root);
                const boxSize = box.getSize(new THREE.Vector3()).length();
                const boxCenter = box.getCenter(new THREE.Vector3());
                frameArea(boxSize * 1.2, boxSize, boxCenter, camera2);
            });
        });
    }



    function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
        const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
        // compute a unit vector that points in the direction the camera is now from the center of the box
        const direction = (new THREE.Vector3()).subVectors(camera.position, boxCenter).multiply(new THREE.Vector3(1, 0, 1)).normalize();
        // move the camera to a position distance units way from the center in whatever direction the camera was from the center already
        camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
        // pick some near and far values for the frustum that will contain the box.
        camera.near = boxSize / 100;
        camera.far = boxSize * 100;
        camera.updateProjectionMatrix();
        // point the camera to look at the center of the box
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    }

    function randomPosition(geometry) {
        let matrix = new THREE.Matrix4();
        let quaternion = new THREE.Quaternion();
        let position = new THREE.Vector3();

        position.x = Math.random() * 10000 - 5000;
        position.y = Math.random() * 6000 - 3000;
        position.z = Math.random() * 8000 - 4000;

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

    function makeLight(x, y, z) {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(x, y, z);
        return light;
    };


}