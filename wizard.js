class wizard {
    #health ;
    #mana ;

    constructor( name , { health = 100 , mana = 60 } = {}){
        this.name = name ;
        this.#health = health ;
        this.#mana = mana ;
    }
    
    isalive(){
        return this.#health > 0 ;
    }

    getstatus(){
        return {
            name : this.name ,
            health : this.#health ,
            mana : this.#mana ,
            alive : this.isalive() ,
        };
    }

    #clamphealth(){
        if(this.#health < 0 ) this.#health = 0 ;
    }

    #clampmana(){
        if ( this.#mana < 0 ) this.#mana = 0 ;
    }

     takedamage(amount){
        if ( amount <= 0 ) return ;
        this.#health -= amount ;
        this.#clamphealth() ;
    }

    spendmana(cost){
        if ( cost <= 0 ) return true ;
        if ( this.#mana < cost ) return false ;
        this.#mana -= cost ;
        this.#clampmana() ;
        return true ;
    }

    heal( amount , maxhealth = 120 ){
        if( amount <= 0 ) return ;
        this.#health += amount ;
        if( this.#health > maxhealth ) this.#health = maxhealth ;
    }
    
    castspell(target){
        console.log(`${this.name} waves a wand... but nothing happens`) ;
    }
}

class firewizard extends wizard {
    
    castspell(target){
        if (!this.isalive()) return ;

        const cost = 20 ;
        const basedamage = 25 ;

        if(!this.spendmana(cost)){
            console.log(`${this.name} tries fireball but is out of mana`) ;
            return ;
        }

        const ignite = Math.random() < 0.35 ;
        const damage = ignite ? basedamage + 12 : basedamage ;

        console.log(
            `${this.name} casts fireball at ${target.name} for ${damage} dmg ${ignite ? " (IGNITE!)" : "" }`
        );

        target.takedamage(damage);

    }
}

class icewizard extends wizard {

    castspell(target){
        if (!this.isalive()) return ;

        const cost = 15 ;
        const basedamage = 20 ;

        if(!this.spendmana(cost)){
            console.log(`${this.name} tries ice shard but is out of mana`) ;
            return ;
        }

        const chill = Math.random() < 0.4 ;
        const damage = basedamage;

        console.log(
            `${this.name} casts ice shard at ${target.name} for ${damage} dmg ${chill ? " (chill!)" : "" }`
        );

        target.takedamage(damage);

        if(chill && target.isalive()){

            const applied = target.spendmana(5);
            
            if(applied){
                console.log(`${target.name} feels chilled.. loses 5 mana`);
            }
        }
    }
}


class Duel {
    constructor( wizardA , wizardB ){
        this.a = wizardA ;
        this.b = wizardB ;
        this.round = 0 ;
    }

    printstatus(){
        console.log("status");
        console.log(this.a.getstatus());
        console.log(this.b.getstatus());
        console.log("----------\n"); 
    }

    playround(){
        this.round++;
        console.log(`\nROUND ${this.round}`);

        if (!this.a.isalive() || !this.b.isalive()) return ;

        const first = Math.random() < 0.5 ? this.a : this.b ;
        const second = first === this.a ? this.b : this.a ;

        first.castspell(second);
        if ( second.isalive())
            second.castspell(first);

        this.printstatus(); 
    }

    playuntilwinnner(maxrounds = 10 ){
        console.log(" welcome to wizard academy duel ") ; 
        this.printstatus();

        for(let i=0 ; i<maxrounds ; i++){
            if(!this.a.isalive() || !this.b.isalive()) break ;
            this.playround();
        }

        const aalive = this.a.isalive();
        const balive = this.b.isalive();

        if ( aalive && balive){
            console.log("time up! the duel ends in a chaotic draw .");
        } else if ( aalive ){
            console.log(`winner : ${this.a.name}`);
        } else if ( balive ){
            console.log(`winner : ${this.b.name}`);
        } else {
            console.log("double ko. the academy repairs the arena again .");
        }
    }
}

// 1
/*
const w1 = new firewizard("FIRE" , {health : 110 , mana : 70}) ;
const w2 = new icewizard("ICE " ,  { health : 100 , mana : 80}) ;

const duel = new Duel (w1 ,w2);
duel.playuntilwinnner(8);

console.log("final check:" , w1.getstatus() , w2.getstatus());*/


//2

const name1 = prompt("Enter name for Fire Wizard:");
const name2 = prompt("Enter name for Ice Wizard:");

const wiz1 = new firewizard(name1 || "Fire Wizard");
const wiz2 = new icewizard(name2 || "Ice Wizard");

const duel = new Duel(wiz1, wiz2);
duel.playuntilwinnner(15);

console.log("Final check :" , wiz1.getstatus(), wiz2.getstatus());