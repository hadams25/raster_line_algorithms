class button_wrapper
{
    constructor(canvas, position, size, text, on_press)
    {
        this.canvas = canvas;
        this.position = position;
        this.size = size;
        this.text = text;
        this.on_press = on_press;
        let parent_id = this.canvas.canvas.parentElement.id;
        let pos = this.canvas.select("#" + parent_id).position();
        this.offset = [pos.x, pos.y];

        this.button = this.canvas.createButton(this.text);
        this.button.position(this.position[0] + this.offset[0],this.position[1] + this.offset[1]);
        this.button.size(this.size[0], this.size[1]);
        this.button.mouseClicked(this.on_press);
    }
}

class input_wrapper
{
    constructor(canvas, position, size, placeholder_text)
    {
        this.canvas = canvas;
        this.position = position,
        this.size = size;
        this.placeholder_text = placeholder_text;
        let parent_id = this.canvas.canvas.parentElement.id;
        let pos = this.canvas.select("#" + parent_id).position();
        this.offset = [pos.x, pos.y];

        this.field = this.canvas.createInput(this.placeholder_text);
        this.field.position(this.position[0] + this.offset[0],this.position[1] + this.offset[1]);
        this.field.style("box-sizing", "border-box");
        this.field.size(this.size[0], this.size[1]);
    }

    get_value()
    {
        return this.field.value();
    }
}

