import { useEffect, useRef } from "react";
import { boardPattern1, boardPattern2, boardPattern3, padlPattern1, padlPattern2, padlPattern3 } from "./patterns";
import { SVG } from "@svgdotjs/svg.js";
import Board1 from '../assets/game/zig-zag.svg';
interface GamePatternProps {
    pad: number;
    board: number;
    width: number;
    height?: number;
    cy: number;
    cx: number;
}

const GamePattern: React.FC<GamePatternProps> = ({ pad, board, width, height, cx, cy }) => {
    const psvgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (psvgRef.current) {
            if (pad)
            {
                const draw = SVG().addTo(psvgRef.current).size(width, height);
                const reca = draw.rect(20, width - 25).radius(15).cx(cx).cy(cy).rotate(60).fill(draw.pattern(10, 10, function(add) {
                  add.rect(10, 10).fill('#fff');
                  add.rect(7.7, 7.7).rotate(45).translate(5, 0).fill('#444');
                  } ));
    
                // Add your specific pattern drawing logic based on the pad prop
                switch (pad) {
                    case 1:
                        reca.fill(padlPattern1(draw));
                        break;
                    case 2:
                        reca.fill(padlPattern2(draw));
                        break;
                    case 3:
                        reca.fill(padlPattern3(draw));
                        break;
                    default:
                        // Handle other cases or provide a default pattern
                        break;
                }
                return () => {
                    // Cleanup the SVG instance
                    draw.remove();
                }
            }
            else if (board)
            {
                const draw = SVG().addTo(psvgRef.current).size(200, 125);
                const reca = draw.rect(200, 125).fill(draw.pattern(50, 50, function(add) {
                    add.image(Board1).size(50, 50);
                  } ));
                switch (board) {
                    case 1:
                        reca.fill(boardPattern1(draw));
                        break;
                    case 2:
                        reca.fill(boardPattern2(draw));
                        break;
                    case 3:
                        reca.fill(boardPattern3(draw));
                        break;
                    default:
                        // Handle other cases or provide a default pattern
                        break;
                }
                return () => {
                    // Cleanup the SVG instance
                    draw.remove();
                }
            }
        }
        console.log("pad: ", pad);
    }, [pad, board]);

    return <div ref={psvgRef}></div>;
};

export default GamePattern;