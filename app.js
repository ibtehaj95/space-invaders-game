let invdr_tmr = 0;
let all_invdrs_dead = 0;
let all_shields_intact = 1;
let bomb_0_en_route = 0;
let bomb_1_en_route = 0;
let score = 0;
let lives = 3;

const player_obj = {
    left: 50,
    right: 55,
    top: 3,
    bottom: 0
};

const shield_stat = [1, 1, 1, 1];

const bullet_obj = {
    corr_y: 2,
    corr_x: 52,
    width: 0.2,
    height: 2,
    visibility: "hidden",
    en_route: 0,
    bullet_tmr: 0,
    col_det: 0,
    shoot: function(left_x, right_x){
        if(!this.en_route){
            this.corr_x = Math.floor((left_x + right_x)/2);
            this.en_route = 1;
            this.bullet_tmr = setInterval(this.move.bind(this), 20);
        }
    },
    move: function(){
        this.corr_y = this.corr_y + 2;
        this.visibility = "visible";
        this.chk_collision();
    },
    chk_collision: function(){
        let killed_id = 0;
        let shield_hit = 0;
        let bullet_strayed = 0;
        let shield_id = 0;
        if(this.corr_y > 98){
            this.col_det = 1;
            bullet_strayed = 1;
        }

        else if(this.corr_y > 5 && this.corr_y < 20 && all_shields_intact){
            if(this.corr_x >= 16 && this.corr_x < 21 && shield_stat[0]){
                this.col_det = 1;
                shield_hit = 1;
                shield_stat[0] = 0;
                shield_id = 0;
            }
            else if(this.corr_x >= 37 && this.corr_x < 42 && shield_stat[1]){
                this.col_det = 1;
                shield_hit = 1;
                shield_stat[1] = 0;
                shield_id = 1;
            }
            else if(this.corr_x >= 58 && this.corr_x < 63 && shield_stat[2]){
                this.col_det = 1;
                shield_hit = 1;
                shield_stat[2] = 0;
                shield_id = 2;
            }
            else if(this.corr_x >= 79 && this.corr_x < 84 && shield_stat[3]){
                this.col_det = 1;
                shield_hit = 1;
                shield_stat[3] = 0;
                shield_id = 3;
            }
        }

        if(!all_invdrs_dead){
            for(let i=0; i<50; ++i){
                if(!invaders[i].dead){
                    if(this.corr_x > invaders[i].corr_x && this.corr_x+this.width < invaders[i].corr_x+invaders[i].width && this.corr_y > invaders[i].corr_y && this.corr_y+this.height < invaders[i].corr_y+invaders[i].height){
                        invaders[i].dead = 1;
                        inv_elem = document.getElementById(`a-${invaders[i].number}`);
                        inv_elem.style.visibility = "hidden";
                        // console.log("Enemy Killed", i);
                        this.col_det = 1;
                        killed_id = i;
                    }

                }
            }
        }

        if(this.col_det)
        {
            this.visibility = "hidden";
            this.corr_x = 0;
            this.corr_y = 2;
            this.en_route = 0;
            clearInterval(this.bullet_tmr);
            this.col_det = 0;

            //check if the entire cornermost col is dead, if so, then extend left or right limit, depending on corner
            if((invaders[killed_id].left_most === 1 || invaders[killed_id].right_most === 1) && shield_hit === 0 && bullet_strayed === 0){
                atk_col = invaders.filter(function(invader){
                    if((invader.number%10 === invaders[killed_id].number%10) && invader.dead === 0){
                        // console.log(invader.number, invaders[killed_id].number);
                        return invader;
                        }
                    });
                // console.log(atk_col);
                if(atk_col.length === 0){
                    // console.log(killed_id);
                    // console.log("Column Down");
                   if(invaders[killed_id].left_most === 1){
                    let adj_inv_found = 0;
                    let adj_inv = killed_id;
                    let loop_passes = 0;
                    let no_more_invdrs = 0;
                    while(adj_inv_found === 0){
                        adj_inv++;
                        loop_passes++;
                        adj_col = invaders.filter(function(invader){
                            if(invader.number%10 === adj_inv%10 && invader.dead === 0)
                            {
                                return invader;
                            }
                        });
                        if(adj_col.length > 0){
                            adj_inv_found = 1;
                        }
                        if(loop_passes > 9){
                            no_more_invdrs = 1;
                            break;
                        }
                    }
                    if(no_more_invdrs === 0){
                        new_left_most_col = invaders.filter(function(invader){
                            return invader.number%10 === adj_inv%10;
                        });
                        new_left_most_col.forEach(function(invader){
                            invader.left_most = 1;
                        });
                        invaders.forEach(function(invader){
                            invader.corr_x_lim_l = invader.corr_x_lim_l-5*loop_passes;
                            // console.log(invader.number ,invader.corr_x_lim_l, invader.dead);
                        });
                    }
                    else{
                        all_invdrs_dead = 1;
                        console.log("Game Over. You Win. You defeated the Enemy");
                        end_game();
                    }
                   }
                   else{
                    let adj_inv_found = 0;
                    let adj_inv = killed_id;
                    let loop_passes = 0;
                    let no_more_invdrs = 0;
                    while(adj_inv_found === 0){
                        adj_inv--;
                        loop_passes++;
                        adj_col = invaders.filter(function(invader){
                            if(invader.number%10 === adj_inv%10 && invader.dead === 0)
                            {
                                return invader;
                            }
                        });
                        if(adj_col.length > 0){
                            adj_inv_found = 1;
                        }
                        if(loop_passes > 9){
                            no_more_invdrs = 1;
                            break;
                        }
                    }
                    if(no_more_invdrs === 0){
                        new_right_most_col = invaders.filter(function(invader){
                            return invader.number%10 === adj_inv%10;
                        });
                        new_right_most_col.forEach(function(invader){
                            invader.right_most = 1;
                        });
                        invaders.forEach(function(invader){
                            invader.corr_x_lim_r = invader.corr_x_lim_r+5*loop_passes;
                        });
                    }

                    else{
                        all_invdrs_dead = 1;
                        console.log("Game Over. You Win. You defeated the Enemy");
                        end_game();
                    }
                    
                   }
                }
            }

            if(shield_hit){
                console.log("Shield Hit!");
                const shield_elem = document.getElementById(`shld-${shield_id}`);
                shield_elem.style.visibility = "collapse";
                if (shield_stat.reduce(function(pv, cv){
                    return pv+cv;
                }, 0) === 0)
                {
                    all_shields_intact = 0;
                }
            }
            
        }
        bullet_elem.style.visibility = this.visibility;
        bullet_elem.style.left = `${this.corr_x}%`;
        bullet_elem.style.bottom = `${this.corr_y}%`;
    }
};

const game_area = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};

const invaders = [];

class Invaders {
    type = "";
    number = 0;
    corr_x = 0;
    width = 2.5;
    corr_x_lim_r = 0;
    corr_x_lim_l = 0;
    corr_y = 0;
    height = 6;
    corr_y_lim = 0;
    dead = 0; //0 is dead, 1 is alive
    moving = "right";
    go_down = 0;
    element;
    breached = 0;
    left_most = 0;
    right_most = 0;
    // loc = 0;    //last member of the attack column

    constructor(typ, num, loc_x, loc_y){
        this.type = typ;
        this.number = num;
        this.corr_x = loc_x;
        this.corr_y = loc_y;
        this.display_new_invaders();
        if(this.number%10 === 0){
            this.left_most = 1;
        }
        else if(this.number%10 === 9){
            this.right_most = 1;;
        }
    }

    display_new_invaders(){
        const inv_div = document.createElement("div");
        inv_div.classList.add("alien");
        inv_div.classList.add(`alien-type-${this.type}`);
        inv_div.setAttribute("id", `a-${this.number}`);
        inv_div.style.left = `${this.corr_x}%`;
        inv_div.style.bottom = `${this.corr_y}%`;
        game_cont_elem.appendChild(inv_div);
        this.element = document.getElementById(`a-${this.number}`);
        this.corr_x_lim_r = this.corr_x + 45;
        this.corr_x_lim_l = this.corr_x - 0;
        this.corr_y_lim = this.corr_y - 70 + Math.floor(this.number/10)*10;
    }

    move(){
        if(!this.go_down){
            if(this.moving === "right" && this.corr_x < this.corr_x_lim_r){
                this.corr_x = this.corr_x + 5;
            }
            else if(this.moving === "right" && !(this.corr_x < this.corr_x_lim_r)){
                this.moving = "left";
                this.go_down = 1;
            }
            else if(this.moving === "left" && this.corr_x > this.corr_x_lim_l){
                this.corr_x = this.corr_x - 5;
            }
            else if(this.moving === "left" && !(this.corr_x > this.corr_x_lim_l)){
                this.moving = "right";
                this.go_down = 1;
            }
        }
        else {
            this.go_down = 0;
            if(this.corr_y > this.corr_y_lim){
                this.corr_y = this.corr_y - 5;
            }
            else if(!this.dead){    //a simple else would suffice
                this.breached = 1;
                this.corr_y = this.corr_y - 5;
            }
        }
        this.element.style.left = `${this.corr_x}%`;
        this.element.style.bottom = `${this.corr_y}%`;
        if(this.breached){
            console.log("Game Over. You Lose. Defenses Compromised");
            end_game();
        }
    }
}

class Bomb {
    corr_x = 0;
    corr_y = 0;
    width = 3;
    height = 0.5;
    en_route = 0;
    col_det = 0;
    bomb_tmr = 0;
    visibility = "hidden";
    number = 0;
    element;
    corr_y_lim = 0;

    constructor(num){
        const rand = this.randint();
        this.corr_x = this.average(invaders[rand].corr_x, invaders[rand].corr_x + invaders[rand].width);
        this.corr_y = invaders[rand].corr_y + this.height;
        this.number = num;
        this.element = this.make_bomb();
        this.bomb_tmr = setInterval(this.move.bind(this), 30);
    }

    move(){
        this.corr_y = this.corr_y - 2;
        this.visibility = "visible";
        this.chk_collision();
    }

    chk_collision(){

        let shield_hit = 0;
        let shield_id = 0;

        if(this.corr_y < this.corr_y_lim){
            this.col_det = 1;
        }

        else if(this.corr_y > 5 && this.corr_y < 20 && all_shields_intact){
            if(this.corr_x >= 16 && this.corr_x < 21 && shield_stat[0]){
                this.col_det = 1;
                shield_hit = 1;
                shield_stat[0] = 0;
                shield_id = 0;
            }
            else if(this.corr_x >= 37 && this.corr_x < 42 && shield_stat[1]){
                this.col_det = 1;
                shield_hit = 1;
                shield_stat[1] = 0;
                shield_id = 1;
            }
            else if(this.corr_x >= 58 && this.corr_x < 63 && shield_stat[2]){
                this.col_det = 1;
                shield_hit = 1;
                shield_stat[2] = 0;
                shield_id = 2;
            }
            else if(this.corr_x >= 79 && this.corr_x < 84 && shield_stat[3]){
                this.col_det = 1;
                shield_hit = 1;
                shield_stat[3] = 0;
                shield_id = 3;
            }
        }

        else if(this.corr_y > this.corr_y_lim && this.corr_y < 5){
            if(this.corr_x > player_obj.left && this.corr_x < player_obj.right && this.corr_y > player_obj.bottom && this.corr_y < player_obj.top){
                this.col_det = 1;   //x-corr edge bw user x bounds AND y-corr bw user y-bounds
                game_reset();
            }
            else if(this.corr_x+this.width > player_obj.left && this.corr_x+this.width < player_obj.right && this.corr_y > player_obj.bottom && this.corr_y < player_obj.top){
                this.col_det = 1;   //x-corr+width edge bw user x bounds AND y-corr bw user y-bounds
                game_reset();
            }
        }

        if(this.col_det === 1){
            clearInterval(this.bomb_tmr);   //clear timer
            if(this.number === 0){
                bomb_0_en_route = 0;
                this.visibility = "hidden";
            }
            else if(this.number === 1){
                bomb_1_en_route = 0;
                this.visibility = "hidden";
            }

            if(shield_hit){
                console.log("Shield Hit!");
                const shield_elem = document.getElementById(`shld-${shield_id}`);
                shield_elem.style.visibility = "collapse";
                if (shield_stat.reduce(function(pv, cv){
                    return pv+cv;
                }, 0) === 0)
                {
                    all_shields_intact = 0;
                }
            }
        }
        this.element.style.visibility = this.visibility;
        this.element.style.left = `${this.corr_x}%`;
        this.element.style.bottom = `${this.corr_y}%`;
    }

    make_bomb(){
        const elem = document.createElement("div");
        elem.classList.add("bomb");
        elem.setAttribute("id", `bomb-${this.number}`);
        game_cont_elem.appendChild(elem);
        return elem;
    }

    randint(){
        let found = 0;
        let rand = 0;
        while(found === 0){
            rand = Math.floor(Math.random()*50);
            if(invaders[rand].dead === 0){
                found = 1;
            }
        }
        return rand;
    }

    average(a, b){
        return (a+b)/2;
    }
}

const player_elem = document.getElementById("player");
const game_cont_elem = document.querySelector(".game-area");
const start_btn = document.getElementById("start-btn");
const reload_btn = document.getElementById("reload-btn");
const bullet_elem = document.getElementById("bullet");
create_invaders();
start_btn.addEventListener("click", start_game);
reload_btn.addEventListener("click", reload_page);

function start_game(){
    document.addEventListener("keydown", player_action);
    invdr_tmr = setInterval(move_invaders, 1000);    //1500
    start_btn.removeEventListener("click", start_game);
}

function reload_page(){
    location.reload();
}

function end_game(){
    clearInterval(invdr_tmr);
    document.removeEventListener("keydown", player_action);
}

function drop_bombs(){
    bomb_0 = new Bomb(0);
    bomb_0_en_route = 1;
    bomb_1 = new Bomb(1);
    bomb_1_en_route = 1;
}

function move_invaders(){
    for(let i=0; i<50; ++i){
        if(!invaders[i].dead){
            invaders[i].move();
        }
    }
    if(bomb_0_en_route === 0 && bomb_1_en_route === 0){
        drop_bombs();
    }
}

function create_invaders(){
    let alien_num = 0;
    let bottom = 80;
    for(let i=0; i<5; ++i){
        for(let j=0; j<10; ++j){
            invaders[alien_num] = new Invaders(i, alien_num, 5*j+5, bottom-i*10); //typ, num, loc_x, loc_y, name
            alien_num++;
        }
    }
}

function player_action(event){
    const key = event.key;
    if(key === "ArrowLeft" && player_obj.left >= 5){
        player_obj.left = player_obj.left - 5;
    }
    else if(key === "ArrowRight" && player_obj.left <= 90){
        player_obj.left = player_obj.left + 5;
    }
    else if(key === " "){
        bullet_obj.shoot(player_obj.left, player_obj.right);
    }
    player_obj.right = player_obj.left + 5;
    player_elem.style.left = `${player_obj.left}%`;
}

function game_reset(){
    player_obj.left = 50;
    player_obj.right = player_obj.left + 5;
    player_elem.style.left = `${player_obj.left}%`;
    bomb_0.col_det = 1;
    bomb_1.col_det = 1;
    life_element = document.getElementById(`life-${lives}`);
    life_element.style.visibility = "hidden";
    lives--;
    if(lives === 0){
        console.log("Game Over. You Lose. The Enemy destroyed your Laser");
        end_game();
    }
}