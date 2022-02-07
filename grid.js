var squares;
num_squares = 32;
grid_active_fill = "#55CCD0";
grid_inactive_fill = "#474747";

class grid
{
    constructor(canvas, size, active_color, inactive_color)
    {
        this.canvas = canvas;
        this.size = size;
        this.active_color = active_color;
        this.inactive_color = inactive_color;
        this.stroke = false;
        this.dim = [this.canvas.int(this.canvas.width/this.size), this.canvas.int(this.canvas.height/this.size)];
        this.canvas.resizeCanvas(this.dim[0] * this.size, this.canvas.height, false);

        this.pixels = [];

        for(let x = 0; x < this.dim[0]; x++)
        {
            this.pixels.push([]);
            for(let y = 0; y < this.dim[1]; y++)
            {
                this.pixels[x].push(this.inactive_color);
            }
        }
    }

    draw()
    {
        this.canvas.push();

        if(!this.stroke) this.canvas.noStroke();
        
        for(let x = 0; x < this.dim[0]; x++)
        {
            for(let y = 0; y < this.dim[1]; y++)
            {
                this.canvas.fill(this.pixels[x][y]);
                this.canvas.square(x * this.size, y * this.size, this.size);
            }
        }

        this.canvas.pop();
    }

    clear()
    {
        for(let x = 0; x < this.dim[0]; x++)
        {
            for(let y = 0; y < this.dim[1]; y++)
            {
                this.pixels[x][y] = this.inactive_color;
            }
        }
        this.canvas.redraw();
    }
}

var grid_p5 = function (p)
{
    p.setup = function()
    {
        p.createCanvas(p.windowWidth * (3/4), p.windowHeight);
        p.background(0);
        p.noLoop();
        grid_active_fill = p.color(grid_active_fill);
        grid_inactive_fill = p.color(grid_inactive_fill);

        squares = new grid(
            p,
            p.height/num_squares,
            grid_active_fill,
            grid_inactive_fill
        );

        squares.stroke = true;
    }
}

var grid_canvas = new p5(grid_p5, "grid")
