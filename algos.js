//------------------------------------------------------------------------------------
//                                   Mode class init
//------------------------------------------------------------------------------------

class state 
{
    canvas;
    //has a first and second click been recorded
    clicked = [false, false];
    //two points to draw a line between
    line = [null, null];
    title = "None";

    constructor(canvas)
    {
        this.canvas = canvas;
        this.title = "None";
    }

    draw_line(from, to)
    {

        this.canvas.push();
        this.canvas.strokeWeight(2);
        this.canvas.fill("tomato");
        this.canvas.stroke("tomato");
        this.canvas.line(from[0], from[1], to[0], to[1]);
        this.canvas.pop();
    }

    draw()
    {
        //draw squares
        squares.draw()
    }

    algo(from,to)
    {
        return;
    }

    mouseMoved(){}
    mouseClicked(){}
}

var cur_state; 
var states;

function change_state()
{
    cur_state = states[state_select.value()];

    grid_canvas.draw = cur_state.draw;
    grid_canvas.mouseClicked = cur_state.mouseClicked;
    grid_canvas.mouseDragged = cur_state.mouseDragged;
    grid_canvas.mousePressed = cur_state.mousePressed;
    grid_canvas.mouseReleased = cur_state.mouseReleased;
    grid_canvas.mouseMoved = cur_state.mouseMoved;
}

function line_clicked(self)
{
    //handle weird bug when switching modes
    if(self.canvas.mouseX == 0 && self.canvas.mouseY == 0) 
    {
        return;
    }

    //get nearest square to mouse
    let x = parseInt(self.canvas.mouseX/squares.size);
    let y = parseInt(self.canvas.mouseY/squares.size);
    //if mouse out of bounds, abort
    if(x > squares.dim[0]-1 || x < 0 || y > squares.dim[1]-1 || y < 0) 
    {
        return;
    }
    //first click
    //set clicked[0] flag, activate nearest square, set first line coordinate pair to mouse coords
    if(!self.clicked[0]) 
    {
        self.clicked[0] = true;
        squares.pixels[x][y] = squares.active_color;
        self.line[0] = [self.canvas.mouseX,self.canvas.mouseY];
    }
    //second click
    //set clicked[1] flag, activate nearest square, set second line coordinate pair to mouse coords
    //then put line draw from this.line[0] to this.line[1] on queue
    //CALL LINE ALGO HERE
    else if(!self.clicked[1])
    {
        self.clicked[1] = true;
        squares.pixels[x][y] = squares.active_color;
        self.line[1] = [self.canvas.mouseX,self.canvas.mouseY];

        self.algo(
                    [self.canvas.int(self.line[0][0]/squares.size), self.canvas.int(self.line[0][1]/squares.size)],
                    [self.canvas.int(self.line[1][0]/squares.size), self.canvas.int(self.line[1][1]/squares.size)]
                );
        self.draw();
        self.draw_line(self.line[0], self.line[1]);
    }
    //both clicks have been registered, wipe and start over
    else if(self.clicked[0] && self.clicked[1])
    {
        self.clicked[1] = false;
        squares.clear();
        self.draw();
        squares.pixels[x][y] = squares.active_color;
        self.line[0] = [self.canvas.mouseX,self.canvas.mouseY];
        self.line[1] = null;
    }
}

function line_moved(self)
{
    //canvas doesnt need to be redrawn if both clicks have been recorded, or if none have been made yet
    if((self.clicked[0] && self.clicked[1]) || (!self.clicked[0] && !self.clicked[1]))
    {
        return;
    }

    //if the first click has been made, but the second hasnt
    if(!self.clicked[1])
    {
        self.draw();
        //draw a line from the first click to the current location of the mouse
        self.draw_line(self.line[0], [self.canvas.mouseX, self.canvas.mouseY]);
    }
}

window.onload = function()
{
    //------------------------------------------------------------------------------------
    //                                   FREE DRAW MODE
    //------------------------------------------------------------------------------------
    free_draw = new state(grid_canvas);
    free_draw.canvas = grid_canvas;
    free_draw.mouseClicked = () =>
    {
        if(free_draw.canvas.mouseX == 0 && free_draw.canvas.mouseY == 0) return;
        let x = free_draw.canvas.int(free_draw.canvas.mouseX/squares.size);
        let y = free_draw.canvas.int(free_draw.canvas.mouseY/squares.size);
        if(x > squares.dim[0]-1 || x < 0 || y > squares.dim[1]-1 || y < 0) return;
        squares.pixels[x][y] = squares.active_color;
        free_draw.canvas.redraw();
    };
    free_draw.mouseDragged = free_draw.mouseClicked;
    free_draw.mouseMoved = () => {};    
    free_draw.draw = () =>
    {
        squares.draw();
    };
    free_draw.title = "draw";

    //------------------------------------------------------------------------------------
    //                               DDA LINE DRAWING MODE
    //------------------------------------------------------------------------------------
    dda = new state(grid_canvas);

    dda.mouseClicked = () =>
    {
        line_clicked(dda);
    }

    dda.mouseMoved = () =>
    {
        line_moved(dda);
    }

    //implement the DDA line drawing algorithm
    dda.algo = (from,to) =>
    {
        let plot = []
        let dx = to[0] - from[0];
        let dy = to[1] - from[1];
        // dy/dx

        let steps = 0;
        if(Math.abs(dx) > Math.abs(dy)) steps = Math.abs(dx);
        else steps = Math.abs(dy);

        let x_inc = dx / steps;
        let y_inc = dy / steps;

        let x = from[0];
        let y = from[1];

        for(let i = 0; i <= steps; i++)
        {
            plot.push([Math.round(x), Math.round(y)]);
            x += x_inc;
            y += y_inc;
        }
        
        for(let i = 0; i < plot.length; i++)
        {
            squares.pixels[plot[i][0]][plot[i][1]] = squares.active_color;
        }
        console.log(plot);
        return;
    };
    dda.title = "dda";

    //------------------------------------------------------------------------------------
    //                               BRESENHAM LINE DRAWING MODE
    //------------------------------------------------------------------------------------
    var brensenham = new state(grid_canvas);

    brensenham.mouseClicked = () =>
    {
        line_clicked(brensenham);
    }

    brensenham.mouseMoved = () =>
    {
        line_moved(brensenham);
    }

    //implement the brensenham line drawing algorithm
    brensenham.algo = (from,to) =>
    {
        let plot = []
        let dx = to[0] - from[0];
        let dy = to[1] - from[1];

        let steps = 0;
        if(Math.abs(dx) > Math.abs(dy)) steps = Math.abs(dx);
        else steps = Math.abs(dy);

        let x_inc = dx / steps;
        let y_inc = dy / steps;

        let x = from[0];
        let y = from[1];

        for(let i = 0; i <= steps; i++)
        {
            plot.push([Math.round(x), Math.round(y)]);
            x += x_inc;
            y += y_inc;
        }
        
        for(let i = 0; i < plot.length; i++)
        {
            squares.pixels[plot[i][0]][plot[i][1]] = squares.active_color;
        }
        console.log(plot);
        return;
    };
    brensenham.title = "brensenham";

    states = [free_draw, dda, brensenham];

    //set default state at start to free draw
    change_state();
    cur_state.draw();

};