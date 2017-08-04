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

	constructor(head)
	{
		// TODO: assert

		this._body = [head];
	}

	// TODO:
	get body()
	{
		return this._body;
	}

	// TODO:
	increase()
	{
		let head = this._body[this._body.length - 1];

		this._body[this._body.length] = {
			x: head.x,
			y: head.y + 1
		}
	}	

	moveTo(direction)
	{		
		let head = this._body[this._body.length - 1];
		this._body.shift();
		switch (direction)
		{
			case Direction.up: this._body.push({ x: head.x, y: head.y - 1 }); break;
			case Direction.down: this._body.push({ x: head.x, y: head.y + 1 }); break;
			case Direction.left: this._body.push({ x: head.x - 1, y: head.y }); break;
			case Direction.right: this._body.push({ x: head.x + 1, y: head.y }); break;
		}
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

	isWall(row, column) {
		return this._cells[row][column];
	}
}

let drawSnake = (snake) => {
	const offset = 10;

	const blockSize = 30;
	const blockMargin = 3;
	const borderWidth = 1;

	for (let part of snake.body)
	{
		canvasContext.fillStyle = "#00FF00";

		canvasContext.fillRect(
					offset + part.x * (blockSize + 2 * blockMargin) + blockMargin + borderWidth,
					offset + part.y * (blockSize + 2 * blockMargin) + blockMargin + borderWidth,
					blockSize,
					blockSize);
	}
}

let drawField = (field) => {	
	const offset = 10;

	const blockSize = 30;
	const blockMargin = 3;
	const borderWidth = 1;

	width = field.width * (blockSize + 2 * blockMargin) + 2 * borderWidth;
	height = field.height * (blockSize + 2 * blockMargin) + 2 * borderWidth;

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

let doLayout = () => {	
	const offset = 20;

	canvasElement.width = window.innerWidth - offset;
	canvasElement.height = window.innerHeight - offset;
}

let snake = new Snake({ x: 5, y: 5 }, Direction.up);
	snake.increase();
	snake.increase();
	snake.increase();	

let draw = () => {
	canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
	drawField(new Field(10, 15));
	
	drawSnake(snake);
}

window.onload = () => {	
	doLayout();
	draw();
}

window.onresize = () => {
	doLayout();
	draw();
}

var globalDirection = Direction.up;

window.addEventListener('keydown', args => {
	switch (args.keyCode)
	{
		case 37: globalDirection = Direction.left; break;
		case 38: globalDirection = Direction.up; break;
		case 39: globalDirection = Direction.right; break;
		case 40: globalDirection = Direction.down; break;
	}
});

setInterval(() => { 
	snake.moveTo(globalDirection);
	draw(); 
}, 1000)