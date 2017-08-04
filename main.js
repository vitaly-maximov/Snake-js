let canvasElement = document.getElementById("canvas");
let canvasContext = canvasElement.getContext("2d");

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

let drawField = (field) => {	
	const offset = 10;

	const blockSize = 30;
	const blockMargin = 3;
	const borderWidth = 1;

	width = field.width * (blockSize + 2 * blockMargin) + 2 * borderWidth;
	height = field.height * (blockSize + 2 * blockMargin) + 2 * borderWidth;

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

let draw = () => {
	drawField(new Field(10, 15));
}

window.onload = () => {	
	doLayout();
	draw();
}

window.onresize = () => {
	doLayout();
	draw();
}