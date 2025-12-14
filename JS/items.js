let itemSpawnWeights = {
  healthPotion: 0.15,
  strengthPotion: 0.15,
  treasure: 0.2,
  fireballTome: 0.1,
  trappedChest: 0.1,
  apple: 0.3,
};

class Item {
  name;
  description; //Some flavor text to describe the item
  worth; //How much to add to the player's worth when the item is in the player's inventory
  discoverability; //The chance out of 20 to find it when searching

  OnUse() {}

  OnPickup() {
    GenerateLogEntry(`You pick up ${this.name}`, "Console");
    GenerateDescriptionEntry(this.description, "Console");
    playerInstance.AddWorth(this.worth);
    UpdateWorthText();
  }
}

class HealthPotion extends Item {
  name = "Health Potion";
  description =
    "A flask filled with a crimson fluid, consuming it will restore some vitality";
  worth = 50;
  discoverability = 15;
  OnUse() {
    playerInstance.ChangeHealth(50);
  }
}

class StrengthPotion extends Item {
  name = "Strength Potion";
  description =
    "A flask filled with a gold fluid, consuming it will grant you great strength for a time";
  worth = 50;
  discoverability = 15;
  OnUse() {
    playerInstance.atkDamage *= 1.3;
  }
}

class Treasure extends Item {
  name = "Treasure";
  description =
    "A treasure chest filled to the brim, the gleam of the precious metals and handcrafted jewelry hurt your eyes";
  discoverability = 12;
  worth = 300;
}

class FireballTome extends Item {
  name = "Fireball Tome";
  description =
    "A magical scroll brimming with power, you feel that if let loose, it could burn every creature in a room to a crisp";
  worth = 200;
  discoverability = 10;
  OnUse() {
    currRoom.monstersInRoom.forEach((element) => {
      element.TakeDamage(10000);
    });
    GenerateLogEntry(
      "You chant the incantation and a giant inferno floods the room. The monsters are burned to a crisp",
      "Console"
    );
  }
}

class TrappedChest extends Item {
  name = "Trapped Chest";
  description =
    "A booby-trapped chest, likely left from those who came before. It's worthless unless you try to open it, but that's risky.";

  worth = 0;
  trapDamage = 35;
  discoverability = 15;
  OnUse() {
    super.OnUse();
    if (!playerInstance.OnDefend(this.trapDamage)) {
      this.worth = 350;
      GenerateLogEntry(
        "You successfully disarm the trap, and are able to loot the riches inside",
        "Console"
      );
    }
  }
}

class Apple extends Item {
  name = "Apple";
  description =
    "A juicy round fruit, how it survived so long with such pristine condition in these catacombs is a mystery";
  discoverability = 18;
  worth = 10;

  OnPickup() {
    super.OnPickup();
    playerInstance.ChangeHealth(15);
    GenerateNewItem(
      "You eat the apple, and it tastes tart but sweet. You feel a little bit of life come back",
      "Console"
    );
  }
}

//Generate a new item for a room from the predetermined weights
function GenerateNewItem() {
  let spawnedItem = getWeightedRandom(itemSpawnWeights);
  // debugger;
  switch (spawnedItem) {
    case "healthPotion":
      return new HealthPotion();

    case "strengthPotion":
      return new StrengthPotion();

    case "treasure":
      return new Treasure();

    case "fireballTome":
      return new FireballTome();

    case "trappedChest":
      return new TrappedChest();

    case "apple":
      return new Apple();
  }
}
