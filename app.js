let invdr_tmr = 0;

const player_obj = {
    left: 50,
    right: 55
};

const bullet_obj = {
    corr_y: 2,
    corr_x: 52,
    visibility: "hidden",
    en_route: 0,
    bullet_tmr: 0,
    shoot: function(left_x, right_x){
        if(!this.en_route){
            this.corr_x = Math.floor((left_x + right_x)/2);
            this.en_route = 1;
            bullet_tmr = setInterval(this.move.bind(this), 50); 
        }
    },
    move: function(){
        this.corr_y = this.corr_y + 2;
        this.visibility = "visible";
        this.chk_collision();
    },
    chk_collision: function(){
        if(this.corr_y > 98)
        {
            this.visibility = "hidden";
            this.corr_x = 0;
            this.corr_y = 2;
            this.en_route = 0;
            clearInterval(bullet_tmr);
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

const invaders = {};

class Invaders {
    type = "";
    number = 0;
    corr_x = 0;
    corr_x_lim_r = 0;
    corr_x_lim_l = 0;
    corr_y = 0;
    corr_y_lim = 0;
    dead = 0; //0 is dead, 1 is alive
    moving = "right";
    go_down = 0;
    element;

    constructor(typ, num, loc_x, loc_y){
        this.type = typ;
        this.number = num;
        this.corr_x = loc_x;
        this.corr_y = loc_y;
        this.display_new_invaders();
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
        this.corr_x_lim_l = this.corr_x - 5;
        this.corr_y_lim = this.corr_y - 30;
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
            else{
                console.log("Game Over");
                end_game();
            }
        }
        this.element.style.left = `${this.corr_x}%`;
        this.element.style.bottom = `${this.corr_y}%`;
    }
}

const player_elem = document.getElementById("player");
const game_cont_elem = document.querySelector(".game-area");
const start_btn = document.getElementById("start-btn");
const reload_btn = document.getElementById("reload-btn");
const bullet_elem = document.getElementById("bullet");
// get_player_corrs();
// get_game_cont_corrs();
create_invaders();
start_btn.addEventListener("click", start_game);
reload_btn.addEventListener("click", reload_page);

function start_game(){
    document.addEventListener("keydown", player_action);
    invdr_tmr = setInterval(move_invaders, 1500);
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
        invaders[i].move();
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