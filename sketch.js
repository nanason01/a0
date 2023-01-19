//
// This is my annoying clock.
//
// The x position represents the seconds,
// the y position the minutes (moving up each minute),
// and the number of sprinkles is the hour.
// The background color changes two times per second,
// the cat oscillates once per second,
// and I couldn't decide whether I liked the guidelines or not,
// so you can click to enable minute indicators
//
// Author: Nicholas Anason (nda2125@columbia.edu)
//

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    } 
}

// cat color palette
const pink = new Color(255, 153, 255);
const red = new Color(255, 24, 0);
const orange = new Color(255, 154, 0);
const yellow = new Color(255, 239, 0);
const green = new Color(33, 221, 0);
const blue = new Color(0, 140, 255);
const purple = new Color(105, 66, 255);
const magenta = new Color(250, 56, 140);

// background color palette
background_colors = [
    new Color(255, 197, 157),  // orange
    new Color(151, 219, 242),  // blue
    new Color(202, 223, 242),  // light blue
    new Color(255, 211, 212),  // pink
    new Color(240, 189, 255),  // light purple
    new Color(202, 238, 224),  // green
];

class Sprinkle {
    #pallette = [red, yellow, green, blue, purple, magenta];

    // make sprinkles easier to place
    // justify from top left of poptart region
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // pick random color each time
        this.color = this.#pallette[Math.floor(Math.random() * this.#pallette.length)];
    }

    draw(x, y) {
        fill(this.color.r, this.color.g, this.color.b);
        rect(x + 135 + this.x, y + 10 + this.y, 5, 5);
    }
}

class Cat {
    #img;
    #img_name = 'nyan_cat3.png';
    // the cat is 51x20 "pixels" (scale by 5)
    #img_x_len = 255;
    #img_y_len = 100;

    // this makes it such that the top left possible is 0, 0
    // and the bottom right possible is 800, 500
    #x_offset = -95;
    #y_offset = 0;

    // hardcoding is a lot easier than bounds-checking on the poptart region
    #sprinkle_locations = [
        {x: 15, y: 40},
        {x: 25, y: 25},
        {x: 70, y: 15},
        {x: 15, y: 5},
        {x: 25, y: 55},
        {x: 5, y: 35},
        {x: 35, y: 10},
        {x: 10, y: 60},
        {x: 70, y: 15},
        {x: 65, y: 5},
        {x: 5, y: 10},
        {x: 10, y: 20},
        {x: 35, y: 30},
        {x: 25, y: 5},
        {x: 20, y: 15},
        {x: 80, y: 20},
        {x: 45, y: 5},
        {x: 5, y: 50},
        {x: 35, y: 65},
        {x: 55, y: 10},
        {x: 35, y: 45},
        {x: 20, y: 65},
        {x: 25, y: 35},
        {x: 40, y: 20},
    ];

    #sprinkles = [];
    
    // delete all existing sprinkles and shuffle the sprinkle
    // locations
    // should run on startup and every new day
    #reset_sprinkles() {
        this.#sprinkles = [];
        this.#sprinkle_locations =
            this.#sprinkle_locations.sort((a, b) => 0.5 - Math.random());
    }

    // add a sprinkle
    // should run every hour
    #add_sprinkle() {
        const idx = this.#sprinkles.length;
        const loc = this.#sprinkle_locations[idx];
        this.#sprinkles.push(new Sprinkle(loc.x, loc.y));
    }

    constructor() {
        this.#img = loadImage(this.#img_name);
        this.#reset_sprinkles();
    }

    set_hour(new_hour) {
        let prev_hour = this.#sprinkles.length;

        if (new_hour < prev_hour) {
            this.#reset_sprinkles();
            prev_hour = 0;
        }

        for (let i = prev_hour; i < new_hour; i++) {
            this.#add_sprinkle();
        }
    }

    draw(x, y) {
        // apply offsets
        x += this.#x_offset;
        y += this.#y_offset;

        // draw cat
        image(this.#img, x, y, this.#img_x_len, this.#img_y_len);
    
        // cover existing sprinkles
        noStroke();
        fill(pink.r, pink.g, pink.b);
        rect(x + 140, y + 20, 35, 55);
        rect(x + 145, y + 15, 50, 5);
        rect(x + 205, y + 25, 5, 5);

        // extend trail
        let draw_trail_col = function(x, y) {
            fill(red.r, red.g, red.b);
            rect(x, y, 40, 15);
            fill(orange.r, orange.g, orange.b);
            rect(x, y + 15, 40, 15);
            fill(yellow.r, yellow.g, yellow.b);
            rect(x, y + 30, 40, 15);
            fill(green.r, green.g, green.b);
            rect(x, y + 45, 40, 15);
            fill(blue.r, blue.g, blue.b);
            rect(x, y + 60, 40, 15);
            fill(purple.r, purple.g, purple.b);
            rect(x, y + 75, 40, 15);
        }

        let curr_x = x - 30 + 40;
        let y_up = true;
        
        // do while because we want to draw one past the left bound
        for (
            let x_offset = 0, y_up = false; 
            x_offset < 800;
            x_offset += 40, y_up = !y_up) 
        {
            draw_trail_col(x - 30 - x_offset, y + 5 + (y_up ? 5 : 0));
        }

        for (let sprinkle of this.#sprinkles) {
            sprinkle.draw(x, y);
        }
    }

}

let cat;

let background_color = background_colors[0];
let background_change_time = 0;

let prev_m;
let prev_h;
let prev_m_millis;

function setup() {
    createCanvas(800,600); // make an HTML canvas element width x height pixels
    
    prev_m = minute();
    prev_h = hour();
    
    cat = new Cat();
    cat.set_hour(prev_h);
    
    // roundabout way to make sure the first minute is accurately placed somewhat
    prev_m_millis = -1000 * second();
}

let minute_indicators_on = false;

function mouseClicked() {
    minute_indicators_on = !minute_indicators_on;
}

function draw_minute_indicators() {
    for (
        let y_offset = 0, count = 0; 
        y_offset < 500; 
        y_offset += 500 / 60, count++) 
    {
        if (count % 15 == 0) {
            stroke(150);
        } else {
            stroke(200);
        }
        line(0, 50 + y_offset, 800, 50 + y_offset);
    }
}

function draw() {
    // I don't trust that the clock doesn't drift with these
    // and I don't want to deal with any "time-passed-during-prog"-bugs
    const mil = millis();
    const min = minute();
    const hou = hour();

    // update annoying background at somewhat random intervals
    // avoid picking the same color twice in a row
    if (mil > background_change_time) {
        const new_color_idx = Math.floor(Math.random() * background_colors.length);
        const old_color = background_color;
        background_color = background_colors.splice(new_color_idx, 1)[0];
        background_colors.push(old_color);
        background_change_time = mil + 500;
    }
	background(background_color.r, background_color.g, background_color.b);

    // log the new minute to console
    // also sync millis to the new minute
    if (min != prev_m) {
        prev_m_millis = mil;
        prev_m = min;
        console.log(min);
    }

    // let this be toggled by clicking the mouse
    if (minute_indicators_on)
        draw_minute_indicators();

    // annoying bounce every second
    const y_offset = 5 * Math.sin(2 * Math.PI * mil / 1000);
    translate(0, y_offset);

    // seconds counting along x-axis
    const minute_millis = mil - prev_m_millis;
    translate(minute_millis * 800 / 60000, 0)

    // minutes along the y-axis
    let y_pos = 500 - (minute() * 500 / 60);
    translate(0, y_pos);

    // hours as sprinkles on the poptart
    cat.set_hour(hou);

    cat.draw(0, 0);
}
