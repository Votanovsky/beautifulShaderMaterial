import './style.css'
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'

import * as dat from 'dat.gui'
import gsap from 'gsap'

const gltfLoader = new GLTFLoader()
// const objLoader = new OBJLoader()

import grad from '../static/textures/ttt.png'

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
ambientLight.position.x = 1
ambientLight.position.y = 1
ambientLight.position.z = 2

const pointLight2 = new THREE.PointLight(0xffffff, 0.5)
pointLight2.position.x = 3.4
pointLight2.position.y = 1.5
pointLight2.position.z = -15

const pointLight3 = new THREE.PointLight(0xffffff, .5)
pointLight3.position.x = 0.5
pointLight3.position.y = 9
pointLight3.position.z = 9

const pointLight4 = new THREE.PointLight(0xffffff, .5)
pointLight3.position.x = 1
pointLight3.position.y = 1
pointLight3.position.z = 1


scene.add(ambientLight, pointLight2, pointLight3, pointLight4)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ======================================================================================
let model = ''

let utime = 0 





/**
 * Animate
 */



const clock = new THREE.Clock()

const tick = () =>
{
    
    const elapsedTime = clock.getElapsedTime()

    
    utime+= 0.001
    
    controls.update()
    
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
    updateUniforms()
}

tick()
function updateUniforms() {
    scene.traverse(function(child) {
        if (child instanceof THREE.Mesh
            && child.material.type === 'ShaderMaterial') {
            child.material.uniforms.u_time.value = utime;
            child.material.needsUpdate = true;
        }
    });
}
gltfLoader.load('/textures/myhead4.gltf', (gltf)=> {
    
    model = gltf.scene
    model.scale.set(2.5, 2.5, 2.5)
    model.traverse(o=> {
        if(o.isMesh) {
            o.geometry.center()
            o.material = new THREE.ShaderMaterial({
                uniforms: {
                    grad: {
                        type: "t", 
                        value: new THREE.TextureLoader().load(grad)
                    }, 
                    u_time: {
                        type: "float",
                        value: utime
                    },
                    u_resolutin: {
                        type: "v4", 
                        value: new THREE.Vector4()
                    },
                    uvRate1: {
                        value: new THREE.Vector2(1, 1)
                    }
                },
                vertexShader:   document.getElementById('vertex').textContent,
                fragmentShader: document.getElementById('fragment').textContent,
                side: THREE.DoubleSide
            });
        }
        
    })
    scene.add(model)
})
