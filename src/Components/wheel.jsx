import React, { useState,useEffect } from 'react';
import useSound from 'use-sound';
import clickSound from '../assets/click.wav';
import './wheel.css';


let randomRotation = Math.ceil(Math.random() * 10000);
export const Wheel = () => {
    const [items, setItems] = useState([]);
    const [itemColors, setItemColors] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState('NONE');
    const [play] = useSound(clickSound);

    useEffect(() => {
        draw();
    }, [items, itemColors]);

    useEffect(() => {
        play();
    }, [winner]);

const handleSpinClick = () => {
    randomRotation += 8000 + Math.floor(Math.random() * 2001);
    setSpinning(randomRotation);

    const trackRotation = () => {
        const canvas = document.getElementById('canvas');
        const currentTransform = window.getComputedStyle(canvas).getPropertyValue('transform');
        const values = currentTransform.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
        let currentRotation = Math.round(Math.atan2(b, a) * (180/Math.PI));
        if (currentRotation < 0) currentRotation = 360 + currentRotation;
    
        const sectionAngle = 360 / items.length;
        let sectionIndex = Math.floor((360 - currentRotation) / sectionAngle) % items.length;
    
        const currentItem = items[sectionIndex];
        setWinner(currentItem);
    
        if (Math.abs(currentRotation - randomRotation) > 1) {
            requestAnimationFrame(trackRotation);
        }
    };
    
    requestAnimationFrame(trackRotation);

    setTimeout(() => {
        
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
        <div>
        <div className='container'>
          <div className='wheel'>
            <canvas className="" id="canvas" width="500" height="500" style={{ transform: `rotate(${spinning}deg)`, transition: "transform 10s ease" }}></canvas>
            <div className="spinBTN" onClick={handleSpinClick}>
              SPIN
              <div className="arrowPointer"></div>
            </div>
          </div>
    
          <div className="inputVals">
            <textarea onChange={createWheel} rows="30" cols="30" value={items.join('\n')}></textarea>
          </div>
        </div>
        <div className='winner'>
            <h1>Winner: {winner}</h1>
        </div>
        </div>
      );
};

export default Wheel;
