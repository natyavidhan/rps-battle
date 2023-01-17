let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let base = [[(width/3)/2, (height/3)/2], [(2*width/3)+(width/3)/2, (height/3)/2], [width/2, 2*height/3+(height/3)/2]];
let positions = [];
let start = false;

function loadImage(url) {
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}
let r = new Image();
r.src = "images/r.png";
let p = new Image();
p.src = "images/p.png";
let s = new Image();
s.src = "images/s.png";
let imgs = [r, p, s];

class Piece {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.img = imgs[type]; 
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, 20, 20);
    }
}

for (let i = 0; i < 3; i++) {
    let x = base[i][0]
    let y = base[i][1]
    for (let j = 0; j < 75; j++) {
        let ox, oy;
        if (Math.random() < 0.5) {
            ox = x + (Math.random() * 20)
            oy = y + (Math.random() * 20)
        } else {
            ox = x - (Math.random() * 20)
            oy = y - (Math.random() * 20)
        }
        positions.push(new Piece(ox, oy, i));
    }

}


function checkCollision(p1, p2) {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 20) {
        return true;
    }
    return false;
}

function checkWinner() {
    let r = 0;
    let p = 0;
    let s = 0;
    for (let i = 0; i < positions.length; i++) {
        let p_ = positions[i];
        if (p_.type == 0) {r++;} 
        else if (p_.type == 1) {p++;} 
        else if (p_.type == 2) {s++;}
    }
    if (r == 0 && p == 0) {return "Scissors";}
    else if (p == 0 && s == 0) {return "Rock";}
    else if (s == 0 && r == 0) {return "Paper";}
    return null;
}
document.addEventListener('click', function(e){
    if (checkWinner() == null) {
        start = true;
    } else {
        window.location.reload();
    }
});

function update(){
    ctx.clearRect(0, 0, width, height);
    if (!start) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Click to start", width/2 - 100, height/2);
    } else {
        let winner = checkWinner();
        if (winner != null) {
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText(winner + " wins!", width/2 - 100, height/2);
            ctx.fillText("Click to restart", width/2 - 100, height/2 + 50);
        } else {
            for (let i = 0; i < positions.length; i++) {
                let p = positions[i];
                p.x += (Math.random() - 0.5) * 10
                p.y += (Math.random() - 0.5) * 10
                if (p.x < 0) {
                    p.x = 0;
                } else if (p.x > width) {
                    p.x = width;
                }
                if (p.y < 0) {
                    p.y = 0;
                } else if (p.y > height) {
                    p.y = height;
                }
                ctx.fillStyle = p.color;
                p.draw();
                for (let j = 0; j < positions.length; j++) {
                    if (i != j) {
                        let p2 = positions[j];
                        if (checkCollision(p, p2)) {
                            if (p.type == 0 && p2.type == 1) {
                                p.type = 1;
                            } else if (p.type == 1 && p2.type == 2) {
                                p.type = 2;
                            } else if (p.type == 2 && p2.type == 0) {
                                p.type = 0;
                            }
                            p.img = imgs[p.type];
                        }
                    }
                }
            }
        }
    }
    requestAnimationFrame(update);
}

update();