(() => {
  if (window.__lilCompanionV6) return;
  window.__lilCompanionV6 = true;
  if (!document.documentElement) return;

  const defaults = {enabled:true, variant:"orange"};
  chrome.storage.local.get({...defaults, catName:"Mochi", wanderEnabled:true, petScale:64}, cfg => {
    if (!cfg.enabled || document.getElementById("lil-companion-host")) return;
    mount(cfg.variant || "orange", cfg.catName || "Mochi");
  });

  function mount(initialVariant, initialName) {
    const host=document.createElement("div");
    host.id="lil-companion-host";
    host.style.cssText="all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;";
    document.documentElement.appendChild(host);
    const root=host.attachShadow({mode:"open"});
    const css=document.createElement("style");
    css.textContent=`
      *{box-sizing:border-box}
      .pet{position:fixed;left:calc(100vw - 82px);top:calc(100vh - 82px);width:64px;height:64px;pointer-events:auto;cursor:grab;user-select:none;touch-action:none;filter:drop-shadow(0 4px 3px #0003)}
      .sprite.typing-art{width:124px;height:101px;left:-23px;top:-18px;object-fit:contain}
      .pet.is-typing .sprite{animation:typeBob .22s ease-in-out infinite alternate}
      .pet:active{cursor:grabbing}
      .sprite{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;image-rendering:pixelated;pointer-events:none;transform-origin:50% 88%}\n      .pet[data-variant="calico"] .sprite{filter:hue-rotate(-8deg) saturate(.82) sepia(.18)}\n      .pet[data-variant="gray"] .sprite{filter:grayscale(1) brightness(1.18)}\n      .pet[data-variant="cream"] .sprite{filter:sepia(.38) saturate(.68) brightness(1.12)}\n      .pet[data-variant="midnight"] .sprite{filter:grayscale(1) brightness(.62) contrast(1.22)}
      .pet.idle .sprite{animation:breathe 2.6s ease-in-out infinite}
      .pet.walk .sprite{animation:walk .32s ease-in-out infinite alternate}
      .pet.typing .sprite{animation:typeBob .24s ease-in-out infinite alternate}
      .pet.happy .sprite{animation:hop .42s ease-in-out 3}
      .pet.sad .sprite{animation:sadBob 1.2s ease-in-out infinite}
      .pet.angry .sprite{animation:angryShake .13s linear infinite alternate}
      .pet.dizzy .sprite{animation:dizzy .7s ease-in-out infinite}
      .pet.sleep .sprite{animation:sleep 2.4s ease-in-out infinite}
      .pet.drag .sprite{animation:dragWobble .2s ease-in-out infinite alternate}
      .bubble{position:absolute;left:50%;bottom:calc(100% - 2px);transform:translateX(-50%);padding:6px 9px;border:2px solid #9c5a2d;border-radius:12px 12px 12px 3px;background:#fff8e9;color:#3d291b;font:700 11px/1.2 system-ui,sans-serif;white-space:nowrap;opacity:0;transition:opacity .16s;pointer-events:none}
      .bubble.show{opacity:1}
      .accessory{position:absolute;opacity:0;pointer-events:none;user-select:none}
      .headphones{top:0px;left:32px;font:28px system-ui;filter:drop-shadow(0 1px 1px white)}
      .keyboard{display:none}
      .pet.music .headphones{opacity:1}
      .pet.is-typing .keyboard{opacity:1;animation:keyTap .22s infinite alternate}
      .pet.is-typing .sprite{animation:typeBob .22s infinite alternate}
      .pet.music .sprite{animation:musicBob .65s ease-in-out infinite alternate}
      .pet.is-typing.music .sprite{animation:typeBob .22s infinite alternate}
      .pet .tailfx{position:absolute;right:4px;bottom:17px;font:20px system-ui;opacity:0;animation:tail 1.1s ease-in-out infinite;pointer-events:none}
      .pet.idle .tailfx,.pet.happy .tailfx{opacity:1}
      .pet.typing .tailfx,.pet.is-typing .tailfx{opacity:1}
      @keyframes breathe{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-3px) scaleY(1.025)}}
      @keyframes walk{from{transform:translateY(0) rotate(-3deg)}to{transform:translateY(-7px) rotate(3deg)}}
      @keyframes typeBob{from{transform:translateY(0) rotate(-1deg)}to{transform:translateY(-3px) rotate(1deg)}}
      @keyframes hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-17px)}}
      @keyframes sadBob{0%,100%{transform:translateY(1px)}50%{transform:translateY(5px)}}
      @keyframes angryShake{from{transform:translateX(-2px) rotate(-2deg)}to{transform:translateX(2px) rotate(2deg)}}
      @keyframes dizzy{50%{transform:rotate(5deg) translateY(-3px)}}
      @keyframes sleep{50%{transform:translateY(4px) scaleY(.95)}}
      @keyframes dragWobble{to{transform:rotate(9deg)}}
      @keyframes keyTap{to{transform:translateX(-50%) translateY(2px) scale(.95)}}
      @keyframes musicBob{to{transform:translateY(-5px) rotate(4deg)}}
      @keyframes tail{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(20deg)}}
    `;
    root.appendChild(css);
    const pet=document.createElement("div");
    pet.className="pet idle";
    pet.innerHTML=`<div class="bubble"></div><img class="sprite" draggable="false" alt="Pixel cat"><span class="tailfx">〰</span><span class="accessory headphones">🎧</span>`;
    root.appendChild(pet);
    const img=pet.querySelector(".sprite"),bubble=pet.querySelector(".bubble");
    const assets={orange:"cat-orange.png",sad:"sad.png",angry:"angry.png",happy:"happy.png",love:"love.png",dizzy:"dizzy.png",typing:"typing.png"};
    let variant=initialVariant, x=Math.max(8,innerWidth-82), y=Math.max(8,innerHeight-64);
    let targetX=x, mode="idle", dragging=false, offsetX=0, offsetY=0, typingTimer=0, audioPlaying=false;
    let lastThink=performance.now(), nextWalk=performance.now()+1600, facing=1, catName=initialName||"Mochi", wanderEnabled=true, petScale=64;
    pet.dataset.variant=variant;
    const say=(t,ms=2000)=>{bubble.textContent=t;bubble.classList.add("show");clearTimeout(say.timer);say.timer=setTimeout(()=>bubble.classList.remove("show"),ms)};
    function assetFor(state){
      if(state==="typing") return "typing";
      if(state==="angry"||state==="sad"||state==="dizzy"||state==="happy"||state==="love") return state;
      return variant;
    }
    function updateImage(state="idle"){
      img.classList.toggle("typing-art",state==="typing");
      img.src=chrome.runtime.getURL(assets[assetFor(state)]||assets.orange);
      img.onerror=()=>{img.onerror=null;img.src=chrome.runtime.getURL("cat-orange.png");};
    }
    function setMode(m){
      mode=m;pet.classList.remove("idle","walk","typing","happy","sad","angry","dizzy","sleep","drag");
      pet.classList.add(m);
      updateImage(m);
    }
    function place(){
      x=Math.max(0,Math.min(innerWidth-petScale,x));y=Math.max(0,Math.min(innerHeight-petScale,y));
      pet.style.left=x+"px";pet.style.top=y+"px";
    }
    function flip(){
      // Flip only the sprite, never the bubble or accessories/text.
      img.style.scale=facing<0?"-1 1":"1 1";
    }
    function wander(){
      if(dragging||pet.classList.contains("is-typing")||audioPlaying)return;
      targetX=Math.random()*Math.max(10,innerWidth-petScale-6);
      facing=targetX<x?-1:1;flip();setMode("walk");
    }
    function loop(now){
      const dt=Math.min(40,now-lastThink);lastThink=now;
      if(mode==="walk"&&!dragging&&!pet.classList.contains("is-typing")&&!audioPlaying){
        const dx=targetX-x,step=Math.sign(dx)*Math.min(Math.abs(dx),dt*.075);
        x+=step;y=innerHeight-64;place();
        if(Math.abs(dx)<2){setMode("idle");nextWalk=now+1800+Math.random()*4200;if(Math.random()<.22)say(["just vibing ✨","meow!","nice website","hmm..."][Math.floor(Math.random()*4)]);
          if(Math.random()<.07){setMode("sad");say("a little lonely... 🥺");setTimeout(()=>{if(mode==="sad")setMode("idle");},1700);}}
      }
      if(now>nextWalk&&mode==="idle"&&!dragging&&!physicsActive&&wanderEnabled&&!pet.classList.contains("is-typing")&&!audioPlaying)wander();
      requestAnimationFrame(loop);
    }
    let dragStartedAt=0, maxLift=0, gotAirborne=false, suppressNextClick=false;
    let previousPointer=null, releaseVX=0, releaseVY=0, physicsActive=false, dizzyTimer=null, pointerStart=null, didDrag=false;
    const floorY=()=>Math.max(0,innerHeight-petScale);
    pet.addEventListener("pointerdown",e=>{
      dragging=true;physicsActive=false;dragStartedAt=performance.now();maxLift=0;gotAirborne=false;didDrag=false;
      pointerStart={x:e.clientX,y:e.clientY};
      previousPointer={x:e.clientX,y:e.clientY,t:performance.now()};
      pet.setPointerCapture(e.pointerId);offsetX=e.clientX-x;offsetY=e.clientY-y;setMode("drag");
    });
    pet.addEventListener("pointermove",e=>{
      if(!dragging)return;
      const now=performance.now(), nx=e.clientX-offsetX, ny=e.clientY-offsetY;
      if(pointerStart && Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>7) didDrag=true;
      if(previousPointer){
        const elapsed=Math.max(8,now-previousPointer.t);
        releaseVX=(nx-x)/elapsed*16;
        releaseVY=(ny-y)/elapsed*16;
      }
      x=nx;y=ny;
      const lift=floorY()-y;
      maxLift=Math.max(maxLift,lift);
      if(lift>145 && now-dragStartedAt>300 && !gotAirborne){
        gotAirborne=true;setMode("dizzy");say("WHOA WHOA! 😵",1500);
      }
      previousPointer={x:e.clientX,y:e.clientY,t:now};
      place();
    });
    function startPhysics(){
      physicsActive=true;
      let last=performance.now(), bounces=0;
      function frame(now){
        if(!physicsActive||dragging)return;
        const dt=Math.min(2,(now-last)/16.67);last=now;
        releaseVY+=0.72*dt;
        x+=releaseVX*dt;y+=releaseVY*dt;
        releaseVX*=Math.pow(.985,dt);
        if(x<0){x=0;releaseVX=Math.abs(releaseVX)*.55;}
        if(x>innerWidth-petScale){x=innerWidth-petScale;releaseVX=-Math.abs(releaseVX)*.55;}
        if(y>=floorY()){
          y=floorY();
          if(Math.abs(releaseVY)>2.1 && bounces<5){
            releaseVY=-Math.abs(releaseVY)*.43;releaseVX*=.78;bounces++;
            if(Math.abs(releaseVY)>5 && mode!=="dizzy"){setMode("dizzy");say("OOF! 😵",1000);}
          } else {
            releaseVY=0;releaseVX=0;physicsActive=false;
            setMode("sad");say("that was a rough landing... 🥺",1700);
            setTimeout(()=>{if(!dragging&&mode==="sad")setMode("idle");},1800);
            return;
          }
        }
        place();requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    function release(){
      if(!dragging)return;
      dragging=false;
      suppressNextClick=didDrag;
      const airborne=gotAirborne || maxLift>145;
      if(!airborne){releaseVX*=.45;releaseVY=Math.min(2,Math.max(-1,releaseVY));}
      else {setMode("dizzy");say("MY HEAD IS SPINNING!! 😵");}
      if(didDrag) startPhysics();
      else {physicsActive=false;setMode("idle");}
      setTimeout(()=>{suppressNextClick=false;},180);
    }
    pet.addEventListener("pointerup",release);pet.addEventListener("pointercancel",release);
    let clickTimes=[];
    pet.addEventListener("click",()=>{
      if(dragging||suppressNextClick)return;
      const now=performance.now();
      clickTimes=clickTimes.filter(t=>now-t<2200);clickTimes.push(now);
      setMode("angry");say(clickTimes.length>1?"STOP POKING ME!! 😾":"HEY! THAT TICKLES! 😾");
      clearTimeout(pet.angerTimer);
      pet.angerTimer=setTimeout(()=>{if(!dragging&&mode==="angry")setMode("idle");},clickTimes.length>2?3000:1800);
    });
    function onTyping(e){
      if(e.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;
      const el=e.target;
      if(!el)return;
      const tag=(el.tagName||"").toLowerCase();
      const editable=tag==="input"||tag==="textarea"||el.isContentEditable||el.getAttribute?.("role")==="textbox";
      if(!editable)return;
      clearTimeout(typingTimer);
      pet.classList.add("is-typing");
      if(mode!=="angry"&&mode!=="sad")setMode("typing");
      // Preserve typing overlay after setMode (which resets classes).
      pet.classList.add("is-typing");
      typingTimer=setTimeout(()=>{pet.classList.remove("is-typing");if(!audioPlaying)setMode("idle");},1300);
    }
    document.addEventListener("keydown",onTyping,true);
    document.addEventListener("input",e=>{if(e.isTrusted)onTyping({target:e.target});},true);
    function mediaCheck(){
      const active=[...document.querySelectorAll("audio,video")].some(m=>!m.paused&&!m.ended&&m.readyState>=2);
      if(active!==audioPlaying){
        audioPlaying=active;pet.classList.toggle("music",active);
        if(active){pet.classList.remove("is-typing");setMode("idle");pet.classList.add("music");}
        else {pet.classList.remove("music");setMode("idle");}
      }
    }
    document.addEventListener("play",mediaCheck,true);
    document.addEventListener("pause",mediaCheck,true);
    document.addEventListener("ended",mediaCheck,true);
    const observer=new MutationObserver(mediaCheck);
    observer.observe(document.documentElement,{childList:true,subtree:true});
    chrome.storage.onChanged.addListener((changes,area)=>{
      if(area!=="local")return;
      if(changes.variant){variant=changes.variant.newValue||"orange";pet.dataset.variant=variant;updateImage(mode);}
      if(changes.catName){catName=changes.catName.newValue||"Mochi";}
      if(changes.wanderEnabled){wanderEnabled=!!changes.wanderEnabled.newValue;}
      if(changes.petScale){petScale=Number(changes.petScale.newValue)||64;pet.style.width=petScale+"px";pet.style.height=petScale+"px";place();}
      if(changes.enabled&&changes.enabled.newValue===false)host.remove();
    });
    updateImage("idle");place();requestAnimationFrame(loop);
    setTimeout(()=>say("hi! i'm "+catName+" 🐾",2400),900);
    mediaCheck();
  }
})();