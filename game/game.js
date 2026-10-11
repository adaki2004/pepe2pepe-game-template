import {connect} from './bridge.js';
let score=0,paused=false;const fly=document.querySelector('#fly'),pauseButton=document.querySelector('#pause');
const bridge=connect({pause:()=>setPaused(true),resume:()=>setPaused(false)});
function setPaused(value){paused=value;fly.disabled=paused||score===10;pauseButton.textContent=paused?'Resume':'Pause';document.querySelector('#state').textContent=score===10?'You caught them all! Play again?':paused?'Paused.':'Catch the next firefly.';}
fly.addEventListener('click',()=>{if(paused||score===10)return;score++;document.querySelector('#score').textContent=score+' / 10';fly.style.left=5+Math.random()*75+'%';fly.style.top=5+Math.random()*70+'%';setPaused(false);if(score===10)bridge.score(score);});
pauseButton.addEventListener('click',()=>setPaused(!paused));document.querySelector('#restart').addEventListener('click',()=>{score=0;document.querySelector('#score').textContent='0 / 10';setPaused(false);});
