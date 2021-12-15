var renderer, scene, camera, light, tiles;

var gravity = .3;

var ww = (cvs.width = cvs.parentNode.clientWidth),
  wh = (cvs.height = cvs.parentNode.clientHeight);

function anim() {

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('cvs'),
    antialias: true
  });
  renderer.setSize(ww, wh);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, ww / wh, 1, 10000);
  camera.position.set(0, 0, 190);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);

  light = new THREE.PointLight(0xffffff, 1.6, 1500);
  light.position.set(0, 0, 150);
  scene.add(light);
  createTiles();

  render();

  window.addEventListener("click", switchColor);

}

var switchColor = function() {
  picked++
  if (picked == 5) {
    picked = 0;
  }

  for (var i = 0; i < 5; i++) {
    for (var j = 0, k = tiles.children[i].children.length; j < k; j++) {
      var tile = tiles.children[i].children[j];
      tile.material.color = new THREE.Color(colors[picked][Math.floor(Math.random() * 8)]);
    }
  }

};

var colors = [
  [0x194358, 0xF2C5A8, 0xF2C5A8, 0xF2C5A8, 0XFF3627, 0XFF3627, 0XAD1715, 0XAD1715],
  [0x113F59, 0x19BEC0, 0x20D6C7, 0x19BEC0, 0xF3EDD3, 0xF3EDD3, 0xF3EDD3, 0XD54F58],
  [0xB2BB9C, 0xEDCC6B, 0xF1AD5A, 0x6D9692, 0xEDCC6B, 0xF1AD5A, 0xF1AD5A, 0xEDCC6B],
  [0x59DBD5, 0x43A39F, 0x055154, 0xFFBF3B, 0xFFBF3B, 0XFFBF3B, 0x59DBD5, 0XCF0A2C],
  [0xEB2144, 0xF16446, 0xA1D59F, 0xFFEFAF, 0xFFEFAF, 0xFFEFAF, 0xFFEFAF, 0xFFEFAF]
];
var picked = 1;

var distance = 22;

var createFace = function(side) {

  var wall = new THREE.Object3D(side);

  var depth = side ? 20 : 16;

  for (var i = 0; i < depth; i++) {
    for (var j = 0; j < 16; j++) {
      var geometry = new THREE.BoxGeometry(20, 20, 3);
      var material = new THREE.MeshLambertMaterial({
        color: colors[picked][Math.floor(Math.random() * 8)]
      });
      var tile = new THREE.Mesh(geometry, material);
      tile.position.y = (i * distance);
      tile.position.x = (j * distance);
      tile.speedX = Math.random() / 70;
      tile.speedY = Math.random() / 190 * (Math.random() < .5 ? 1 : -1);

      wall.add(tile);
    }
  }

  return wall;

};

var createTiles = function() {

  tiles = new THREE.Object3D();
  scene.add(tiles);

  face1 = createFace(true);
  face1.position.x = -(15 * distance) / 2;
  face1.position.y = -(9.5 * distance);
  face1.rotation.x = -Math.PI / 2;
  tiles.add(face1);

  face2 = createFace(true);
  face2.position.x = -(16 * distance) / 2;
  face2.position.y = -(18 * distance) / 2;
  face2.rotation.x = -Math.PI / 2;
  face2.rotation.y = -Math.PI / 2;
  tiles.add(face2);

  face3 = createFace(true);
  face3.position.x = (16 * distance) / 2;
  face3.position.y = -(18 * distance) / 2;
  face3.rotation.x = -Math.PI / 2;
  face3.rotation.y = -Math.PI / 2;
  tiles.add(face3);

  face4 = createFace(true);
  face4.position.x = -(15 * distance) / 2;
  face4.position.y = (13 * distance) / 2;
  face4.rotation.x = -Math.PI / 2;
  tiles.add(face4);

  face5 = createFace(false);
  face5.position.x = -(15 * distance) / 2;
  face5.position.y = -(9 * distance);
  face5.position.z = -(19.5 * distance);
  tiles.add(face5);

};

var render = function(a) {
  requestAnimationFrame(render);

  for (var i = 0; i < 5; i++) {
    for (var j = 0, k = tiles.children[i].children.length; j < k; j++) {
      var tile = tiles.children[i].children[j];
      tile.rotation.x += tile.speedX;
      tile.rotation.y += tile.speedY;
    }
  }

  camera.rotation.z += .0005;

  renderer.render(scene, camera);
};

anim();

window.addEventListener( 'resize', function(){
	
	ww = cvs.width = cvs.parentNode.clientWidth;
	wh = cvs.height = cvs.parentNode.clientHeight;
	
    renderer.setSize(ww, wh);

});