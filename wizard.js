class Wizard {
  #health;
  #mana;

  constructor(name, { health = 100, mana = 60 } = {}) {
    this.name = name;
    this.#health = health;
    this.#mana = mana;
  }

  isAlive() {
    return this.#health > 0;
  }

  getStatus() {
    return {
      name: this.name,
      health: this.#health,
      mana: this.#mana,
      alive: this.isAlive(),
    };
  }

  #clampHealth() {
    if (this.#health < 0) this.#health = 0;
  }

  #clampMana() {
    if (this.#mana < 0) this.#mana = 0;
  }

  takeDamage(amount) {
    if (!this.isAlive()) return;
    if (amount <= 0) return;

    this.#health -= amount;
    this.#clampHealth();
  }

  spendMana(cost) {
    if (!this.isAlive()) return false;
    if (cost <= 0) return true;
    if (this.#mana < cost) return false;

    this.#mana -= cost;
    this.#clampMana();
    return true;
  }

  heal(amount, maxHealth = 120) {
    if (amount <= 0) return;

    this.#health += amount; 
    if (this.#health > maxHealth) this.#health = maxHealth;
  }
}

class FireWizard extends Wizard {
  castSpell(target) {
    if (!this.isAlive()) return;

    const cost = 20;
    const baseDamage = 25;

    if (!this.spendMana(cost)) {
      console.log(`${this.name} tries fireball but is out of mana`);
      return;
    }

    const ignite = Math.random() < 0.35;
    const damage = ignite ? baseDamage + 12 : baseDamage;

    console.log(
      `${this.name} casts fireball at ${target.name} for ${damage} dmg ${
        ignite ? "(IGNITE!)" : ""
      }`
    );

    target.takeDamage(damage);
  }
}

class IceWizard extends Wizard {
  castSpell(target) {
    if (!this.isAlive()) return;

    const cost = 15;
    const baseDamage = 20;

    if (!this.spendMana(cost)) {
      console.log(`${this.name} tries ice shard but is out of mana`);
      return;
    }

    const chill = Math.random() < 0.4;
    const damage = baseDamage; 

    console.log(
      `${this.name} casts ice shard at ${target.name} for ${damage} dmg ${
        chill ? "(CHILL!)" : ""
      }`
    );

    target.takeDamage(damage);

    if (chill && target.isAlive()) {
      const applied = target.spendMana(5);
      if (applied) {
        console.log(`${target.name} feels chilled.. loses 5 mana`);
      }
    }
  }
}

class Duel {
  constructor(wizardA, wizardB) {
    this.a = wizardA;
    this.b = wizardB;
    this.round = 0;
  }

  printStatus() {
    console.log("status");
    console.log(this.a.getStatus());
    console.log(this.b.getStatus());
    console.log("----------\n");
  }

  play() {
    console.log("welcome to wizard academy duel");
    this.printStatus();

    while (this.a.isAlive() && this.b.isAlive() && this.round < 50) {
      this.round++;
      console.log(`\nROUND ${this.round}`);

      const first = Math.random() < 0.5 ? this.a : this.b;
      const second = first === this.a ? this.b : this.a;

      first.castSpell(second);
      if (second.isAlive()) {
        second.castSpell(first);
      }

      this.printStatus();
    }

    const winner = this.a.isAlive() ? this.a : this.b;
    console.log(`🏆 Winner: ${winner.name}`);
  }
}

const name1 = prompt("Enter name for Fire Wizard:");
const name2 = prompt("Enter name for Ice Wizard:");

const wiz1 = new FireWizard(name1 || "Fire Wizard");
const wiz2 = new IceWizard(name2 || "Ice Wizard");

const duel = new Duel(wiz1, wiz2);
duel.play();