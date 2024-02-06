import React, { useState } from 'react';
import './wheel.css';


let randomRotation = Math.ceil(Math.random() * 10000);
export const Wheel = () => {
    const [items, setItems] = useState([]);
    const [itemColors, setItemColors] = useState([]);
    const [spinning, setSpinning] = useState(false);

    const handleSpinClick = () => { 
        randomRotation += 8000 + Math.floor(Math.random() * 2001); 
        console.log(randomRotation);
        setSpinning(randomRotation);
        setTimeout(() => {
            setSpinning(false);
        }, 10000); 
    };

    const sendColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return { r, g, b };
    };

    const toRad = (deg) => deg * (Math.PI / 180.0);

    const createWheel = (event) => {

        const textareaValue = event.target.value;
        const newItems = textareaValue.split('\n');
        setItems(newItems);
        
        const newColors = newItems.map((_, index) => itemColors[index] || sendColor());
        setItemColors(newColors);

        draw();
    };

    const draw = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2;
        const step = 360 / (items.length || 0);

        ctx.clearRect(0, 0, width, height);

        let startDeg = 0;
        for (let i = 0; i < items.length; i++, startDeg += step) {
            let endDeg = startDeg + step;

            const color = itemColors[i];
            const colorStyle = `rgb(${color.r},${color.g},${color.b})`;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
            ctx.fillStyle = colorStyle;
            ctx.lineTo(centerX, centerY);
            ctx.fill();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(toRad((startDeg + endDeg) / 2));

            if (color.r > 150 || color.g > 150 || color.b > 150) {
                ctx.fillStyle = '#000';
            } else {
                ctx.fillStyle = '#fff';
            }
            
            ctx.font = 'bold 26px helvetica';
            ctx.fillText(items[i], 120, 10);
            ctx.restore();
        }
    };

    return (
        <div className='container'>
          <div className='wheel'>
            <canvas className="" id="canvas" width="500" height="500" style={{ transform: `rotate(${spinning}deg)`,  transition: "transform 10s ease-out" }}></canvas>
            <div className="spinBTN" onClick={handleSpinClick}>
              SPIN
              <div className="arrowPointer"></div>
            </div>
          </div>
    
          <div className="inputVals">
            <textarea onChange={createWheel} rows="30" cols="30" value={items.join('\n')}></textarea>
          </div>
        </div>
      );
};

export default Wheel;
