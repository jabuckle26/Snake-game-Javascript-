item = document.querySelector('.item');

const initialiseGame = (character) => {
    console.log(character);
    let enemyPic = document.querySelector('.enemy');
    switch (character) {
        case "O-Ren":
            timeFrame = 500;
            item.style.backgroundColor = "red";
            enemyPic.style.backgroundImage="url('./img/lucy-lui.jpg')";
            break
        case "Vernita":
            timeFrame = 250;
            item.style.backgroundColor = "blue";
            enemyPic.style.backgroundImage="url('./img/vernita-green.jpg')";
            break
        case "Budd":
            timeFrame = 100;
            item.style.backgroundColor = "green";
            enemyPic.style.backgroundImage="url('./img/Budd.jpg')";
            break
        case "Elle":
            timeFrame = 25;
            item.style.backgroundColor = "white";
            enemyPic.style.backgroundImage="url('./img/elle-driver.jpg)";
            break
        case "Bill":
            timeFrame = 10;
            item.style.backgroundColor = "grey";
            enemyPic.style.backgroundImage="url('./img/bill.jpg')";
            break
    }

    document.querySelector('.intro-screen1').style.display = "none";
    document.querySelector('.game-screen').style.display = 'flex';
    snake = createInitialSnakeHead();
    mainGame(snake);
    //document.removeEventListener("keyup", initialiseGame);
    // }
    document.removeEventListener("keyup", initialiseGame);
    document.addEventListener("keyup", directionShift);
}

const mainGame = (snakeElement) => {

    //Variables
    score = 0
    dx = 10
    dy = 0;
    createItem = true;
    //timeFrame = 100;
    //Generate an object for our snake, start at one piece
    //NO MORE REFERENCE TO SNAKE AFTER HERE - ONLY SNAKE OBJECT
    snakeObject = [];
    snakeObject.push(growSnake(snakeElement.style.left, snakeElement.style.top));

    //Initialise main game loop - breaks upon death
    setInterval(gameLoop, timeFrame);
}

const refreshSnake = () => {
    purgeSnakes()
    newHeadLocs = moveSnakeHead(snakeObject[0][0], snakeObject[0][1]);
    snakeObject.unshift(newHeadLocs);
    snakeObject.forEach(drawSnake);
}

const gameLoop = () => {
    //console.log(snakeObject);
    const eating = itemCatch(snakeObject[0][0], snakeObject[0][1]);
    //Move snake, check items and boundaries
    const crashed = collisionCheck(snakeObject[0][0], snakeObject[0][1]);
    if (crashed) return gameReset();

    if (eating) {
        genItem();
    } else if (snakeObject.length !== 1) {
        snakeObject.pop();
    } else {
        genItem();
    }
    refreshSnake();
}

const moveSnakeHead = (currentSnakeX, currentSnakeY) => {
    newSnakeX = parsePixels(currentSnakeX) + dx + 'px';
    newSnakeY = parsePixels(currentSnakeY) + dy + 'px';
    return [newSnakeX, newSnakeY]
}

const directionShift = (ev) => {
    let direction = ev.code;
    //console.log(direction);
    switch (direction) {
        case "ArrowRight":
            if (dx === 0) {
                dx = 10;
                dy = 0
            }
            break
        case "ArrowLeft":
            if (dx === 0) {
                dx = -10
                dy = 0
            }
            break
        case "ArrowDown":
            if (dy === 0) {
                dx = 0;
                dy = 10;
            }
            break
        case "ArrowUp":
            if (dy === 0) {
                dx = 0;
                dy = -10;
            }
            break
    }
}

const gameReset = () => {
    console.log('reset');
    purgeSnakes()
    dy = 0;
    dx = 10;
    snakeObject = ['10px', '10px'];
    score = 0;
    document.querySelector('.score').textContent = `Score: ${score}`
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const genItem = () => {
    console.log(item);
    item.style.display = "inline-block";
    //set to a random point on the grid (of even co-ords)
    item.style.top = Math.ceil((getRandomInt(0, 490) + 1) / 10) * 10 + 'px';
    item.style.left = Math.ceil((getRandomInt(0, 490) + 1) / 10) * 10 + 'px';
    console.log(item);
    return false;
}

const itemCatch = (locX, locY) => {
    itemX = parsePixels(item.style.left);
    itemY = parsePixels(item.style.top);

    snakeX = parsePixels(locX);
    snakeY = parsePixels(locY)

    if (snakeX == itemX && snakeY == itemY) {
        item.style.display = "none";
        score++
        console.log('CATCH');
        document.querySelector('.score').textContent = `Score: ${score}`
        snakeObject.push(growSnake(snakeX + 'px', snakeY + 'px'));
        console.log(snakeObject, 'IN CATCH');
        return true
    } else {
        return false
    }

}

const parsePixels = (pxlString) => {
    return (Number(pxlString.slice(0, -2)));
}

const createInitialSnakeHead = () => {
    console.log('in function');
    head = document.createElement('div');
    head.classList.add('snake');
    head.style.width = "10px";
    head.style.height = "10px";
    head.style.top = "10px";
    head.style.left = "60px";
    snakeHolder = document.querySelector('.test-grid')
    snakeHolder.insertBefore(head, snakeHolder.childNodes[0]);
    return head;
}

const collisionCheck = (locX, locY) => {
    snakeX = parsePixels(locX);
    snakeY = parsePixels(locY);
    if (snakeX < 0 || snakeY < 0 || snakeX > 480 || snakeY > 480) {
        console.log('CRASH')
        return true
    } else if ((snakeObject.lenght > 2) && (snakeObject.includes([loxX, locY]))) {
        console.log('SELF EATING NOT ALLOWED');
        return true
    } else { return false }
}

const growSnake = (X, Y) => {
    segment = [X, Y]
    return segment;
}

const drawSnake = (locations) => {


    const seg = document.createElement('div');
    seg.classList.add('snake');
    seg.style.width = "10px";
    seg.style.height = "10px";
    seg.style.left = locations[0];
    seg.style.top = locations[1];

    const snakeHolder = document.querySelector('.test-grid')
    snakeHolder.appendChild(seg)
}

const purgeSnakes = () => {
    const badSnakes = document.querySelectorAll('.snake');
    [...badSnakes].forEach((snake) => {
        snake.remove();
    })
}

//Watch out for when to initilise game
// document.addEventListener("keyup", initialiseGame);


const getCharacterSelector = () => {
    for (character of characterLevels) {
        character.addEventListener("click", () => {
            let clickedValue = event.target.id;
            initialiseGame(clickedValue);
        })
    };
}

const hideTitle = () => {
    let titleScreen = document.querySelector('.title-screen');
    titleScreen.style.display = "none";

    let choiceScreen = document.querySelector('.intro-screen');
    choiceScreen.style.display = "flex"
}

const characterLevels = document.getElementsByTagName("img");

const chosenCharacter = getCharacterSelector();