import * as THREE from 'three';
import dataset_meshes from "../data/small_dataset.json"
import initSceneController from './scene-controller.js'
import initScene from './init-scene.js'
import DatasetReader from './dataset-reader';
import {default as ObjectOnScene} from './object-on-scene';
import {default as SkyboxLoader}  from './skybox-loader';

const canvas = document.getElementById('canvas');
const listNameObjects = document.getElementById('listNameObjects');

initScene(document);

let skyboxLoader = new SkyboxLoader()

const renderer  = new THREE.WebGLRenderer( {canvas : canvas, antialias : true} );
const scene     = new THREE.Scene();
const camera    = new THREE.PerspectiveCamera(75, canvas.width / canvas.height);

const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2();

renderer.setClearColor("#8866aa");

let objectsInDataset = [];
let listObjectsOnScene = [];
let reader = new DatasetReader(dataset_meshes);

init();
loadObjectsFromDataset();
loadObjectsOnScene();
animate();

/* ------------------------------------------------------------------------- */

function onPointerMove(event) {
    mouse.x = ( event.clientX / canvas.width ) * 2 - 1;
    mouse.y = - ( event.clientY / canvas.height ) * 2 + 1;
}

function onClickMouse(event) {
    let listPoly = [];
    for(let i = 0; i < listObjectsOnScene.length; i++) {
        if (!listObjectsOnScene[i].mesh.visible)  continue;
        for (let j = 0; j < listObjectsOnScene[i].listPolygons.length; j++) {
            let poly = listObjectsOnScene[i].listPolygons[j];
            listPoly.push(poly);
        }
    }

    const intersects = raycaster.intersectObjects(listPoly);

    if (intersects.length == 0) {
        for (let i = 0; i < listPoly.length; i++) {
            listPoly[i].material.wireframe = true;
        }
        return;
    }
    intersects[0].object.material.wireframe = !intersects[0].object.material.wireframe;

}

function preloadSkybox() {
    if (skyboxLoader.readyTextures.length == 6 && !skyboxLoader.isInitSkybox){
        initSkybox();
        skyboxLoader.isInitSkybox = true;
    }
}

function initSkybox()
{   
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        skyboxLoader.readyTextures[0].src,
        skyboxLoader.readyTextures[1].src,
        skyboxLoader.readyTextures[2].src,
        skyboxLoader.readyTextures[3].src,
        skyboxLoader.readyTextures[4].src,
        skyboxLoader.readyTextures[5].src,
    ]);
    scene.background = texture;
}

function initLight() {    
    const pointLightLeftFront = new THREE.PointLight(0xFFFFF0, 1, 100);
    pointLightLeftFront.position.set(-10, 4, 10);

    const pointLightRightFront = new THREE.PointLight(0xF0FFFF, 1, 100);
    pointLightRightFront.position.set(10, 4, 10);

    const pointLightLeftBack = new THREE.PointLight(0xFFF0FF, 1, 100);
    pointLightLeftBack.position.set(-10, 4, -10);

    const pointLightRightBack = new THREE.PointLight(0xF0FFFF, 1, 100);
    pointLightRightBack.position.set(10, 4 , -10);

    scene.add(pointLightLeftFront);
    scene.add(pointLightRightFront);
    scene.add(pointLightLeftBack);
    scene.add(pointLightRightBack);
    
   scene.add( new THREE.AmbientLight( 0x222222 ) );
}

function init() {
    initLight();
    let planeGeometry = new THREE.PlaneGeometry(30, 30);
    let planeMaterial = new THREE.MeshPhongMaterial(
        {color : "rgb("+getRandom(80, 90) + "," +getRandom(80,90) + "," + getRandom(80, 90) + ")", side : THREE.DoubleSide}
        );
    let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); 
    
    planeMesh.position.y = -2;
    planeMesh.rotation.x = planeMesh.rotation.x - Math.PI / 2;

    camera.position.z = 15;
    camera.position.y = 5;
    let axes = new THREE.AxesHelper(20);

    scene.add(axes);
    scene.add(planeMesh);
    document.getElementById('planeHide').onclick = () => { planeMesh.visible = !planeMesh.visible; }
    document.getElementById('axesHide').onclick = () => { axes.visible = !axes.visible; }

    document.addEventListener('mousemove', onPointerMove, false);
    document.addEventListener('click', onClickMouse);

    initSceneController(canvas, axes, camera, canvas.width, canvas.height);
}

function animate() {
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera);
    preloadSkybox();
    renderer.render(scene, camera);
    draw();
}

function draw() {
    for (let obj of listObjectsOnScene) {
        obj.mesh.visible = obj.checker.checked;
        for (let i = 0; i < obj.listPolygons.length; i++) {
            obj.listPolygons[i].visible = obj.checker.checked;
        }
    }
}

function loadObjectsFromDataset() {
    let figures = reader.getMeshes();
    for(let [key, value] of figures) {
        for (let i = 0; i < value.length; i++) {
            let object = new ObjectOnScene(key, value[i], i);
            objectsInDataset.push(object);
        }
    }
}
function loadObjectsOnScene() {
    for (let object of objectsInDataset) {
        listNameObjects.insertAdjacentHTML('afterend', object.styleContentHTML);
        let checker = document.getElementById(object.nameContentHTMLCheckbox);
        checker.checked = true;
        object.checker = checker;
        console.log(object.name);
        let polyMesh = buildMesh(object.figure.pointsMesh, object.figure.colorMesh);

        object.mesh         = polyMesh.mesh;
        object.listPolygons = polyMesh.listPolygons;

        listObjectsOnScene.push(object);
        scene.add(object.mesh);
    }
}
function buildMesh(points, color = undefined) {
    let listPolygons = [];
    let vertices     = [];
    let pointsPoly   = [];
    
    for (let i = 0; i < points.length; i++) {
        vertices.push(parseFloat(points[i][0]));
        vertices.push(parseFloat(points[i][1]));
        vertices.push(parseFloat(points[i][2]));

        pointsPoly.push(parseFloat(points[i][0]));
        pointsPoly.push(parseFloat(points[i][1]));
        pointsPoly.push(parseFloat(points[i][2]));

        if (pointsPoly.length == 9) {
            listPolygons.push(buildPolygon(pointsPoly));
            pointsPoly = [];
        }
    }

    let material = new THREE.MeshPhongMaterial({side : THREE.DoubleSide, color : color});
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.material.transparent = true;
    mesh.material.opacity = 0.7;
    return { mesh, listPolygons };
}

function buildPolygon(points) {
    let material = new THREE.MeshBasicMaterial({side : THREE.DoubleSide, color : 0x111111, wireframe : true});
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

