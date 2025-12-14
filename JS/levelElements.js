let roomTypeWeights = {
  SafeRoom: 0.15,
  MonsterRoom: 0.25,
  TreasureRoom: 0.05,
  NormalRoom: 0.55,
};

class Room {
  constructor(x = 0, y = 0, monsterCount = 0, itemCount = 1) {
    this.x = x;
    this.y = y;
    this.monstersInRoom = [];
    this.itemsInRoom = [];

    this.adjRooms = {
      leftRoom: null,
      rightRoom: null,
      upRoom: null,
      downRoom: null,
    };

    // debugger;
    for (let index = 0; index < monsterCount; index++) {
      this.monstersInRoom.push(GenerateNewMonster());
    }

    for (let index = 0; index < itemCount; index++) {
      this.itemsInRoom.push(GenerateNewItem());
    }
  }

  //The method that will be called when the player enters a room
  OnEnter() {
    GenerateLogEntry(
      "=======================================================",
      "Console"
    );
    // console.log(`Floor Coordinates: ${this.x}, ${this.y}`);

    if (this.monstersInRoom.length > 0) {
      GenerateLogEntry(
        "You see something scurry out of the corner of your eye, something is in the room with you...",
        "Console"
      );

      DecideTurnOrder();
    } else {
      GenerateLogEntry(
        "The room is quiet, there doesn't seem to be anyone around, for now at least",
        "Console"
      );
      activeEntities.push(playerInstance);
    }

    let doorText = GetAdjRooms();

    GenerateLogEntry("You see doors " + doorText + " of you", "Console");

    currTurn = 0;
    activeEntities[currTurn].DoTurn();
  }
}

//Get all the rooms that are next to the given room and return a string with all the directions
function GetAdjRooms() {
  let doorText = "";
  for (const adjRoom in currRoom.adjRooms) {
    if (!(currRoom.adjRooms[adjRoom] == null)) {
      doorText += " " + adjRoom.replace("Room", "") + ",";
    }
  }

  return doorText;
}

//Move to a new room and run the room's onEnter function
function MoveToRoom(roomToMoveTo) {
  currRoom = roomToMoveTo;
  currRoom.OnEnter();
}

let monsterMins = { Normal: 1, Monster: 2, TreasureRoom: 1, Safe: 0 };
let monsterMaxs = { Normal: 3, Monster: 3, TreasureRoom: 2, Safe: 0 };

let itemMins = { Normal: 1, Monster: 1, TreasureRoom: 3, Safe: 0 };
let itemMaxs = { Normal: 2, Monster: 3, TreasureRoom: 5, Safe: 2 };

class Floor {
  constructor(width = 10, height = 10, totalRooms = 10) {
    this.grid = [[]];
    this.totalRooms = totalRooms;
    this.width = width;
    this.height = height;
    this.startingRoom;

    //Populate every cell with null for now
    for (let i = 0; i < height; i++) {
      this.grid[i] = [];
      for (let j = 0; j < width; j++) {
        this.grid[i][j] = null;
      }
    }
  }

  isCellEmpty(x, y) {
    // debugger;
    return this.grid[x][y] == null;
  }

  isValidCell(x, y) {
    if (x < this.width && x >= 0 && y < this.height && y >= 0) return true;
    else return false;
  }

  GenerateConnections(x, y) {
    //debugger;

    let leftRoom;
    if (this.isValidCell(x - 1, y)) leftRoom = this.grid[x - 1][y];
    let rightRoom;
    if (this.isValidCell(x + 1, y)) rightRoom = this.grid[x + 1][y];
    let upRoom;
    if (this.isValidCell(x, y - 1)) upRoom = this.grid[x][y - 1];
    let downRoom;
    if (this.isValidCell(x, y + 1)) downRoom = this.grid[x][y + 1];

    if (leftRoom) {
      this.grid[x][y].adjRooms.leftRoom = leftRoom;
      leftRoom.adjRooms.rightRoom = this.grid[x][y];
    }

    if (rightRoom) {
      this.grid[x][y].adjRooms.rightRoom = rightRoom;
      rightRoom.adjRooms.leftRoom = this.grid[x][y];
    }
    if (upRoom) {
      this.grid[x][y].adjRooms.upRoom = upRoom;
      upRoom.adjRooms.downRoom = this.grid[x][y];
    }
    if (downRoom) {
      this.grid[x][y].adjRooms.downRoom = downRoom;
      downRoom.adjRooms.upRoom = this.grid[x][y];
    }
  }

  GenerateNewRoom(x, y) {
    // debugger;
    //The room spot is empty, generate a new one
    if (this.isCellEmpty(x, y)) {
      //   debugger;
      let roomType = getWeightedRandom(roomTypeWeights);

      // console.log(roomType);

      let newRoom;
      let monsterMin = 0;
      let monsterMax = 0;
      let itemMin = 0;
      let itemMax = 0;

      // debugger;
      switch (roomType) {
        case "NormalRoom":
          monsterMin = monsterMins.Normal;
          monsterMax = monsterMaxs.Normal;

          itemMin = itemMins.Normal;
          itemMax = itemMaxs.Normal;
          break;

        case "MonsterRoom":
          monsterMin = monsterMins.Monster;
          monsterMax = monsterMaxs.Monster;

          itemMin = itemMins.Monster;
          itemMax = itemMaxs.Monster;
          break;

        case "SafeRoom":
          monsterMin = monsterMins.Safe;
          monsterMax = monsterMaxs.Safe;

          itemMin = itemMins.Safe;
          itemMax = itemMaxs.Safe;
          break;

        case "TreasureRoom":
          monsterMin = monsterMins.TreasureRoom;
          monsterMax = monsterMaxs.TreasureRoom;

          itemMin = itemMins.TreasureRoom;
          itemMax = itemMaxs.TreasureRoom;
          break;
      }
      newRoom = new Room(
        x,
        y,
        Math.floor(getRandom(monsterMin, monsterMax)),
        Math.ceil(getRandom(itemMin, itemMax))
      );

      // debugger;
      // console.log("Created new Room at: " + newRoom.x + ", " + newRoom.y);
      return newRoom;
    }
    //The room spot has been filled
    else {
      // console.log(`looking for connections in a room at: ${x}, ${y} `);
      //debugger;
      this.GenerateConnections(x, y);
      this.previousRoom = this.grid[x][y];
    }
  }

  GenerateDungeon() {
    //Generate Starter Room
    let randX = Math.floor(getRandom(0, this.width));
    let randY = Math.floor(getRandom(0, this.height));

    this.grid[randX][randY] = this.GenerateNewRoom(randX, randY, this, null);
    this.previousRoom = this.grid[randX][randY];

    this.startingRoom = this.grid[randX][randY];

    let directionWeights = { up: 0.25, left: 0.25, down: 0.25, right: 0.25 };

    for (let index = 0; index < this.totalRooms; index++) {
      if (this.previousRoom == undefined || this.previousRoom == null) debugger;
      let directionToMove = 0;
      let xToCheck = -1;
      let yToCheck = -1;
      //   debugger;
      do {
        directionToMove = getWeightedRandom(directionWeights);
        xToCheck = this.previousRoom.x;
        yToCheck = this.previousRoom.y;
        // debugger;

        switch (directionToMove) {
          case "up":
            directionWeights.up *= 0.9;
            yToCheck += 1;
            break;
          case "down":
            directionWeights.down *= 0.9;
            yToCheck -= 1;
            break;
          case "right":
            directionWeights.right *= 0.9;
            xToCheck += 1;
            break;
          case "left":
            directionWeights.left *= 0.9;
            xToCheck -= 1;
            break;
        }
        // console.log(`${xToCheck},${yToCheck}`);
        // debugger;
      } while (
        (xToCheck == this.previousRoom.x && yToCheck == this.previousRoom.y) ||
        !this.isValidCell(xToCheck, yToCheck)
      );

      if (xToCheck == undefined || yToCheck == undefined) {
        debugger;
      }

      let newRoom = this.GenerateNewRoom(xToCheck, yToCheck);
      if (newRoom != undefined) {
        // debugger;
        this.grid[newRoom.x][newRoom.y] = newRoom;
        this.previousRoom = newRoom;
      }
    }
  }

  PickRandomStartingRoom() {
    let randX;
    let randY;
    do {
      randX = Math.floor(getRandom(0, this.width));
      randY = Math.floor(getRandom(0, this.height));
    } while (this.isCellEmpty(randX, randY));

    return this.grid[randX][randY];
  }
}
