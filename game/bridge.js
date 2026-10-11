export function connect({pause,resume}){let channel;
 function receive(e){if(e.source!==parent||e.data?.protocol!=='pepe-game/1')return;const m=e.data;if(m.type==='init'&&typeof m.channel==='string'&&m.channel.length<=200){channel=m.channel;parent.postMessage({protocol:'pepe-game/1',type:'ready',channel},'*');}if(!channel||m.channel!==channel)return;if(m.type==='pause')pause();if(m.type==='resume')resume();}
 addEventListener('message',receive);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
 return {score(value){if(channel&&Number.isSafeInteger(value)&&value>=0)parent.postMessage({protocol:'pepe-game/1',type:'score',channel,score:value},'*');}};
}
