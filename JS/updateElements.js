let itemList = document.querySelector("#ItemsOutput");

//Update the item list UI element
function UpdateItemsList(player) {
  itemList.innerHTML = "";
  playerInstance.items.forEach((element) => {
    let listItem = document.createElement("li");
    listItem.textContent = element.name;
    itemList.appendChild(listItem);
  });
}

let healthText = document.querySelector("#HealthOutput");

//Update the health text UI element
function UpdateHealthText() {
  healthText.textContent = `Health: ${playerInstance.health}/${playerInstance.maxHealth}`;
}

let damageText = document.querySelector("#DamageOutput");

//Update the damage text UI element
function UpdateDamageText() {
  damageText.textContent = `Damage: ${playerInstance.atkDamage}`;
}

//Update the worth text UI element
let worthText = document.querySelector("#WorthOutput");
function UpdateWorthText() {
  worthText.textContent = `Worth: ${playerInstance.worth}`;
}

//Update the speed text UI element
let speedText = document.querySelector("#SpeedOutput");
function UpdateSpeedText() {
  speedText.textContent = `Speed: ${playerInstance.speed}`;
}

//Update the defense text UI element
let defenseText = document.querySelector("#DefenseOutput");
function UpdateDefenseText() {
  defenseText.textContent = `Defense: ${playerInstance.defense}`;
}

//Update all the UI readouts together
function UpdateAllText() {
  UpdateHealthText();
  UpdateDamageText();
  UpdateWorthText();
  UpdateDefenseText();
  UpdateSpeedText();
  UpdateItemsList();
}
