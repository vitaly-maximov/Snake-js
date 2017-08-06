//"use strict";

let canvasElement = document.getElementById("canvas");
let canvasContext = canvasElement.getContext("2d");

/*---------------------------------------------------------------------------*/
class Direction {

	static get left() { return "left"; }

	static get right() { return "right"; }

	static get up() { return "up"; }

	static get down() { return "down"; }
}
/*---------------------------------------------------------------------------*/
class Snake {

	constructor(head, direction)
	{
		// TODO: assert

		this._body = [head];
        this._direction = direction;

        this._isDead = false;
	}

    get head() { return this._body[this._body.length - 1]; }
    
	get body() { return this._body; }

    get tail() 
    {
        let that = this;
        return function* ()
        {
            for (let i = 0; i < that._body.length - 1; ++i)
            {
                yield that._body[i];
            }
        }();
    }

    get direction() { return this._direction; }

    set direction(value) {
        // TODO: assert

        this._direction = value;
    }

    get isDead() { return this._isDead; }

    die() { this._isDead = true; }

	// TODO:
	increase()
	{
        this._body.push(this._next());
	}	

	move()
	{		
		let head = this._body[this._body.length - 1];
		this.increase();
        this._body.shift();		
	}

    _next()
    {
        switch (this.direction)
        {
            case Direction.up: return { x: this.head.x, y: this.head.y - 1 };
            case Direction.down: return { x: this.head.x, y: this.head.y + 1 };
            case Direction.left: return { x: this.head.x - 1, y: this.head.y };
            case Direction.right: return { x: this.head.x + 1, y: this.head.y };
        }
        throw "wrong direction"; // TODO:
    }
}
/*---------------------------------------------------------------------------*/
class Field {

	constructor(width, height)
	{
		// TODO: assert

		this._width = width;
		this._height = height;

		this._cells = [];
		for (let row = 0; row < this._height; ++row)
		{	
			this._cells[row] = [];
			for (let column = 0; column < this._width; ++column)
			{
				let isBorder = (row == 0) || (row == this._height - 1) || (column == 0) || (column == this._width - 1);
				this._cells[row][column] = isBorder;
			}
		}
	}

	get width() { return this._width; }

	get height() { return this._height; }

    get copy()
    {
        let c = this._cells.slice();
        for (let row = 0; row < this._height; ++row)
        {
            c[row] = c[row].slice();
        }
        return c;
    }

	isWall(row, column) 
    {
		return this._cells[row][column];
	}
}
/*---------------------------------------------------------------------------*/
class Unit {
    constructor(x, y)
    {
        this._x = x;
        this._y = y;
    }

    get x() { return this._x; }

    get y() { return this._y; }
}
/*---------------------------------------------------------------------------*/
class Game {
    constructor() 
    {
        this._field = new Field(13, 17);
        this._snake = new Snake({ x: 7, y: 9 }, Direction.up);
        this._units = [];

        this._time = 0;        
    }

    get field() { return this._field; }

    get snake() { return this._snake; }

    get units() { return this._units; }

    process()
    {
        if (this.snake.isDead)
        {
            return;
        }

        this._time += 1;

        if (this._time % 10 === 0)
        {
            let that = this;
            let freeCells = [... function* () {
                let field = that._field.copy;
                for (let unit of that._snake.body)
                {
                    field[unit.y][unit.x] = true;
                }

                for (let x = 0; x < that._field.width; ++x)
                {
                    for (let y = 0; y < that._field.height; ++y)
                    {
                        if (!field[y][x])
                        {
                            yield { x: x, y: y};
                        }
                    }
                }
            }()];

            let a = Math.floor(freeCells.length * Math.random());

            let cell = freeCells[a];

            this._units.push(new Unit(cell.x, cell.y));
        }

        //this._snake.move();

        let snakeHead = this.snake._next();
        let inc = false;
        for (let i = 0; i < this.units.length; ++i)
        {            
            
            let unit = this.units[i];

            if ((snakeHead.x === unit.x) && (snakeHead.y === unit.y))
            {
                this.snake.increase();
                this._units.splice(i, 1);
                inc = true;
                break;
            }
        }

        if (this.field.isWall(snakeHead.y, snakeHead.x))
        {
            this.snake.die();
        }

        for (let unit of this.snake.tail)
        {
            if ((snakeHead.x === unit.x) && (snakeHead.y === unit.y))
            {
                this.snake.die();
                break;
            }
        }

        if (!inc)
        {
            this.snake.move();
        }        
    }
}
/*---------------------------------------------------------------------------*/
class Visual {

    constructor(game) 
    {
        this._game = game;
    }

    draw() 
    {
        canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

        this.drawField(this._game.field);
        this.drawSnake(this._game.snake);
        this.drawUnits(this._game.units);
    }

    drawSnake(snake) 
    {
        const offset = 10;

        const blockSize = 30;
        const blockMargin = 3;
        const borderWidth = 1;

        for (let part of snake.body)
        {
            canvasContext.fillStyle = snake.isDead ? "#FF0000" : "#00FF00";

            canvasContext.fillRect(
                        offset + part.x * (blockSize + 2 * blockMargin) + blockMargin + borderWidth,
                        offset + part.y * (blockSize + 2 * blockMargin) + blockMargin + borderWidth,
                        blockSize,
                        blockSize);
        }
    }

    drawField(field) 
    {
        const offset = 10;

        const blockSize = 30;
        const blockMargin = 3;
        const borderWidth = 1;

        let width = field.width * (blockSize + 2 * blockMargin) + 2 * borderWidth;
        let height = field.height * (blockSize + 2 * blockMargin) + 2 * borderWidth;

        canvasContext.fillStyle = "#000000";
        canvasContext.rect(offset, offset, width, height);  

        for (let row = 1; row < field.height; ++row)
        {
            canvasContext.moveTo(offset, offset + row * (blockSize + 2 * blockMargin) + borderWidth);
            canvasContext.lineTo(offset + width, offset + row * (blockSize + 2 * blockMargin) + borderWidth);
        }

        for (let column = 1; column < field.width; ++column)
        {
            canvasContext.moveTo(offset + column * (blockSize + 2 * blockMargin) + borderWidth, offset);
            canvasContext.lineTo(offset + column * (blockSize + 2 * blockMargin) + borderWidth, offset + height)
        }

        for (let row = 0; row < field.height; ++row)
        {
            for (let column = 0; column < field.width; ++column)
            {
                if (field.isWall(row, column))
                {
                    canvasContext.fillRect(
                        offset + column * (blockSize + 2 * blockMargin) + blockMargin + borderWidth,
                        offset + row * (blockSize + 2 * blockMargin) + blockMargin + borderWidth,
                        blockSize,
                        blockSize);
                }   
            }
        }

        canvasContext.stroke(); 
    }

    drawUnits(units)
    {
        const offset = 10;

        const blockSize = 30;
        const blockMargin = 3;
        const borderWidth = 1;

        canvasContext.fillStyle = "#008800";

        for (let unit of units)
        {
            canvasContext.fillRect(
                            offset + unit.x * (blockSize + 2 * blockMargin) + blockMargin + borderWidth,
                            offset + unit.y * (blockSize + 2 * blockMargin) + blockMargin + borderWidth,
                            blockSize,
                            blockSize);
        }
    }
}
/*---------------------------------------------------------------------------*/
let game = new Game();
let visual = new Visual(game);

let doLayout = () => {	
	const offset = 20;

	canvasElement.width = window.innerWidth - offset;
	canvasElement.height = window.innerHeight - offset;
}

window.onload = () => {	
	doLayout();
    visual.draw();
}

window.onresize = () => {
	doLayout();
	visual.draw();
}

window.addEventListener('keydown', args => {
	switch (args.keyCode)
	{
		case 37: game.snake.direction = Direction.left; break;
		case 38: game.snake.direction = Direction.up; break;
		case 39: game.snake.direction = Direction.right; break;
		case 40: game.snake.direction = Direction.down; break;
	}
});

setInterval(() => { 
    game.process();	
	visual.draw();
}, 500)