let canEndTurn = false;

//The parent class for all the entities in the game, as in all the objects that engage in combat
class Entity {
  constructor() {
    this.maxHealth = this.health;
  }
  health = 100;
  maxHealth;
  atkDamage = 10;
  name;
  defense = 5;
  speed = 100;

  description;

  DoTurn() {
    canEndTurn = false;
  }

  EndTurn() {
    currTurn++;

    if (currTurn >= activeEntities.length) currTurn = 0;
    GenerateLogEntry("Press Space to continue...", "Console");
    GenerateLogEntry(
      "=======================================================",
      "Console"
    );
    canEndTurn = true;
    // debugger;
  }

  OnDefend(attackDamage) {
    let defCheck = getRandom(0, 20);
    // debugger;
    if (this.defense >= defCheck) {
      GenerateLogEntry("The attack is defended", this.name);
      return false;
    } else {
      GenerateLogEntry(
        `The attack has landed, hit for ${attackDamage} damage, ${
          this.name
        }'s health is now ${this.health - attackDamage}`,
        this.name
      );
      let hitSFX = new Howl({
        src: ["Assets/Sounds/SFX/sword-hit.wav"],
        autoplay: true,
        volume: 0.5,
      });
      this.TakeDamage(attackDamage);
      return true;
    }
  }

  OnDeath() {
    GenerateLogEntry(`${this.name} has died`, "Console");
  }

  TakeDamage(damageToTake) {
    this.health -= damageToTake;
    if (this.health <= 0) {
      // debugger;
      this.OnDeath();
    }
  }

  DisplayStats() {
    GenerateLogEntry(`Stats for ${this.name}`, this.name);
    GenerateStatBlock(this);
  }
}

//The player class, has the player's stats as well as the methods for interacting with it
class Player extends Entity {
  constructor() {
    super();
  }
  items = [];
  name = "Player";
  worth = 0;
  canInput = false;

  AddItem(itemToAdd) {
    this.items.push(itemToAdd);
    itemToAdd.OnPickup();
    // debugger;
    UpdateItemsList(this);
  }

  ChangeHealth(healthToAdd) {
    this.health += healthToAdd;
    this.health = clamp(this.health, 0, this.maxHealth);
    UpdateHealthText();
  }

  AddWorth(worthToAdd) {
    this.worth += worthToAdd;
    UpdateWorthText();
  }

  Attack(monsterToAttack) {
    GenerateLogEntry(`You swing at the ${monsterToAttack.name}`, this.name);

    let swordSFX = new Howl({
      src: ["Assets/Sounds/SFX/sword-swing.wav"],
      autoplay: true,
      volume: 0.5,
    });
    monsterToAttack.OnDefend(this.atkDamage);
  }

  DoTurn() {
    // debugger;
    super.DoTurn();
    this.canInput = true;
    GenerateLogEntry("What would you like to do?", "Console");
  }

  EndTurn() {
    //In case the action didn't trigger it, return to idle
    currGameState = gameState.Idle;
    this.canInput = false;
    super.EndTurn();
  }

  LeaveRoom() {
    currGameState = gameState.Idle;
    this.canInput = false;
  }

  OnDefend(attackDamage) {
    super.OnDefend(attackDamage);
    UpdateHealthText();
  }

  OnDeath() {
    const logArea = document.querySelector("#TextArea");

    logArea.innerHTML = "";
    super.OnDeath();
    GenerateDeathInfo(this);
  }
}

//The parent class for all the monsters in the game, as in all the non player entities
class Monster extends Entity {
  lootOnDrop;
  attackWeights;
  deathWorth;
  constructor() {
    super();
    this.maxHealth = this.health;
    this.lootOnDrop = GenerateNewItem();
  }

  DoTurn() {
    super.DoTurn();
    let doesAttack = getWeightedRandom(this.attackWeights);

    if (doesAttack) {
      GenerateLogEntry(`Swings at you!`, this.name);
      playerInstance.OnDefend(this.atkDamage);
    } else {
      GenerateLogEntry(`Stands there, unmoving`, this.name);
    }
    this.EndTurn();
  }

  OnDeath() {
    super.OnDeath();
    GenerateLogEntry("The monster drops a " + this.lootOnDrop.name, "Console");
    playerInstance.AddItem(this.lootOnDrop);
    playerInstance.AddWorth(this.deathWorth);

    let indOfMonster = currRoom.monstersInRoom.indexOf(this);
    currRoom.monstersInRoom.splice(indOfMonster, 1);

    indOfMonster = activeEntities.indexOf(this);
    activeEntities.splice(indOfMonster, 1);
    // debugger;
  }
}

class Skeleton extends Monster {
  atkDamage = 15;
  health = 15;
  name = "Skeleton";
  speed = 25;
  deathWorth = 10;
  description =
    "A shambling mess of bones and old sinew. It may have been a famous adventurer in a past life";
  attackWeights = { attack: 0.25, noAttack: 0.75 };
  constructor() {
    super();
  }
}

class Goblin extends Monster {
  atkDamage = 10;
  health = 10;
  name = "Goblin";
  speed = 40;
  deathWorth = 15;
  description =
    "Short and green. They may not be very strong but they are quite quick";
  attackWeights = { attack: 0.35, noAttack: 0.65 };
  constructor() {
    super();
  }
}

class Ogre extends Monster {
  atkDamage = 25;
  health = 50;
  name = "Ogre";
  speed = 10;
  deathWorth = 50;
  description =
    "Large and dumb. These monsters carry large clubs fashioned from gods know what, all you know is that it hurts to get hit by them";
  attackWeights = { attack: 0.2, noAttack: 0.85 };
  constructor() {
    super();
  }
}

class YoungDragon extends Monster {
  atkDamage = 45;
  health = 60;
  name = "Young Dragon";
  deathWorth = 350;
  description =
    "Powerful and terrifying. Although they aren't fully grown, they are still more than powerful enough to send you to the afterlife without a second thought";
  attackWeights = { attack: 0.45, noAttack: 0.65 };
  constructor() {
    super();
  }
}

class GoldSlime extends Monster {
  atkDamage = 1;
  health = 1;
  name = "Gold Slime";
  speed = 0;
  deathWorth = 150;
  description =
    "A rare find. Thought to have gone exctinct, the body of the Gold Slime fetches a hefty price by the nobles of the land";
  attackWeights = { attack: 0.25, noAttack: 0.75 };
  constructor() {
    super();
  }
}

let monsterSpawnWeights = {
  Skeleton: 0.35,
  Goblins: 0.35,
  Orge: 0.2,
  YoungDragon: 0.05,
  GoldSlime: 0.05,
};

//Return a newly created monster for a room from the predetermined weights
function GenerateNewMonster() {
  let spawnedMonster = getWeightedRandom(monsterSpawnWeights);
  // debugger;
  switch (spawnedMonster) {
    case "Skeleton":
      return new Skeleton();

    case "Goblins":
      return new Goblin();

    case "Orge":
      return new Ogre();

    case "YoungDragon":
      return new YoungDragon();

    case "GoldSlime":
      return new GoldSlime();
  }
}
