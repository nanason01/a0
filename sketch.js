docstring = `
Welcome!

This is my silly clock.

The x position represents the seconds,
the y position the minutes (moving up each minute),
and the number of sprinkles and rainbow segments are the hour.
The background color changes two times per second,
the cat oscillates once per second,
and I couldn't decide whether I liked the guidelines or not,
so you can click to enable minute indicators.
It also flies in and out at the change of each minute.

Enjoy!

Author: Nicholas Anason (nda2125@columbia.edu)`

console.log(docstring);

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

        // erase existing trail
        let erase_entire_trail = function(x, y) {
            stroke(background_color.r, background_color.g, background_color.b);
            fill(background_color.r, background_color.g, background_color.b);
            rect(x - 800, y, 895, 100);
            rect(x + 95, y, 30, 35);
            rect(x + 115, y + 35, 10, 5);
            rect(x + 120, y + 40, 5, 5);
            rect(x + 95, y + 50, 5, 5);
            rect(x + 95, y + 55, 10, 5);
            rect(x + 95, y + 60, 15, 5);
            rect(x + 95, y + 65, 25, 20);
            rect(x + 120, y + 70, 5, 10);
            rect(x + 95, y + 85, 20, 15);
        }

        // clean up trail for extension
        let clean_trail = function(x, y) {
            stroke(background_color.r, background_color.g, background_color.b);
            fill(background_color.r, background_color.g, background_color.b);
            rect(x - 800, y, 890, 100);
        }

        // extend trail
        let draw_trail_col = function(x, y) {
	    noStroke();
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
        
        // draw a sprinkle for each hour
        for (let sprinkle of this.#sprinkles) {
            sprinkle.draw(x, y);
        }

        // draw as many trails as there are hours currently
        // special case for 0: we need to clean everything
        if (this.#sprinkles.length == 0) {
            erase_entire_trail(x, y);
            return;
        }
        
        // normal case: clean all but the first trail,
        // then fill in trail 2 - h for each hour
        clean_trail(x, y);
        for (
            let hou = 1; hou < this.#sprinkles.length; hou++) 
        {
            const x_offset = hou * 40;
            const y_up = hou % 2 == 0;
            draw_trail_col(x + 90 - x_offset, y + 5 + (y_up ? 5 : 0));
        }
    }

}

let cat;

let background_color = background_colors.pop();
let background_change_time = 0;

// millis are runtime (drifting) and the others are wallclock (accurate)
// time, however, millis make movement a lot more smooth, so compromise
// by aggressively syncing the millisecond each second
let prev_s_millis;
let prev_s;
let prev_m;
let prev_h;

function setup() {
    createCanvas(800,600); // make an HTML canvas element width x height pixels
    
    prev_s = second();
    prev_m = minute();
    prev_h = hour();
    
    cat = new Cat();
    cat.set_hour(prev_h);
    
    // roundabout way to make sure the first minute is accurately placed somewhat
    prev_s_millis = 0;
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
    const sec = second();
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

    // sync millis to wall clock
    if (sec != prev_s) {
        prev_s = sec;
        prev_s_millis = mil;
    }

    // log the new minute to console
    if (min != prev_m) {
        prev_m = min;
        console.log(min);
    }

    // minute indicators toggled by clicking the mouse
    if (minute_indicators_on)
        draw_minute_indicators();

    // annoying bounce every second
    const y_offset = 5 * Math.sin(2 * Math.PI * mil / 1000);
    translate(0, y_offset);

    // seconds counting along x-axis
    const minute_millis = mil - prev_s_millis + 1000 * sec;

    // fly away in last 3 seconds and in in first 3 seconds
    // The idea is to use a cosine wave to do smooth acceleration
    // and decelleration
    const smooth_position = minute_millis * 800 / 60000;
    if (minute_millis < 3000) {
        const tot_minut_millis = 3000 + minute_millis;
        translate(smooth_position
            - 200 * Math.cos(Math.PI * tot_minut_millis / 6000)
            - 200,
            0);
    } else if (60000 - minute_millis < 3000) {
        const rem_minute_millis = minute_millis - 57000;
        translate(smooth_position
            - 1000 * Math.cos(Math.PI * rem_minute_millis / 6000)
            + 1000,
            0);
    } else {
        translate(smooth_position, 0)
    }

    // minutes along the y-axis
    let y_pos = 500 - (min * 500 / 60);
    translate(0, y_pos);

    // hours as sprinkles on the poptart
    cat.set_hour(hou);

    cat.draw(0, 0);
}
