var container;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 100;

  // scene
  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight(0xbbbbbb);
  scene.add(ambient);

  var directionalLight = new THREE.DirectionalLight(0xdddddd);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  // texture
  var manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {

    console.log(item, loaded, total);

  };

  var texture = new THREE.Texture();

  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  var onError = function(xhr) {};

  var loader = new THREE.ImageLoader(manager);
   loader.load('data:image/jpg', function(image) {

    texture.image = image;
    texture.needsUpdate = true;

  });

  // model
  var loader = new THREE.OBJLoader(manager);
  loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/286022/Bulbasaur.obj', function(object) {

    object.traverse(function(child) {

      if (child instanceof THREE.Mesh) {

        child.material.map = texture;

      }

    });

    object.scale.x = 45;
    object.scale.y = 45;
    object.scale.z = 45;
    object.rotation.y = 3;
    object.position.y = -10.5;
    scene.add(object);

  }, onProgress, onError);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;

}

//

function animate() {

  requestAnimationFrame(animate);
  render();

}

function render() {

  camera.position.x += (mouseX - camera.position.x) * .05;
  camera.position.y += (-mouseY - camera.position.y) * .05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);

}