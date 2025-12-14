let level = [];
let playerInstance;
let currRoom;
let currFloor = 0;

let activeEntities = [];
let currTurn = 0;

let foundItems = [];
let gameState = {
  Idle: 0,
  Combat: 1,
  Searching: 2,
  Moving: 3,
  Info: 4,
  UsingItem: 5,
  Dead: 6,
};

let currGameState = gameState.Idle;

//Play background music on load
window.addEventListener("load", (event) => {
  let sound = new Howl({
    src: ["Assets/Sounds/BackgroundMusic.mp3"],
    autoplay: true,
    loop: true,
    volume: 0.5,
  });
});

let inputForm = document
  .querySelector("#PlayerTextInput")
  .querySelector("#ActionInput");

document.addEventListener("keydown", (event) => {
  if (event.keyCode != 32) return;

  if (document.activeElement != inputForm) {
    // debugger;
    event.preventDefault();

    if (currGameState == gameState.Dead) {
      SetUpDungeon();
    } else if (canEndTurn) activeEntities[currTurn].DoTurn();
  }
});

document
  .querySelector("#PlayerActionInputContinue")
  .addEventListener("click", (event) => {
    activeEntities[currTurn].DoTurn();
  });

SetUpDungeon();

//Create a new dungeon floor
function SetUpDungeon() {
  document.querySelector("#TextArea").innerHTML = "";
  let newFloor = new Floor(5, 10, 25);
  newFloor.GenerateDungeon();
  level.push(newFloor);

  currRoom = level[currFloor].startingRoom;
  // console.log(currRoom.x + ", " + currRoom.y);

  playerInstance = new Player();
  currGameState = gameState.Idle;
  UpdateAllText();

  GenerateLogEntry(
    "Type in help or click on the help button below to see available commands",
    "Console"
  );

  currRoom.OnEnter();
}

//Order the enemies along with the player in a room for combat
function DecideTurnOrder() {
  //Clear any entities from the previous room
  activeEntities.length = 0;

  //Push all entities into the active array
  activeEntities.push(playerInstance);

  currRoom.monstersInRoom.forEach((element) => {
    activeEntities.push(element);
  });

  //Sort by speed value
  activeEntities.sort((a, b) => {
    if (a.speed > b.speed) return -1;
    else if (b.speed > a.speed) return 1;
    else return 0;
  });
}
