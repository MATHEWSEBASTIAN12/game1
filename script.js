let gameArea = document.getElementById("gameArea");
let player = document.getElementById("player");

let scoreDisplay = document.getElementById("score");
let livesDisplay = document.getElementById("lives");
let highScoreDisplay = document.getElementById("highScore");

let playerX = 140;
let score = 0;
let lives = 3;
let speed = 2;
let gameRunning = false;
let rapidFire = false;

let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = highScore;

document.addEventListener("keydown", controls);

function controls(e) {
    if (!gameRunning) return;

    if (e.key === "ArrowLeft" && playerX > 0) {
        playerX -= 20;
    }
    if (e.key === "ArrowRight" && playerX < 280) {
        playerX += 20;
    }
    if (e.key === " ") {
        shoot();
    }

    player.style.left = playerX + "px";
}

function shoot() {
    let bullet = document.createElement("div");
    bullet.classList.add("bullet");

    let bulletY = 400;
    bullet.style.left = (playerX + 17) + "px";
    bullet.style.top = bulletY + "px";

    gameArea.appendChild(bullet);

    let move = setInterval(() => {
        if (!gameRunning) {
            clearInterval(move);
            bullet.remove();
            return;
        }

        bulletY -= 8;
        bullet.style.top = bulletY + "px";

        let enemies = document.querySelectorAll(".enemy");

        enemies.forEach(enemy => {
            let ex = enemy.offsetLeft;
            let ey = enemy.offsetTop;

            if (
                bulletY < ey + 40 &&
                bulletY > ey &&
                playerX + 20 > ex &&
                playerX < ex + 40
            ) {
                enemy.remove();
                bullet.remove();
                score++;
                scoreDisplay.innerText = score;
            }
        });

        if (bulletY < 0) {
            bullet.remove();
            clearInterval(move);
        }
    }, 20);
}

function spawnEnemy() {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");

    let x = Math.random() * 280;
    enemy.style.left = x + "px";

    gameArea.appendChild(enemy);

    let y = 0;

    let fall = setInterval(() => {
        if (!gameRunning) {
            clearInterval(fall);
            enemy.remove();
            return;
        }

        y += speed;
        enemy.style.top = y + "px";

        // Collision with player
        if (
            y > 380 &&
            x < playerX + 40 &&
            x + 40 > playerX
        ) {
            enemy.remove();
            lives--;
            livesDisplay.innerText = lives;

            if (lives <= 0) endGame();
        }

        if (y > 450) {
            enemy.remove();
            clearInterval(fall);
        }
    }, 20);
}

function spawnPowerUp() {
    let power = document.createElement("div");
    power.classList.add("powerup");

    let x = Math.random() * 280;
    power.style.left = x + "px";

    gameArea.appendChild(power);

    let y = 0;

    let drop = setInterval(() => {
        if (!gameRunning) {
            clearInterval(drop);
            power.remove();
            return;
        }

        y += 2;
        power.style.top = y + "px";

        if (
            y > 380 &&
            x < playerX + 40 &&
            x + 25 > playerX
        ) {
            power.remove();
            rapidFire = true;

            setTimeout(() => rapidFire = false, 5000);
        }

        if (y > 450) {
            power.remove();
            clearInterval(drop);
        }
    }, 20);
}

function startGame() {
    if (gameRunning) return;

    gameRunning = true;
    score = 0;
    lives = 3;
    speed = 2;

    scoreDisplay.innerText = score;
    livesDisplay.innerText = lives;

    document.querySelectorAll(".enemy, .bullet, .powerup").forEach(e => e.remove());

    setInterval(() => {
        if (gameRunning) spawnEnemy();
    }, 1000);

    setInterval(() => {
        if (gameRunning && Math.random() < 0.3) spawnPowerUp();
    }, 3000);

    setInterval(() => {
        if (gameRunning && rapidFire) shoot();
    }, 200);
}

function endGame() {
    gameRunning = false;

    if (score > highScore) {
        localStorage.setItem("highScore", score);
        highScoreDisplay.innerText = score;
    }

    alert("Game Over! Score: " + score);
}
