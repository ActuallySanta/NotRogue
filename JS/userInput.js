let playerTextInput = document.querySelector("#ActionInput");

let playerTextInputForm = document
  .querySelector("#PlayerTextInput")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    // console.log("submitted");
    OnPlayerActionInput(playerTextInput.value);
    playerTextInput.value = "";
  });

let actionButtons = [];

actionButtons = document.querySelectorAll(".ActionButton");
// debugger;
actionButtons.forEach((element) => {
  element.querySelector("button").addEventListener("click", (event) => {
    // console.log(event.target.value);

    ParseUserInput(event.target.value);
  });
});

//The code that is run when the player tries to input text
function OnPlayerActionInput(e) {
  if (!playerInstance.canInput) {
    // debugger;
    return;
  }

  ParseUserInput(e);
}

let log = document.querySelector("#TextArea");
let logEntryTemplate = document.querySelector("#LogEntryTemplate");

//Generate a single log entry on the page
function GenerateLogEntry(logContent, speaker) {
  let clonedTemplate = logEntryTemplate.content.cloneNode(true);
  clonedTemplate.querySelector(".LogInfo").textContent =
    ">" + `[${GetTimeStamp()}] ${speaker}: ` + logContent;

  let previousChild = log.childNodes[0];
  if (previousChild != null) {
    log.insertBefore(clonedTemplate, log.childNodes[0]);
  } else {
    log.appendChild(clonedTemplate);
  }
  return log.childNodes[0];
  //console.log(clonedTemplate);
}

//Generate a log entry with the emphasis styling, used for description
function GenerateDescriptionEntry(logContent, speaker) {
  let generatedLog = GenerateLogEntry(logContent, speaker);
  let logContents = generatedLog.innerHTML;
  generatedLog.innerHTML =
    ">" + `[${GetTimeStamp()}] ${speaker}:  <em> ${logContent} </em>`;
}

let statBlockTemplate = document.querySelector("#StatBlockTemplate");

//Make a pregenerated stat block for entities
function GenerateStatBlock(entityObj) {
  let clonedTemplate = statBlockTemplate.content.cloneNode(true);
  clonedTemplate.querySelector(".NameStat").textContent =
    "Name: " + entityObj.name;

  clonedTemplate.querySelector(
    ".HealthStat"
  ).textContent = `Health: ${entityObj.health}`;

  clonedTemplate.querySelector(".DefenseStat").textContent =
    "Defense: " + entityObj.defense;

  clonedTemplate.querySelector(".SpeedStat").textContent =
    "Speed: " + entityObj.speed;

  clonedTemplate.querySelector(".DescStat").textContent =
    "Description: " + entityObj.description;

  let previousChild = log.childNodes[0];
  if (previousChild != null) {
    log.insertBefore(clonedTemplate, log.childNodes[0]);
  } else {
    log.appendChild(clonedTemplate);
  }
}

let itemInfoTemplate = document.querySelector("#ItemInfoTemplate");
//Make a pregenerated stat block for items
function GenerateItemInfo(itemObj) {
  let clonedTemplate = itemInfoTemplate.content.cloneNode(true);
  clonedTemplate.querySelector(".DescInfo").textContent =
    "Description: " + itemObj.description;
  clonedTemplate.querySelector(".WorthInfo").textContent =
    "Worth: " + itemObj.worth;
  clonedTemplate.querySelector(".DiscoverabilityInfo").textContent =
    "Discoverability: " + itemObj.discoverability;
  clonedTemplate.querySelector(".NameInfo").textContent =
    "Name: " + itemObj.name;

  let previousChild = log.childNodes[0];
  if (previousChild != null) {
    log.insertBefore(clonedTemplate, log.childNodes[0]);
  } else {
    log.appendChild(clonedTemplate);
  }
}

let deathInfoTemplate = document.querySelector("#DeathInfoTemplate");
//Make a pregenerated blurb when the player dies
function GenerateDeathInfo(playerObj) {
  GenerateDescriptionEntry(
    "You have perished in the dungeon, you never saw what killed you, it was too quick. You join the legions of dead and undead that surround you, another hopeless soul hoping for a better chance...",
    "Console"
  );

  let clonedTemplate = deathInfoTemplate.content.cloneNode(true);
  clonedTemplate.querySelector(".TotalAttackInfo").textContent =
    "Total Damage: " + playerObj.atkDamage;

  clonedTemplate.querySelector(".TotalWorthInfo").textContent =
    "Total Worth: " + playerObj.worth;

  clonedTemplate.querySelector(".TotalSpeedInfo").textContent =
    "Total Speed: " + playerObj.speed;

  let previousChild = log.childNodes[0];
  if (previousChild != null) {
    log.insertBefore(clonedTemplate, log.childNodes[0]);
  } else {
    log.appendChild(clonedTemplate);
  }
  currGameState = gameState.Dead;
  GenerateLogEntry("Press Space to Restart", "Console");
}

let isAttacking = false;

//Take the user's input string and do actions based on what the player typed
function ParseUserInput(input) {
  GenerateLogEntry(input, "Player");

  let validCommands = {
    Move: "move",
    Attack: "attack",
    Search: "search",
    Use: "use",
    Help: "help",
    Info: "info",
    Exit: "exit",
    Kill: "kill",
  };

  let validMoveCommands = ["left", "right", "up", "down"];

  // debugger;

  input = input.trim();
  input = input.toLowerCase();

  //Check for actions that can be taken, regardless of game state
  switch (input) {
    case validCommands.Help:
      //Display all commands
      GenerateLogEntry("Here is a list of all the valid commands", "Console");
      GenerateLogEntry(
        '"move": Move from room to room in the dungeon',
        "Console"
      );
      GenerateLogEntry(
        '"attack": Allows you to attack an enemy on your turn',
        "Console"
      );
      GenerateLogEntry(
        '"search": Displays all items that you can accquire in the room you\'re in',
        "Console"
      );

      GenerateLogEntry('"help": Displays this menu', "Console");

      GenerateLogEntry(
        '"info": Displays a stat block for an object or entity',
        "Console"
      );
      return;

    case validCommands.Info:
      // debugger;
      //Display stat block for a given entity
      if (
        currRoom.monstersInRoom.length > 0 ||
        currRoom.itemsInRoom.length > 0
      ) {
        GenerateLogEntry("What would you like info on?", "Console");

        if (currRoom.monstersInRoom.length > 0) {
          GenerateLogEntry("Monsters", "Console");
          currRoom.monstersInRoom.forEach((element) =>
            GenerateLogEntry(element.name, "Console")
          );
        }

        if (foundItems.length > 0) {
          GenerateLogEntry("Found Items", "Console");
          foundItems.forEach((element) =>
            GenerateLogEntry(element.name, "Console")
          );
        }

        if (playerInstance.items.length > 0) {
          GenerateLogEntry("Held Items", "Console");
          playerInstance.items.forEach((element) =>
            GenerateLogEntry(element.name, "Console")
          );
        }

        currGameState = gameState.Info;
      } else {
        GenerateLogEntry("There is nothing to get info on", "Console");
      }
      return;

    case validCommands.Exit:
      //Return to idle
      GenerateLogEntry("Returning to idle", "Console");
      currGameState = gameState.Idle;
      return;

    case validCommands.Kill:
      GenerateLogEntry("Attempting to Kill self", "Console");
      playerInstance.TakeDamage(1000000);
      break;
  }

  validMoveCommands.forEach((element) => {
    if (input == element) currGameState = gameState.Moving;

    if (input == `move ${element}`) {
      input = input.replace("move", "");
      input = input.trim();
      currGameState = gameState.Moving;
    }
  });

  //Check for game specific input
  switch (currGameState) {
    case gameState.Idle:
      switch (input) {
        case validCommands.Move:
          //Move the player
          GenerateLogEntry(
            "Which direction would you like to move?",
            "Console"
          );

          let roomString = "Adjacent Rooms: ";

          for (const adjRoom in currRoom.adjRooms) {
            if (!(currRoom.adjRooms[adjRoom] == null)) {
              roomString += " " + adjRoom.replace("Room", "") + ",";
            }
          }
          GenerateLogEntry(roomString, "Console");
          // console.log(roomString);

          currGameState = gameState.Moving;
          break;

        case validCommands.Attack:
          //Attack an enemy

          if (currRoom.monstersInRoom.length == 0)
            GenerateLogEntry(
              "There is no enemies to attack, you're safe for now",
              "Console"
            );
          else {
            currGameState = gameState.Combat;
            GenerateLogEntry(
              "What enemy would you like to attack? Please input the index of the monster",
              "Console"
            );

            currRoom.monstersInRoom.forEach((element) => {
              let monsterInfoString = `${currRoom.monstersInRoom.indexOf(
                element
              )}: ${element.name}, Health: ${element.health}`;
              GenerateLogEntry(monsterInfoString, "Console");
            });
          }
          break;

        case validCommands.Search:
          //Search for items
          if (currRoom.itemsInRoom.length == 0) {
            GenerateLogEntry(
              "There's nothing of value you can take from this room, you greedy bastard",
              "Console"
            );
            currGameState = gameState.Idle;
          } else {
            GenerateLogEntry(
              "There may yet be something of value in this room",
              "Console"
            );

            currRoom.itemsInRoom.forEach((element) => {
              let discoverCheck = getRandom(0, 20);
              discoverCheck = Math.round(discoverCheck);

              //If you successfully find the item, log it and add it to the items you can pick up
              if (discoverCheck >= element.discoverability) {
                foundItems.push(element);
                GenerateLogEntry(`You find a ${element.name}`, "Console");
              }
            });

            if (foundItems.length == 0) {
              GenerateLogEntry(
                "You find nothing useful in the room, if only you'd looked harder",
                "Console"
              );
              currGameState = gameState.Idle;
              playerInstance.EndTurn();
            } else {
              //TODO Implement Searching
              GenerateLogEntry("What would you like to pickup?", "Console");
              currGameState = gameState.Searching;
            }
          }
          break;

        case validCommands.Use:
          GenerateLogEntry(
            "Which item would you like to use? Please enter a name.",
            "Console"
          );

          playerInstance.items.forEach((element) => {
            GenerateLogEntry(element.name, "Console");
          });

          currGameState = gameState.UsingItem;
          break;

        default:
          //Show an unrecognized command message
          GenerateLogEntry("Unrecognized Command, please try again", "Console");
          break;
      }
      break;
    case gameState.Combat:
      let indToAttack = parseInt(input);
      if (
        indToAttack != null &&
        indToAttack < currRoom.monstersInRoom.length &&
        indToAttack >= 0
      ) {
        playerInstance.Attack(currRoom.monstersInRoom[indToAttack]);
        currGameState = gameState.Idle;
        playerInstance.EndTurn();
      } else {
        //If we've made it here, there isn't a monster with that name
        GenerateLogEntry(
          "That index is invalid, please choose another number",
          "Console"
        );
      }

      break;
    case gameState.Searching:
      for (const item in foundItems) {
        if (input == foundItems[item].name.toLowerCase()) {
          playerInstance.AddItem(foundItems[item]);

          //Remove the item from the larger itemsInRoom array
          const ind = currRoom.itemsInRoom.indexOf(foundItems[item]);

          currRoom.itemsInRoom.splice(ind, 1);

          GenerateLogEntry(
            `You have added a ${foundItems[item].name} to your inventory`,
            "Console"
          );

          //Remove the item from the found items
          foundItems.splice(item, 1);
          currGameState = gameState.Idle;
          playerInstance.EndTurn();
          return;
        }
      }

      GenerateLogEntry(
        "Invalid item name, please input a different item name",
        "Console"
      );

      break;
    case gameState.Moving:
      //check if the input is valid
      if (!validMoveCommands.includes(input)) {
        GenerateLogEntry("Unrecognized input, please try again", "Console");
        return;
      }

      for (const adjRoom in currRoom.adjRooms) {
        let roomDir = adjRoom;

        //Remove the room at the end of the room direction
        roomDir = roomDir.replace("Room", "");

        // console.log(roomDir);

        //If the input matches a direction
        if (input == roomDir) {
          // debugger;
          if (currRoom.adjRooms[adjRoom] != null) {
            GenerateLogEntry(`Moving to ${roomDir} room`, "Console");
            playerInstance.LeaveRoom();
            MoveToRoom(currRoom.adjRooms[adjRoom]);
            return;
          } else {
            GenerateLogEntry(
              "All you see in that direction is a stone wall, cold and unmoving",
              "Console"
            );
            return;
          }
        }
      }
      GenerateLogEntry("Invalid input, please try again", "Console");
      // currGameState = gameState.Idle;
      //Return to game state after all the movement logic has been done
      break;
    case gameState.Info:
      //The player has entered a name of an item or an enemy
      GenerateLogEntry(
        "=======================================================",
        "Console"
      );
      // debugger;
      //Generate a statblock for an enemy if that is what the user wants
      currRoom.monstersInRoom.forEach((element) => {
        if (input == element.name.toLowerCase()) GenerateStatBlock(element);
      });

      //Do the same for items that the player has found in the room but not picked up
      foundItems.forEach((element) => {
        if (input == element.name.toLowerCase()) GenerateItemInfo(element);
      });

      //And for items that the player is currently holding
      playerInstance.items.forEach((element) => {
        if (input == element.name.toLowerCase()) GenerateItemInfo(element);
      });

      GenerateLogEntry(
        "=======================================================",
        "Console"
      );
      currGameState = gameState.Idle;
      break;

    case gameState.UsingItem:
      // debugger;
      playerInstance.items.forEach((element) => {
        if (input == element.name.toLowerCase()) {
          GenerateLogEntry(`Used ${element.name}`, "Console");
          element.OnUse();

          let indOfItem = playerInstance.items.indexOf(element);
          playerInstance.items.splice(indOfItem, 1);

          UpdateItemsList();

          currGameState = gameState.Idle;
          playerInstance.EndTurn();
          return;
        }
      });

      GenerateLogEntry(
        "That item does not exist, or you do not have it in your inventory, please enter another item",
        "Console"
      );

      break;
  }

  //Find a way to end the player's turn and allow enemies to do their turn
}

//Get the current time readout and return it in a usuable string
function GetTimeStamp() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  return `${hours}: ${minutes}: ${seconds}`;
}
