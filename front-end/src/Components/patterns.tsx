import { SVG, Pattern, G, Svg } from '@svgdotjs/svg.js';
import Board1 from '../assets/game/zig-zag.svg';
import Board2 from '../assets/game/sor.svg';
import Board3 from '../assets/game/b4.svg';


export const padlPattern1 = (svg: Svg): Pattern => 
    svg.pattern(10, 10, function(add) {
        add.rect(10, 10).fill('#e9e4d9');
        add.rect(5, 5).fill('#2a2929');
        add.rect(5, 5).fill('#2a2929').move(5, 5);
    });

export const padlPattern2 = (svg: Svg): Pattern => 
    svg.pattern(10, 10, function(add) {
        add.rect(10, 10).fill('#282828');
        add.circle(3).center(3, 4.3).fill('#393939');
        add.circle(3).center(3, 3).fill('black');
        add.circle(3).center(10.5, 12.5).fill('#393939');
        add.circle(3).center(10.5, 11.3).fill('black');
    });

export const padlPattern3 = (svg: Svg): Pattern => 
    svg.pattern(10, 10, function(add) {
        add.rect(10, 10).fill('#fff');
        add.rect(7.7, 7.7).rotate(45).translate(5, 0).fill('#444');
    });

export const boardPattern1 = (svg: Svg): Pattern =>
    svg.pattern(50, 50, function(add) {
        add.image(Board1).size(50, 50);
    });

export const boardPattern2 = (svg: Svg): Pattern =>
    svg.pattern(50, 50, function(add) {
        add.image(Board2).size(50, 50);
    });

export const boardPattern3 = (svg: Svg): Pattern =>
    svg.pattern(50, 50, function(add) {
        add.image(Board3).size(50, 50);
    });