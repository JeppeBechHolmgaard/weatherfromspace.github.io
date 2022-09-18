import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// camera.position.x = 1.5;
// camera.position.y = -0.1;
camera.position.x = 1.1569190343554423;
camera.position.y = -0.004345553088943285;
camera.position.z = 1.0796641092340498;




renderer.render(scene, camera);


// Lights
scene.add(new THREE.AmbientLight(0xCACACA));

var light = new THREE.DirectionalLight(0xE4E4E4, 1);
light.position.set(-20,8,-5);
let hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.2 ); 
scene.add(light, hemiLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);
//Jorden

const earthTexture = new THREE.TextureLoader().load('public/2_no_clouds_4k.jpeg');
const earthNormalTexture = new THREE.TextureLoader().load('public/elev_bump_4k.jpeg');
const earthSpecularTexture = new THREE.TextureLoader().load('public/water_4k.png');
const earthGlow = new THREE.TextureLoader().load('public/glow.png');
const sunTexture = new THREE.TextureLoader().load('public/8k_sun.jpeg');



const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: earthNormalTexture,
    bumpScale:   0.005,
    specularMap: earthSpecularTexture,
    specular: new THREE.Color('grey')      })
);
// Glow om jorden
const materialEarth = new THREE.SpriteMaterial( { map: earthGlow, color: 0x437eff, transparent: true, blending: THREE.AdditiveBlending } );
const spriteEarth = new THREE.Sprite( materialEarth );

//Skyer
const cloudsTexture = new THREE.TextureLoader().load('public/fair_clouds_4k.png');

const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(0.515, 32, 32), 
  new THREE.MeshBasicMaterial({
    map: cloudsTexture,
    transparent: true,
    // side: THREE.BackSide
  }));
  const clouds1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.520, 32, 32), 
    new THREE.MeshBasicMaterial({
      map: cloudsTexture,
      transparent: true,
      // side: THREE.BackSide
    }));
    const clouds2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.525, 32, 32), 
      new THREE.MeshBasicMaterial({
        map: cloudsTexture,
        transparent: true,
        
        // side: THREE.BackSide
      }));

// Solen
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({
    map: sunTexture})
);
// Glow om solen

const materialSun = new THREE.SpriteMaterial( { map: earthGlow, color: 0xff5d1f, transparent: true, blending: THREE.AdditiveBlending } );
const spriteSun = new THREE.Sprite( materialSun );


// pos og scale
  clouds.position.set(0, 0, 1);
  clouds1.position.set(0, 0, 1);
  clouds1.rotation.z = 0.3;
  clouds2.rotation.y = 0.9;
  clouds2.position.set(0, 0, 1);


  earth.position.set(0, 0, 1); //(1, 0.4, 1);
  spriteEarth.scale.set(1.7, 1.7, 1);
  spriteEarth.position.set(0, 0, 1);
  sun.position.set(1.3,1.5,-4);
  spriteSun.position.set(1.3,1.5,-4);
  spriteSun.scale.set(3, 3,1);






  scene.add(earth);
  scene.add(spriteEarth);
  scene.add(clouds);

  // scene.add(sun);
  // scene.add(spriteSun);

// Particels Rain
const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 1100;
const posArray = new Float32Array(particlesCnt*3);
const material = new THREE.PointsMaterial({
  size: 0.2,
  color: 0xf0ffff
})

for (let i =0; i < particlesCnt * 3;i++){
    posArray[i]=  Math.random() * 400 -120 ;
   

}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));


const rain = new THREE.Points(particlesGeometry,material);


// api
let weather;
let state;
let backUpState;
const serverResponsDelay = 3500;
async function foo() {
  const res = await fetch('https://weatherdbi.herokuapp.com/data/weather/aalborg');

  weather = await res.json();
  console.log(weather);
  console.log(weather);


  // console.log(weather.currentConditions.comment);
  
  document.getElementById('currentTemp').textContent = weather.currentConditions.temp.c
  document.getElementById('currentWeat').textContent = weather.currentConditions.comment
  state = weather.currentConditions.comment;
  backUpState = weather.currentConditions.comment;
   


}
setTimeout(() => { changeWeather(state); }, serverResponsDelay);
setTimeout(() => { console.log( state ) }, serverResponsDelay);



foo();
function changeWeather(state) {
  switch(state){
    case 'Mostly cloudy':
    case 'Cloudy': 
    case 'Partly cloudy':
      scene.add(clouds1);
      scene.add(clouds2);
      scene.add(spriteSun);
      scene.add(sun);
      spriteSun.scale.set(2.5, 2.3,1);
      scene.remove(rain); 


      console.log('clouds added')
      break
    case 'Ligth rain showers':
    case 'Rainy':
      scene.add(rain); 
      scene.add(clouds1);
      scene.add(clouds2);
      scene.add(spriteSun);
      scene.add(sun);
      spriteSun.scale.set(2.5, 2.3,1);

      break
    case 'Mostly sunny':
    case 'Sunny':
      scene.add(sun);
      scene.add(spriteSun);
      scene.remove(clouds1);
      scene.remove(clouds2);
      spriteSun.scale.set(3, 3,1);
      scene.remove(rain); 


      

      console.log('sun added');
      break
    console.log('unknown');
    console.log(state);}


}

// Kører ikke i delay

// document.getElementById('sunny1').addEventListener("click", changeWeather('Mostly sunny'));
window.onload = function () {
  document.getElementById('sunny').addEventListener('click', () => {
    changeWeather('Mostly sunny');
  });

  document.getElementById('cloudy').addEventListener('click', () => {
    changeWeather('Cloudy');
});

  document.getElementById('rainy').addEventListener('click', () => {
    changeWeather('Rainy');
});

  document.getElementById('currentWeather').addEventListener('click', () => {
    changeWeather(backUpState);
    console.log(backUpState);
});
};

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = 0x1c1c1c;
// scene.background = spaceTexture;



// // Moon

// const moonTexture = new THREE.TextureLoader().load('moon.jpg');
// const normalTexture = new THREE.TextureLoader().load('normal.jpg');

// const moon = new THREE.Mesh(
//   new THREE.SphereGeometry(3, 32, 32),
//   new THREE.MeshStandardMaterial({
//     map: moonTexture,
//     normalMap: normalTexture,
//   })
// );

// scene.add(moon);

// moon.position.z = 30;
// moon.position.setX(-10);




// Animation Loop

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;  
  clouds.rotation.y += 0.0018;
  clouds1.rotation.z += 0.001;
  clouds2.rotation.x += 0.001;
  sun.rotation.x += 0.002;  
  sun.rotation.y += 0.002;  

  controls.enableDamping = true;
  rain.rotation.x -= 0.011569190343554423;
  // rain.rotation.y -= -0.00004345553088943285;
  // rain.rotation.z += 0.010796641092340498;
  // console.log(camera.position);


  // controls.update();


  renderer.render(scene, camera);
}
animate();
