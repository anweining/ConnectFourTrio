var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;

var gameOver = false;
var spacesLeft = 42;
var board;

var rows = 6;
var columns = 7;
var currColumns = []; //keeps track of which row each column is at.

var count = 4;
let playerC = "one";
let neu = true;

window.onload = function() {
    setGame();
}

function setGame() {
  board = [];
  currColumns = [5, 5, 5, 5, 5, 5, 5];

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // JS
      row.push(' ');
      // HTML
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      //tile.classList.add('second');
      tile.classList.add("tile");
      //tile.addEventListener("click", setPiece);
      document.getElementById("board").append(tile);
    }
    board.push(row);
  }
}

function setPiece(place) {
  if (gameOver) {
    return;
  }

  //get coords of that tile clicked
  let coords = place.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  // figure out which row the current column should be on
  r = currColumns[c]; 

  if (r < 0) { // board[r][c] != ' '
    return;
  }

  board[r][c] = currPlayer; //update JS board
  let tile = document.getElementById(r.toString() + "-" + c.toString());
  if (currPlayer == playerRed) {
    tile.classList.add("red-piece");
    currPlayer = playerYellow;
  }
  else {
    tile.classList.add("yellow-piece");
    currPlayer = playerRed;
  }

  document.getElementById("square" + count.toString()).classList.remove(playerC);
  if (playerC == "one") {
    playerC= "three";
  }
  else {
    playerC= "one";
  }
  document.getElementById("square" + count.toString()).classList.add(playerC);

  r -= 1; //update the row height for that column
  currColumns[c] = r; //update the array

  spacesLeft -= 1;

  checkWinner();
}

function checkWinner() {
  if (spacesLeft == 0) {
        let tie = document.getElementById("winner");
        tie.innerText = "It's a tie";
        gameOver = true; 
    }

  // horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++){
      if (board[r][c] != ' ') {
        if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  // vertical
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      if (board[r][c] != ' ') {
        if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  // anti diagonal
  for (let r = 0; r < rows - 3; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != ' ') {
        if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  // diagonal
  for (let r = 3; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != ' ') {
        if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
          setWinner(r, c);
          return;
        }
      }
    }
  }
}

function setWinner(r, c) {
  let winner = document.getElementById("winner");
  if (board[r][c] == playerRed) {
    winner.innerText = "Red Wins";             
  } 
  else {
    winner.innerText = "Yellow Wins";
  }
  gameOver = true;
}

//const video = document.getElementById("video");
//const text = document.getElementById("text");
//text.style.display = 'none';
var firstElements = document.querySelectorAll('.first');
var secondElements = document.querySelectorAll('.second');
var squares = document.querySelectorAll('.square');
const gBoard = document.getElementById('board');
var spaces = document.querySelectorAll('.tile');

Webcam.set({
    width: 640,
    height: 480,
    image_format:'jpeg',
    jpeg_quality: 90,
})
Webcam.attach("#video")


Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
])
.then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}




let numImages = 0;
console.log("Before");
var myButton = document.querySelector("#btn");
myButton.addEventListener("click", captureImages);
let takenImages = [];

//for (let i = 0; i < 4; i++) {
  //document.getElementById("btn").addEventListener("click", captureImages());
  //console.log("i = " + i);
  //captureImages();
 //waitForButtonClick();
//}
//captureImages();
console.log("After");
//waitForButtonClick();


async function getLabeledFaceDescriptions() {
  //const labels = ["AlanWalker", "PlayerOne", "PlayerTwo"];
  const labels = ["R", "Y"];
  // Here
  console.log("takeImages.length = " + takenImages.length);
  return Promise.all(
    labels.map(async (label, index) => {
      const descriptions = [];
      console.log("index="+index);
      const Istart = index*2;
      const Iend = index+2;
      for (let i = Istart; i < Iend; i++) {
        //const img = await faceapi.fetchImage(`./labels/${label}/${i}.jpg`);
        //label = i;
        const img = await faceapi.bufferToImage(takenImages[i]);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withFaceExpressions();
        if (detections) {
            descriptions.push(detections.descriptor);
            console.log("i="+i);
            
        }
        else {
            console.warn('No face detected in image ' + i);
        }
      }
      /*
      for (let i = takenImages.length/2; i < takenImages.length; i++) {
        //const img = await faceapi.fetchImage(`./labels/${label}/${i}.jpg`);
        const img = await faceapi.bufferToImage(takenImages[i]);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        if (detections) {
            descriptions.push(detections.descriptor);
            console.log(i);
        }
        else {
            console.warn('No face detected in image ' + i);
        }
      }*/
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

console.log("Don't Start");
/*
video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result,
      });
      drawBox.draw(canvas);
    });
  }, 100);
});
*/

async function labeling() {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  const intervalID = setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
    let face = "";
    
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result,
      });
      //drawBox.draw(canvas);
      face = result.label;
    });

    console.log(face);

  document.getElementById("square" + count.toString()).classList.remove("nine");
  document.getElementById("square" + count.toString()).classList.add(playerC);

    if (face == currPlayer && detections && detections.length > 0) {
      const expressions = detections[0].expressions;
      console.log("Neutral:", expressions.neutral);
      console.log("Happy:", expressions.happy);
      console.log("Sad:", expressions.sad);
      console.log("Angry:", expressions.angry);
      console.log("Fearful:", expressions.fearful);
      console.log("Disgusted", expressions.disgusted);
      console.log("Surprised", expressions.surprised);

      if (neu == true && expressions.sad >= 0.8) {
        document.getElementById("square" + count.toString()).classList.remove(playerC);
        document.getElementById("square" + count.toString()).classList.add("nine");
        count -= 1;
        if (count < 1) {
          count = 7;
        }
        //document.getElementById("countLabel").innerHTML = count;
        document.getElementById("square" + count.toString()).classList.remove("nine");
        document.getElementById("square" + count.toString()).classList.add(playerC);
        neu = false;
      }
      
      if (neu == true && expressions.disgusted >= 0.8) {
        document.getElementById("square" + count.toString()).classList.remove(playerC);
        document.getElementById("square" + count.toString()).classList.add("nine");
        count = 4;
        //document.getElementById("countLabel").innerHTML = count;
        document.getElementById("square" + count.toString()).classList.remove("nine");
        document.getElementById("square" + count.toString()).classList.add(playerC);
        neu = false;
      }
      
      if (neu == true && expressions.happy >= 0.8) {
        document.getElementById("square" + count.toString()).classList.remove(playerC);
        document.getElementById("square" + count.toString()).classList.add("nine");
        count += 1;
        if (count > 7) {
          count = 1;
        }
        //document.getElementById("countLabel").innerHTML = count;
        document.getElementById("square" + count.toString()).classList.remove("nine");
        document.getElementById("square" + count.toString()).classList.add(playerC);
        neu = false;
      }
      
      if (neu == true && expressions.surprised >= 0.8) {
        setPiece("0-" + (count-1).toString());
        neu = false;
      }

      if (neu == false && expressions.neutral >= 0.8) {
        neu = true;
      }
    }
    if (gameOver) {
      clearInterval(intervalID);
    }
  }, 100);
}


async function captureImages() {
    //const capturedImages = [];
    console.log("Test");
  
    //for (let i = 1; i <= 4; i++) {
      console.log("B Loop");
      const blob = await take_Snapshot();
      console.log("After take");
      takenImages.push(blob);
      //document.getElementById('results'+1).innerHTML = '<img src="'+blob+'"/>';
      console.log("Testing");
    //}
    numImages++;
    console.log("numImages = " + numImages);

    if (numImages == 1) {
      myButton.innerHTML = "Take the second picture for player one";
    }
    else if (numImages == 2) {
      myButton.innerHTML = "Take the first picture for player two";
    }
    else if (numImages == 3) {
      myButton.innerHTML = "Take the second picture for player two";
    }

    if (numImages == 4) {

      //video.style.display = 'none';
      //myButton.style.display = 'none';
      //text.style.display = 'block';
      
      firstElements.forEach(function(element) {
        element.style.display = 'none';
      });
      secondElements.forEach(function(element) {
        element.style.display = 'block';
      });
      squares.forEach(function(element) {
        element.style.display = 'inline-block';
      });
      gBoard.style.display = 'flex';
      gBoard.style.flexWrap = 'wrap';
      spaces.forEach(function(element) {
        element.style.display = 'inline';
      });

      //document.getElementById("square" + count.toString()).classList.remove(playerC);

      labeling();
      
    }
    //return capturedImages;
  }
  
async function take_Snapshot() {
  console.log("start take");  
  return new Promise((resolve) => {
      Webcam.snap((dataUri) => {
        console.log("after snap");
        const blob = dataURItoBlob(dataUri);
        console.log("before snap end");
        resolve(blob);
      });
    });
  }

async function dataURItoBlob(dataURI) {
  /*
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(':')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
    
  return new Blob([ab], { type: mimeString });
  */
 return await (await fetch(dataURI)).blob();
}

