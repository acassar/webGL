function loadText(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.overrideMimeType("text/plain");
  xhr.send(null);
  if (xhr.status === 200)
    return xhr.responseText;
  else {
    return null;
  }
}

// variables globales du programme;
var canvas;
var gl; //contexte
var program; //shader program
var start = null;
var buffer;
var bufferColor;

var pMatrix = mat4.create();
var rMatrix = mat4.create();
var tMatrix = mat4.create();
var sMatrix = mat4.create();
var canvas;
var attribPerspective;

//mouvements
var XRotation = document.querySelector("#rotateX");
var YRotation = document.querySelector("#rotateY");
var ZRotation = document.querySelector("#rotateZ");

var XTranslation = document.querySelector("#translateX");
var YTranslation = document.querySelector("#translateY");
var ZTranslation = document.querySelector("#translateZ");

var Zoom = document.querySelector("#zoom");
var FOV = document.querySelector("#fov");


var currentPos = {
  rotateX: 0.00,
  rotateY: 0.00,
  rotateZ: 0.00,
  translateX: 0.00,
  translateY: 0.00,
  translateZ: 0.00,
  zoom: 1.0,
  fov: 75,
};


colorsArray = [
  // Triangle avant 1
  1, 0, 0, 1,
  1, 0, 0, 1,
  1, 0, 0, 1,

  // Triangle avant 2
  1, 0, 0, 1,
  1, 0, 0, 1,
  1, 0, 0, 1,

  // Triangle dessus 1
  0, 0, 1, 1,
  0, 0, 1, 1,
  0, 0, 1, 1,

  // Triangle dessus 2
  0, 0, 1, 1,
  0, 0, 1, 1,
  0, 0, 1, 1,

  // Triangle arrière 1
  0.1, 1, 0.5, 1,
  0.1, 1, 0.5, 1,
  0.1, 1, 0.5, 1,

  // Triangle arrière 2
  0.1, 1, 0.5, 1,
  0.1, 1, 0.5, 1,
  0.1, 1, 0.5, 1,

  // Triangle dessous 1
  1, 0, 1, 1,
  1, 0, 1, 1,
  1, 0, 1, 1,

  // Triangle dessous 2
  1, 0, 1, 1,
  1, 0, 1, 1,
  1, 0, 1, 1,

  // Triangle gauche 1
  0.5, 1, 0, 1,
  0.5, 1, 0, 1,
  0.5, 1, 0, 1,

  // Triangle gauche 2
  0.5, 1, 0, 1,
  0.5, 1, 0, 1,
  0.5, 1, 0, 1,

  // Triangle droit 1
  0, 1, 1, 1,
  0, 1, 1, 1,
  0, 1, 1, 1,

  // Triangle droit 2
  0, 1, 1, 1,
  0, 1, 1, 1,
  0, 1, 1, 1,

]


const positions = [
  // Triangle avant 1
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,

  // Triangle avant 2
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,

  // Triangle dessus 1
  -1.0, 1.0, -1.0,
  -1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,

  // Triangle dessus 2
  -1.0, 1.0, -1.0,
  1.0, 1.0, -1.0,
  1.0, 1.0, 1.0,

  // Triangle arrière 1
  -1.0, -1.0, -1.0,
  1.0, -1.0, -1.0,
  1.0, 1.0, -1.0,

  // Triangle arrière 2
  -1.0, 1.0, -1.0,
  -1.0, -1.0, -1.0,
  1.0, 1.0, -1.0,

  // Triangle dessous 1
  -1.0, -1.0, -1.0,
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,

  // Triangle dessous 2
  -1.0, -1.0, -1.0,
  1.0, -1.0, -1.0,
  1.0, -1.0, 1.0,

  // Triangle gauche 1
  -1.0, -1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, 1.0, -1.0,

  // Triangle gauche 2
  -1.0, -1.0, 1.0,
  -1.0, -1.0, -1.0,
  -1.0, 1.0, -1.0,

  // Triangle droit 1
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0, -1.0,

  // Triangle droit 2
  1.0, -1.0, 1.0,
  1.0, -1.0, -1.0,
  1.0, 1.0, -1.0,

];


window.addEventListener("resize", function () {
  resize();
});


function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.2, 0.2, 0.2, 1.0);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  mat4.perspective(pMatrix, currentPos.fov * Math.PI / 180, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0);
  gl.uniformMatrix4fv(attribPerspective, gl.FALSE, pMatrix);

}

function initContext() {
  canvas = document.getElementById('dawin-webgl');
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('ERREUR : echec chargement du contexte');
    return;
  }
  resize();

  gl.enable(gl.DEPTH_TEST);
}


function initEvents() {
  XTranslation.addEventListener("input", (e) => {
    mat4.translate(tMatrix, tMatrix, [0, +(e.target.valueAsNumber - currentPos.translateX).toFixed(2), 0]);
    currentPos.translateX = e.target.valueAsNumber;
    refreshBuffers();
  });
  YTranslation.addEventListener("input", (e) => {
    mat4.translate(tMatrix, tMatrix, [+(e.target.valueAsNumber - currentPos.translateY).toFixed(2), 0, 0]);
    currentPos.translateY = e.target.valueAsNumber;
    refreshBuffers();
  });
  ZTranslation.addEventListener("input", (e) => {
    mat4.translate(tMatrix, tMatrix, [0, 0, +(e.target.valueAsNumber - currentPos.translateZ).toFixed(2)]);
    currentPos.translateZ = e.target.valueAsNumber;
    refreshBuffers();
  });
  XRotation.addEventListener("input", (e) => {
    mat4.rotateX(rMatrix, rMatrix, +(e.target.valueAsNumber - currentPos.rotateX).toFixed(2));
    currentPos.rotateX = e.target.valueAsNumber;
    refreshBuffers();
  });
  YRotation.addEventListener("input", (e) => {
    mat4.rotateY(rMatrix, rMatrix, +(e.target.valueAsNumber - currentPos.rotateY).toFixed(2));
    currentPos.rotateY = e.target.valueAsNumber;
    refreshBuffers();
  });
  ZRotation.addEventListener("input", (e) => {
    mat4.rotateZ(rMatrix, rMatrix, +(e.target.valueAsNumber - currentPos.rotateZ).toFixed(2));
    currentPos.rotateZ = e.target.valueAsNumber;
    refreshBuffers();
  });

  Zoom.addEventListener("input", (e) => {
    mat4.scale(sMatrix, sMatrix, [1 + (e.target.valueAsNumber - currentPos.zoom), 1 + (e.target.valueAsNumber - currentPos.zoom), 1 + (e.target.valueAsNumber - currentPos.zoom)]);
    currentPos.zoom = e.target.valueAsNumber;
    refreshBuffers();
  });

  FOV.addEventListener("input", (e) => {
    mat4.perspective(pMatrix, e.target.valueAsNumber * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);
    currentPos.fov = e.target.valueAsNumber;
    refreshBuffers();
  });
}

//Initialisation des shaders et du program
function initShaders() {
  var fragmentSource = loadText('fragment.glsl');
  var vertexSource = loadText('vertex.glsl');

  var fragment = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment, fragmentSource);
  gl.compileShader(fragment);

  var vertex = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex, vertexSource);
  gl.compileShader(vertex);

  gl.getShaderParameter(fragment, gl.COMPILE_STATUS);
  gl.getShaderParameter(vertex, gl.COMPILE_STATUS);

  if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragment));
  }

  if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertex));
  }

  program = gl.createProgram();
  gl.attachShader(program, fragment);
  gl.attachShader(program, vertex);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Could not initialise shaders");
  }
  gl.useProgram(program);
}

//TODO
//Fonction initialisant les attributs pour l'affichage (position et taille)
function initAttributes() {
  attribPos = gl.getAttribLocation(program, "position");
  attribColor = gl.getAttribLocation(program, "color");
  attribPerspective = gl.getUniformLocation(program, "perspective");
  attribRotation = gl.getUniformLocation(program, "rotation");
  attribTranslation = gl.getUniformLocation(program, "translation");
  attribScale = gl.getUniformLocation(program, "scale");
}



function initBuffers() {
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(attribPos);
  gl.vertexAttribPointer(attribPos, 3, gl.FLOAT, true, 0, 0)

  bufferColor = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(attribColor);
  gl.vertexAttribPointer(attribColor, 2, gl.FLOAT, true, 0, 0);
  mat4.fromTranslation(tMatrix, [0, 0, -4.5]);


  gl.uniformMatrix4fv(attribPerspective, gl.FALSE, pMatrix);
  refreshBuffers();
}


//TODO
//Mise a jour des buffers : necessaire car les coordonnees des points sont ajoutees a chaque clic
function refreshBuffers() {
  gl.vertexAttribPointer(attribColor, 4, gl.FLOAT, true, 0, 0)
  gl.uniformMatrix4fv(attribTranslation, gl.FALSE, tMatrix);
  gl.uniformMatrix4fv(attribRotation, gl.FALSE, rMatrix);
  gl.uniformMatrix4fv(attribPerspective, gl.FALSE, pMatrix);
  gl.uniformMatrix4fv(attribScale, gl.FALSE, sMatrix);
  draw();
}

//TODO
//Fonction permettant le dessin dans le canvas
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

}

function main() {
  initContext();
  initShaders();
  initAttributes();
  initBuffers();
  initEvents();
}
