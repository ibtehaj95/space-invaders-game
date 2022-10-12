let invdr_tmr = 0;
let all_invdrs_dead = 0;
let all_shields_intact = 1;

const player_obj = {
    left: 50,
    right: 55
};

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
            this.bullet_tmr = setInterval(this.move.bind(this), 10);
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
        if(this.corr_y > 98){
            this.col_det = 1;
            bullet_strayed = 1;
        }

        else if(this.corr_y > 5 && this.corr_y < 20 && all_shields_intact){
            if(this.corr_x >= 16 && this.corr_x < 21){
                this.col_det = 1;
                shield_hit = 1;
            }
            else if(this.corr_x >= 37 && this.corr_x < 42){
                this.col_det = 1;
                shield_hit = 1;
            }
            else if(this.corr_x >= 58 && this.corr_x < 63){
                this.col_det = 1;
                shield_hit = 1;
            }
            else if(this.corr_x >= 79 && this.corr_x < 84){
                this.col_det = 1;
                shield_hit = 1;
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
                    }
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
                    let adj_inv_found = 0;
                    let adj_inv = killed_id;
                    let loop_passes = 0;
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
                    }
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
            console.log("Game Over");
            end_game();
        }
    }
}

const player_elem = document.getElementById("player");
const game_cont_elem = document.querySelector(".game-area");
const start_btn = document.getElementById("start-btn");
const reload_btn = document.getElementById("reload-btn");
const bullet_elem = document.getElementById("bullet");
// const shields_elems = document.querySelectorAll(".shield");
// shields = [
//     {
//         left:shields_elems[0].getBoundingClientRect.left,
//         right:shields_elems[0].getBoundingClientRect.right,
//         top:shields_elems[0].getBoundingClientRect.top,
//         down:shields_elems[0].getBoundingClientRect.down
//     },
//     {
//         left:shields_elems[1].getBoundingClientRect.left,
//         right:shields_elems[1].getBoundingClientRect.right,
//         top:shields_elems[1].getBoundingClientRect.top,
//         down:shields_elems[1].getBoundingClientRect.down
//     },
//     {
//         left:shields_elems[2].getBoundingClientRect.left,
//         right:shields_elems[2].getBoundingClientRect.right,
//         top:shields_elems[2].getBoundingClientRect.top,
//         down:shields_elems[2].getBoundingClientRect.down
//     },
//     {
//         left:shields_elems[3].getBoundingClientRect.left,
//         right:shields_elems[3].getBoundingClientRect.right,
//         top:shields_elems[3].getBoundingClientRect.top,
//         down:shields_elems[3].getBoundingClientRect.down
//     }
// ];
// get_player_corrs();
// get_game_cont_corrs();
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

function move_invaders(){
    for(let i=0; i<50; ++i){
        if(!invaders[i].dead){
            invaders[i].move();
        }
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

function get_player_corrs(){
    const player_corrs = player_elem.getBoundingClientRect();
    player_obj.left = player_corrs.left;
    player_obj.right = player_corrs.right;
}

function get_game_cont_corrs(){
    const cont_corrs = game_cont_elem.getBoundingClientRect();
    game_area.left = cont_corrs.left;
    game_area.right = cont_corrs.right;
    game_area.top = cont_corrs.top;
    game_area.bottom = cont_corrs.bottom;
}