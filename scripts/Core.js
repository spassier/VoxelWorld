/**
 * 1- Construction de geométire de solides
 * Les opérations CSG (fusion, intesection, exclusion) sont a effectué avec ThreeCSG
 * https://github.com/chandlerprall/ThreeCSG
 * ATTENTION :
 *  A- il existe aussi une version ES6 (threeCSG.es6 sur le repo)
 *  B- Des objets trop complexes peuvent planter le navigateur.
 *  La raison est que JS est mono-thread et que la mémoire est limitée.
 *  Or plus les objets sont complexes et plus le nombres d'intersections augmente et cela peut dépasser les limites du navigateur.
 * 2- demo QAKE.SE
 * Fichier Orbital.js interessant
 *
 *
 * Editeur Voxel - Etat de l'art
 * =============================
 * MagicaVoxel : gratuit
 * https://voxel.codeplex.com/
 *
 * Qubicle : payant + modules payants
 * http://minddesk.com/index.php
 * Qubicle 3.0 basic edition est a 20$ et indie à 75$ / sur Steam 20€/70€
 * Plusieurs module indispensable sont proposés :
 * Utility : 10$ (Creation de landscape et surtout permet de hierarchiser les objets)
 * Mesh : 25$ (Export avec optimisation des mesh)
 *
 * Dans un premier temps la version basic est largement suffisante.
 * Voir si on peut le trouver cracked...
 *
 * Il n'existe pas encore sur le marché d'editeur permettant d'ajouter des textures. Il faut passer par un autre
 * editeur pour ajouter manuellement des textures ou utiliser la table des couleurs affectée aux voxels comme lookuptable
 * vers une banque de texture.
 *
 *
 */

'use strict';

(function(exports) {

    function TestThreeJS() {
        var camera, scene, renderer;
        var control;
        var mesh;
        var keyboard;
        var map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        var stats = new Stats();
        stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );

        init();
        animate();

        function init() {
            // Creation de la scene
            scene = new THREE.Scene();

            // Creation de la camera
            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(100, 100, 100);

            // Definition du mode de control de la camera
            control = new THREE.OrbitControls(camera);

            // var texture = new THREE.TextureLoader().load('assets/brickwall.jpg');
            // var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
            // var material = new THREE.MeshBasicMaterial({map: texture});
            // mesh = new THREE.Mesh(geometry, material);
            // scene.add(mesh);

            var ambient = new THREE.AmbientLight( 0x999999 );
            scene.add( ambient );

            var mainlight = new THREE.DirectionalLight( 0xffffff, 1 );
            //shadow stuff
            mainlight.shadowCameraNear = 1;
            mainlight.shadowCameraFar = 500;

            mainlight.castShadow = true;
            mainlight.shadowDarkness = 1.0;
            mainlight.shadowCameraVisible = true;
            mainlight.shadowMapWidth = 1024;
            mainlight.shadowMapHeight = 1024;

            mainlight.shadowCameraLeft = -100; // or whatever value works for the scale of your scene
            mainlight.shadowCameraRight = 100;
            mainlight.shadowCameraTop = 100;
            mainlight.shadowCameraBottom = -100;

            mainlight.position.set( 100, 50, 100 );
            scene.add( mainlight );
            scene.add( new THREE.DirectionalLightHelper(mainlight, 0.10) );

            //createMap(map, 2, scene);
            loadObj("monu9", scene);
            loadObj("castle", scene);
            var cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshLambertMaterial({color: 0x225511}));
            cube.castShadow = true;
            //cube.receiveShadow = true;
            cube.position.x = 0;
            cube.position.y = 10;
            cube.position.z = 20;
            scene.add(cube);
            // var cube2 = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshLambertMaterial({color: 0x555566}));
            // cube2.castShadow = true;
            // cube2.receiveShadow = true;
            // cube2.position.x = 0;
            // cube2.position.y = -10;
            // cube2.position.z = 0;
            // scene.add(cube2);

            // Creation du renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            // renderer.shadowCameraNear = 3;
            // renderer.shadowCameraFar = camera.far;
            // renderer.shadowCameraFov = 50;
            //
            // renderer.shadowMapBias = 0.0039;
            // renderer.shadowMapDarkness = 0.5;
            // renderer.shadowMapWidth = 1024;
            // renderer.shadowMapHeight = 1024;

            //keyboard = new THREE.KeyboardState();

            document.body.appendChild(renderer.domElement);
            document.addEventListener("keydown", onKeyDown, false);
            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            //mesh.rotation.x += 0.005;
            //mesh.rotation.y += 0.01;
            stats.begin();
            renderer.render(scene, camera);
            stats.end();
        }

        function onKeyDown(event) {
            switch (event.keyCode) {
                case 37 : // left
                    camera.position.x += 10;
                    console.log("keydown");
                    // DO SOMETHING
                    break;
                case 38 : // up
                    camera.position.z += 10;
                    console.log("keydown");
                    // DO SOMETHING
                    break;
                case 39 : // right
                    camera.position.x -= 10;
                    console.log("keydown");
                    // DO SOMETHING
                    break;
                case 40 : // down
                    camera.position.z -= 10;
                    console.log("keydown");
                    // DO SOMETHING
                    break;
            }
            camera.updateProjectionMatrix();
        }
    }

    function createMap(map, BLOCK_SIZE, scene) {
        var geometry = new THREE.CubeGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        var texture = new THREE.TextureLoader().load('assets/brickwall.jpg');
        var material = new THREE.MeshLambertMaterial ({map: texture});
        var max, max2;
        for (var i = 0, max = map.length; i < max; i = i + 1) {
            for (var j = 0, max2 = map[i].length; j < max2; j = j + 1) {
                if (map[i][j] == 1) {
                    var cube = new THREE.Mesh(geometry, material);
                    cube.position.set(BLOCK_SIZE * j, BLOCK_SIZE * 10, BLOCK_SIZE * i);
                    cube.castShadow = true;
                    cube.receiveShadow = true;
                    scene.add(cube);
                }
            }
        }
    }

    function loadObj2(filename, scene) {
        var texture = new THREE.TextureLoader().load("assets/" + filename + ".png");
        //var texture = new THREE.TextureLoader().load('assets/brickwall.jpg');
        var lambert = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});
        var loader = new THREE.OBJLoader();
        //loader.setMaterials(material);
        loader.load("assets/" + filename + ".obj", function(object) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh){
                    child.material = lambert;
                    child.castShadow = true;
                }
            });

            object.castShadow = true;
            object.receiveShadow = true;
            scene.add(object);
        });
    }

    function loadObj(filename, scene) {
        var materialLoader = new THREE.MTLLoader();
        materialLoader.setTexturePath("assets/");
        materialLoader.load("assets/" + filename + ".mtl", function(material) {
            material.preload();

            var loader = new THREE.OBJLoader();
            loader.setMaterials(material);
            loader.load("assets/" + filename + ".obj", function(object) {
                /*
                object.traverse( function ( child ) {

                    if ( child instanceof THREE.Mesh )
                    {
                        //child.geometry.computeFaceNormals();
                        var  geometry = child.geometry;
                        //console.log(geometry);
                        //geometry.dynamic = true;
                        material = child.material;
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.scale.set(5, 5, 5);
                        scene.add(mesh);

                        var useWireFrame = true;
                        if (useWireFrame) {
                            mesh.traverse(function (child) {
                                if (child instanceof THREE.Mesh)
                                {
                                    child.material.wireframe = true;
                                    child.material.color = new THREE.Color( 0x6893DE  );
                                }
                            });
                        }

                    }
                });
                */

                object.traverse(function(child) {
                    if (child instanceof THREE.Mesh){
                        //child.material = lambert;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                //object.scale.set(5, 5, 5);
                object.castShadow = true;
                object.receiveShadow = true;
                scene.add(object); // mesh pour le wireframe
            });
        });

    }

    window.addEventListener('DOMContentLoaded', function() {
        exports.TestThreeJS = new TestThreeJS();
    });

})();
