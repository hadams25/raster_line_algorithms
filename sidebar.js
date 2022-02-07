var sidebar_p5 = function (p)
{
    p.setup = function()
    {
        let parent = document.querySelector("#sidebar");
        let width = parent.offsetWidth;
        let height = parent.offsetHeight;
        p.createCanvas(width, height);
        p.background(p.color("#3E515F"));
        p.noLoop();
        
        init_sidebar_buttons(p, width, height);
    }
}
var sidebar_canvas = new p5(sidebar_p5, "sidebar")

var inactive_fill_input, set_inactive_fill;
var active_fill_input, set_active_fill; 
var clear_grid, state_select;

function init_sidebar_buttons(p, width, height)
{
    //set inactive color input field and button
    inactive_fill_input = new input_wrapper(
        p,
        [0,0],
        [width * (2/3), height * (1/32)],
        "#474747"
    );

    set_inactive_fill = new button_wrapper(
        p,
        [width * (2/3),0],
        [width * (1/3), height * (1/32)],
        "Set Inactive Fill",
        function()
        {
            squares.inactive_color = p.color(inactive_fill_input.get_value());
            squares.clear();
        }
    );

    //set active color input field and button
    //set inactive color input field and button
    active_fill_input = new input_wrapper(
        p,
        [0,height * (1/32)],
        [width * (2/3), height * (1/32)],
        "#55CCD0"
    );

    set_active_fill = new button_wrapper(
        p,
        [width * (2/3), height * (1/32)],
        [width * (1/3), height * (1/32)],
        "Set Active Fill",
        function()
        {
            squares.active_color = p.color(active_fill_input.get_value());
        }
    );

    //clear/reset grid button
    clear_grid = new button_wrapper(
        p,
        [0,height * (15/16)],
        [width, height * (1/16)],
        "Clear Grid",
        function()
        {
            squares.clear();
            p.redraw();
        }
    );

    //state select and label
    p.push();

    p.fill("black");
    state_select = p.createSelect();
    state_select.option("Free Draw", 0);
    state_select.option("DDA Drawing", 1);
    state_select.option("Bresenham's Algo.", 2);
    state_select.changed(change_state);
    state_select.style("box-sizing", "border-box");

    let parent_id = p.canvas.parentElement.id;
    let pos = p.select("#" + parent_id).position();
    let offset = [pos.x, pos.y];

    state_select.position(offset[0] + (width * (1/3)),offset[1] + (height * (1/16)));
    state_select.size(width * (2/3), height * (1/32))

    // p.text("Mode Select:", offset[0], offset[1] + (height * (1/16)));
    p.textAlign(p.CENTER,p.CENTER);
    p.textSize(height/48)
    p.text("Mode Select:", width * (.5/3), height * (1.25/16));

    p.pop();
}