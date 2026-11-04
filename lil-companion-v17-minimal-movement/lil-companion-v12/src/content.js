(() => {
  if (window.__lilCompanionV7) return;
  window.__lilCompanionV7 = true;
  if (!document.documentElement) return;

  const defaults = {enabled:true, variant:"orange"};
  chrome.storage.local.get({...defaults, catName:"Mochi", wanderEnabled:true, petScale:64}, cfg => {
    if (!cfg.enabled || document.getElementById("lil-companion-host")) return;
    mount(cfg.variant || "orange", cfg.catName || "Mochi", cfg.bubbleScale || 1);
  });

  function mount(initialVariant, initialName, initialBubbleScale) {
    const host=document.createElement("div");
    host.id="lil-companion-host";
    host.style.cssText="all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;";
    document.documentElement.appendChild(host);
    const root=host.attachShadow({mode:"open"});
    const css=document.createElement("style");
    css.textContent=`
      *{box-sizing:border-box}
      .ground-impact-art{position:absolute;left:var(--ix);top:var(--iy);width:clamp(260px, calc(var(--pet-size,64px) * 5.2), 430px);height:auto;max-width:none;display:block;pointer-events:none;image-rendering:pixelated;transform:translate(-50%,-100%) scaleX(.72) scaleY(.72);opacity:0;animation:groundArtHit 2.7s ease-out forwards}
      @keyframes groundArtHit{0%{opacity:0;transform:translate(-50%,-100%) scaleX(.48) scaleY(.48)}12%{opacity:1;transform:translate(-50%,-100%) scaleX(1) scaleY(1)}58%{opacity:.92}100%{opacity:0;transform:translate(-50%,-100%) scaleX(1.08) scaleY(.9)}}
      .impact-layer{position:fixed;inset:0;width:100vw;height:100vh;overflow:hidden;pointer-events:none;z-index:2147483645}
      .impact{position:absolute;left:var(--ix);top:var(--iy);width:1px;height:1px;pointer-events:none}
      .impact .pixel{position:absolute;left:0;top:0;display:block;width:var(--sz);height:var(--sz);background:var(--dust,#fff0dc);opacity:1;image-rendering:pixelated;transform:translate(-50%,-50%);animation:impactPixel var(--dur,600ms) ease-out forwards}
      .impact.ground .pixel{box-shadow:0 0 2px #fff9}
      .impact .ground-line{position:absolute;left:0;top:0;display:block;width:var(--wide);height:4px;background:#fff0dc;box-shadow:0 0 4px #fff8;transform:translate(-50%,-50%) scaleX(.2);transform-origin:center;animation:impactLine 900ms ease-out forwards}
      @keyframes impactPixel{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.25)}}
      @keyframes impactLine{0%{opacity:0;transform:translate(-50%,-50%) scaleX(.15)}15%{opacity:1;transform:translate(-50%,-50%) scaleX(1)}100%{opacity:0;transform:translate(-50%,-50%) scaleX(1.25)}}

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
      .pet.emo .sprite{filter:drop-shadow(0 0 5px #b36b9b88);animation:emoFloat 3.1s ease-in-out infinite}
      .pet.emo.walk .sprite{animation:emoWalk .48s ease-in-out infinite alternate}
      .pet.emo.happy .sprite{animation:emoHop .6s ease-in-out 2}
      .pet.emo.angry .sprite{animation:emoGlitch .16s steps(2) infinite}
      .pet.emo.drag .sprite{animation:emoDrag .24s ease-in-out infinite alternate}
      .pet.emo .bubble{background:#211923;color:#f5d9e9;border-color:#bd789f;border-radius:5px;font-family:Georgia,serif;font-style:italic;letter-spacing:.2px;box-shadow:0 0 12px #bd789f33}
      .pet.emo .bubble:before{border-top-color:#bd789f}.pet.emo .bubble:after{border-top-color:#211923}
      @keyframes emoFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-4px) rotate(1deg)}}
      @keyframes emoWalk{from{transform:translateY(0) rotate(-2deg)}to{transform:translateY(-4px) rotate(2deg)}}
      @keyframes emoHop{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px) rotate(-3deg)}}
      @keyframes emoGlitch{0%{transform:translateX(-1px)}50%{transform:translateX(2px) skewX(2deg)}100%{transform:translateX(0)}}
      @keyframes emoDrag{to{transform:rotate(-8deg) translateY(-2px)}}
      .pet.drag .sprite{animation:dragWobble .2s ease-in-out infinite alternate}
      .bubble{position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);padding:calc(7px * var(--bubble-scale,1)) calc(11px * var(--bubble-scale,1));border:2px solid #9c5a2d;border-radius:13px;background:#fff8e9;color:#3d291b;font:800 calc(12px * var(--bubble-scale,1))/1.25 system-ui,sans-serif;white-space:nowrap;max-width:260px;opacity:0;transition:opacity .16s;pointer-events:none;filter:drop-shadow(0 2px 2px #0002)}
      .bubble:before{content:"";position:absolute;left:calc(50% - 7px);bottom:-10px;border-width:9px 8px 0 8px;border-style:solid;border-color:#9c5a2d transparent transparent transparent}
      .bubble:after{content:"";position:absolute;left:calc(50% - 6px);bottom:-7px;border-width:7px 6px 0 6px;border-style:solid;border-color:#fff8e9 transparent transparent transparent}
      .bubble.show{opacity:1}
      .bubble.show{opacity:1}
      .accessory{position:absolute;opacity:0;pointer-events:none;user-select:none}
      .pet.music .sprite{width:124px;height:106px;left:-30px;top:-24px;object-fit:contain;opacity:1}
      .pet.sleep .sprite{animation:sleep 2.4s ease-in-out infinite}
      .pet.emo .sprite{filter:drop-shadow(0 0 5px #b36b9b88);animation:emoFloat 3.1s ease-in-out infinite}
      .pet.emo.walk .sprite{animation:emoWalk .48s ease-in-out infinite alternate}
      .pet.emo.happy .sprite{animation:emoHop .6s ease-in-out 2}
      .pet.emo.angry .sprite{animation:emoGlitch .16s steps(2) infinite}
      .pet.emo.drag .sprite{animation:emoDrag .24s ease-in-out infinite alternate}
      .pet.emo .bubble{background:#211923;color:#f5d9e9;border-color:#bd789f;border-radius:5px;font-family:Georgia,serif;font-style:italic;letter-spacing:.2px;box-shadow:0 0 12px #bd789f33}
      .pet.emo .bubble:before{border-top-color:#bd789f}.pet.emo .bubble:after{border-top-color:#211923}
      @keyframes emoFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-4px) rotate(1deg)}}
      @keyframes emoWalk{from{transform:translateY(0) rotate(-2deg)}to{transform:translateY(-4px) rotate(2deg)}}
      @keyframes emoHop{0%,100%{transform:translateY(0)}50%{transform:translateY(-11px) rotate(-3deg)}}
      @keyframes emoGlitch{0%{transform:translateX(-1px)}50%{transform:translateX(2px) skewX(2deg)}100%{transform:translateX(0)}}
      @keyframes emoDrag{to{transform:rotate(-8deg) translateY(-2px)}}
      .keyboard{display:none}
      .pet.music .headphones{opacity:1}
      .pet.is-typing .keyboard{opacity:1;animation:keyTap .22s infinite alternate}
      .pet.is-typing .sprite{animation:typeBob .22s infinite alternate}
      .pet.music .sprite{animation:musicBob .65s ease-in-out infinite alternate}
      .pet.is-typing.music .sprite{animation:typeBob .22s infinite alternate}
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
    `;
    root.appendChild(css);
    const pet=document.createElement("div");
    pet.className="pet idle";
    pet.innerHTML=`<div class="bubble"></div><img class="sprite" draggable="false" alt="Pixel cat">`;
    root.appendChild(pet);
    const impactLayer=document.createElement("div");
    impactLayer.className="impact-layer";
    root.appendChild(impactLayer);
    const img=pet.querySelector(".sprite"),bubble=pet.querySelector(".bubble");
    const assets={orange:"assets/cats/cat-orange.png",street:"assets/cats/street.png",cream:"assets/cats/cream.png",black:"assets/cats/black.png",white:"assets/cats/white.png",emo:"assets/cats/emo.png",sad:"assets/cats/sad.png",angry:"assets/cats/angry.png",happy:"assets/cats/happy.png",love:"assets/cats/love.png",dizzy:"assets/cats/dizzy.png",typing:"assets/cats/typing.png",sleep:"assets/cats/sleep.png",music:"assets/cats/headphones.png",emoIdle:"assets/cats/emo.png",emoDizzy:"assets/cats/emo-dizzy.png",emoMusic:"assets/cats/emo-music.png",emoTyping:"assets/cats/emo-typing.png",emoSad:"assets/cats/emo-sad.png",emoAngry:"assets/cats/emo-angry.png",emoSleep:"assets/cats/emo-sleep.png"};
    let variant=initialVariant, x=Math.max(8,innerWidth-82), y=Math.max(8,innerHeight-64);
    let targetX=x, mode="idle", dragging=false, offsetX=0, offsetY=0, typingTimer=0, audioPlaying=false;
    let lastThink=performance.now(), nextWalk=performance.now()+12000, nextChatAt=performance.now()+9000, facing=1, catName=initialName||"Mochi", wanderEnabled=true, petScale=64, bubbleScale=Number(initialBubbleScale)||1, lastInteraction=performance.now(), sleeping=false;
    pet.style.setProperty("--bubble-scale",bubbleScale);
    pet.dataset.variant=variant;pet.classList.toggle("emo",variant==="emo");
    const chats={normal:["meow! 🐾","you got this!","need a tiny break?","i'm supervising 👀","this page is ours now","pspsps...","remember to stretch!","i believe in you ✨","one more tab? really?","tiny paws, big plans"],pet:["purrrrr ❤️","best human ever","again again!! 💕","that tickles!"],emo:["uh, meow ig","where da milk at?","hail dinga","milk is for cats","...","whatever.","i'm fine. (not really)","the void is calling 🖤","don't talk to me before my playlist","it's not a phase.","sad songs hit harder at 2am","brb staring out the window","everything is temporary. even this tab.","🖤 🥀 🖤"],emoPet:["uh, meow ig","where da milk at?","hail dinga","milk is for cats","...okay, that was kinda nice.","don't tell anyone i liked that.","🖤","you can stay, i guess."]};
    const pick=a=>a[Math.floor(Math.random()*a.length)];
    const say=(t,ms=2400)=>{bubble.textContent=t;bubble.classList.add("show");clearTimeout(say.timer);say.timer=setTimeout(()=>bubble.classList.remove("show"),ms)};
    const chat=(kind="normal")=>say(pick(variant==="emo"?(kind==="pet"?chats.emoPet:chats.emo):(chats[kind]||chats.normal)));
    function assetFor(state){
      if(variant==="emo"){
        if(state==="typing") return "emoTyping";
        if(state==="music") return "emoMusic";
        if(state==="dizzy") return "emoDizzy";
        if(state==="sad") return "emoSad";
        if(state==="angry") return "emoAngry";
        if(state==="sleep") return "emoSleep";
        return "emoIdle";
      }
      if(variant!=="orange") return variant;
      if(state==="typing") return "typing";
      if(state==="music") return "music";
      if(state==="angry"||state==="sad"||state==="dizzy"||state==="happy"||state==="love"||state==="sleep") return state;
      return variant;
    }
    function updateImage(state="idle"){
      img.classList.toggle("typing-art",state==="typing");
      img.src=chrome.runtime.getURL(assets[assetFor(state)]||assets.orange);
      img.onerror=()=>{img.onerror=null;img.src=chrome.runtime.getURL("assets/cats/cat-orange.png");};
    }
    function setMode(m){
      mode=m;pet.classList.remove("idle","walk","typing","happy","sad","angry","dizzy","sleep","drag");
      pet.classList.add(m);pet.classList.toggle("emo",variant==="emo");
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
      // Tiny occasional repositioning only: stay close to the current spot.
      const drift=(Math.random()<.5?-1:1)*(24+Math.random()*42);
      targetX=Math.max(8,Math.min(innerWidth-petScale-8,x+drift));
      if(Math.abs(targetX-x)<12){nextWalk=performance.now()+18000+Math.random()*18000;return;}
      facing=targetX<x?-1:1;flip();setMode("walk");
    }
    function loop(now){
      const dt=Math.min(40,now-lastThink);lastThink=now;
      if(mode==="idle"&&!sleeping&&!dragging&&!audioPlaying&&!pet.classList.contains("is-typing")&&now-lastInteraction>28000){
        sleeping=true;setMode("sleep");say("Zzz... 💤",2600);
      }
      if(mode==="walk"&&!dragging&&!pet.classList.contains("is-typing")&&!audioPlaying){
        const dx=targetX-x,step=Math.sign(dx)*Math.min(Math.abs(dx),dt*.035);
        x+=step;y=innerHeight-64;place();
        if(Math.abs(dx)<2){setMode("idle");nextWalk=now+18000+Math.random()*22000;if(Math.random()<.34)chat();
          if(Math.random()<.07){setMode("sad");say(variant==="emo"?"left alone with my thoughts 🥀":"a little lonely... 🥺");setTimeout(()=>{if(mode==="sad")setMode("idle");},1700);}}
      }
      if(now>nextWalk&&mode==="idle"&&!sleeping&&!dragging&&!physicsActive&&wanderEnabled&&!pet.classList.contains("is-typing")&&!audioPlaying)wander();
      if(now>nextChatAt&&mode==="idle"&&!sleeping&&!dragging&&!physicsActive&&!audioPlaying&&!pet.classList.contains("is-typing")){
        chat();nextChatAt=now+22000+Math.random()*18000;
      }
      requestAnimationFrame(loop);
    }
    let dragStartedAt=0, maxLift=0, gotAirborne=false, suppressNextClick=false;
    let previousPointer=null, releaseVX=0, releaseVY=0, physicsActive=false, dizzyTimer=null, pointerStart=null, didDrag=false;
    const floorY=()=>Math.max(0,innerHeight-petScale);
    pet.addEventListener("pointerdown",e=>{
      lastInteraction=performance.now();sleeping=false;
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
    function spawnImpact(cx,cy,kind="wall",strength=1){
      const fx=document.createElement("div");
      fx.className="impact "+kind;
      fx.style.setProperty("--ix",Math.round(cx)+"px");
      fx.style.setProperty("--iy",Math.round(cy)+"px");
      fx.style.setProperty("--wide",Math.round(42+strength*30)+"px");
      const colors=["#fff0dc","#f5d9c5","#ffffff","#d9c4c0"];
      const count=kind==="ground"?26:12;
      for(let i=0;i<count;i++){
        const bit=document.createElement("i");
        bit.className="pixel";
        const angle=kind==="ground"?(Math.PI+(Math.PI*Math.random())):(Math.random()*Math.PI*2);
        const distance=(kind==="ground"?24:15)+Math.random()*(kind==="ground"?54:30)*strength;
        const dx=Math.cos(angle)*distance;
        const dy=kind==="ground"?-Math.random()*(22+strength*18):Math.sin(angle)*distance;
        bit.style.setProperty("--dx",Math.round(dx)+"px");
        bit.style.setProperty("--dy",Math.round(dy)+"px");
        bit.style.setProperty("--sz",(3+Math.round(Math.random()*3))+"px");
        bit.style.setProperty("--dur",(kind==="ground"?620:440)+Math.round(Math.random()*180)+"ms");
        bit.style.setProperty("--dust",colors[Math.floor(Math.random()*colors.length)]);
        bit.style.animationDelay=(Math.random()*45)+"ms";
        fx.appendChild(bit);
      }
      if(kind==="ground"){
        const art=document.createElement("img");
        art.className="ground-impact-art";
        art.src=chrome.runtime.getURL("assets/effects/ground-impact.png");
        art.alt="";
        fx.appendChild(art);
        const line=document.createElement("i");
        line.className="ground-line";
        fx.appendChild(line);
      }
      impactLayer.appendChild(fx);
      setTimeout(()=>fx.remove(),kind==="ground"?3000:850);
    }
    function startPhysics(){
      physicsActive=true;
      let last=performance.now(), bounces=0;
      function frame(now){
        if(!physicsActive||dragging)return;
        const dt=Math.min(2,(now-last)/16.67);last=now;
        releaseVY+=0.72*dt;
        x+=releaseVX*dt;y+=releaseVY*dt;
        releaseVX*=Math.pow(.985,dt);
        if(x<0){
          x=0;
          if(Math.abs(releaseVX)>0.7)spawnImpact(5,y+petScale*.52,"wall",Math.max(.8,Math.min(1.8,Math.abs(releaseVX)/5)));
          releaseVX=Math.abs(releaseVX)*.55;
        }
        if(x>innerWidth-petScale){
          x=innerWidth-petScale;
          if(Math.abs(releaseVX)>0.7)spawnImpact(innerWidth-5,y+petScale*.52,"wall",Math.max(.8,Math.min(1.8,Math.abs(releaseVX)/5)));
          releaseVX=-Math.abs(releaseVX)*.55;
        }
        // Ceiling collision: bounce downward immediately instead of clamping at y=0.
        if(y<=0){
          y=0;
          if(releaseVY<0){
            releaseVY=Math.max(2.2,Math.abs(releaseVY)*.62);
            releaseVX*=.88;
            bounces++;
            if(Math.abs(releaseVY)>4){setMode("dizzy");say("BONK! 😵",900);}
          }
        }
        if(y>=floorY()){
          y=floorY();
          const groundSpeed=Math.abs(releaseVY);
          if(releaseVY>0.9)spawnImpact(x+petScale/2,innerHeight-2,"ground",Math.max(1,Math.min(2.2,groundSpeed/3)));
          if(groundSpeed>2.1 && bounces<5){
            releaseVY=-groundSpeed*.43;releaseVX*=.78;bounces++;
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
    let clickTimes=[], angryUntil=0;
    pet.addEventListener("click",()=>{
      if(dragging||suppressNextClick)return;
      const now=performance.now();lastInteraction=now;sleeping=false;
      // Keep the angry reaction active briefly; taps during it cannot restart the love counter.
      if(now<angryUntil){
        setMode("angry");
        say(variant==="emo"?"i said i'm fine. 🖤":"HEY. I'M STILL ANGRY. 😾",1100);
        return;
      }
      clickTimes=clickTimes.filter(t=>now-t<2200);
      clickTimes.push(now);
      if(clickTimes.length>=3){
        clickTimes=[];
        angryUntil=now+2600;
        setMode("angry");
        say(variant==="emo"?"I SAID I AM FINE. 🖤":"STOP POKING ME!! 😾");
        clearTimeout(pet.angerTimer);
        pet.angerTimer=setTimeout(()=>{
          if(!dragging&&mode==="angry")setMode("idle");
          angryUntil=0;
        },2600);
      } else {
        setMode(variant==="emo"?"happy":"love");
        say(variant==="emo"?pick(chats.emoPet):(clickTimes.length===1?pick(chats.pet):"MORE PETS PLEASE! 💕"));
        clearTimeout(pet.loveTimer);
        pet.loveTimer=setTimeout(()=>{if(!dragging&&(mode==="love"||mode==="happy"))setMode("idle");},2100);
      }
    });
    function onTyping(e){
      lastInteraction=performance.now();sleeping=false;
      if(mode==="sleep")setMode("idle");
      if(e.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;
      const el=e.target;
      if(!el)return;
      const tag=(el.tagName||"").toLowerCase();
      const editable=tag==="input"||tag==="textarea"||el.isContentEditable||el.getAttribute?.("role")==="textbox";
      if(!editable)return;
      const wasTyping=pet.classList.contains("is-typing");
      clearTimeout(typingTimer);
      pet.classList.add("is-typing");
      if(mode!=="angry"&&mode!=="sad")setMode("typing");
      // Start a typing-only conversation: each bubble stays for five seconds,
      // then changes while the user is still actively typing.
      if(!wasTyping){
        clearInterval(pet.typingChatInterval);
        const typingLines=()=>variant==="emo"
          ? ["typing my feelings away...","dont look at my search history","writing another sad playlist","the keyboard understands me 🥀"]
          : ["look at me go! ⌨️","i'm helping!!","these keys are tiny","are we coding or chatting?","my paws are faster than yours","one more line!"];
        say(pick(typingLines()),5000);
        pet.typingChatInterval=setInterval(()=>{
          if(pet.classList.contains("is-typing"))say(pick(typingLines()),5000);
          else clearInterval(pet.typingChatInterval);
        },5000);
      }
      // Preserve typing overlay after setMode (which resets classes).
      pet.classList.add("is-typing");
      typingTimer=setTimeout(()=>{
        pet.classList.remove("is-typing");
        clearInterval(pet.typingChatInterval);
        if(!audioPlaying)setMode("idle");
      },1300);
    }
    document.addEventListener("keydown",onTyping,true);
    document.addEventListener("input",e=>{if(e.isTrusted)onTyping({target:e.target});},true);
    function mediaCheck(){
      const active=[...document.querySelectorAll("audio,video")].some(m=>!m.paused&&!m.ended&&m.readyState>=2);
      if(active!==audioPlaying){
        audioPlaying=active;
        if(active){lastInteraction=performance.now();sleeping=false;pet.classList.remove("is-typing");setMode("music");pet.classList.add("music");}
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
      if(changes.variant){variant=changes.variant.newValue||"orange";pet.dataset.variant=variant;pet.classList.toggle("emo",variant==="emo");updateImage(mode);say(variant==="emo"?"welcome to the dark side 🥀":"new look! cute, right? ✨",2200);}
      if(changes.catName){catName=changes.catName.newValue||"Mochi";}
      if(changes.wanderEnabled){wanderEnabled=!!changes.wanderEnabled.newValue;}
      if(changes.petScale){petScale=Number(changes.petScale.newValue)||64;pet.style.width=petScale+"px";pet.style.height=petScale+"px";place();}
      if(changes.bubbleScale){bubbleScale=Number(changes.bubbleScale.newValue)||1;pet.style.setProperty("--bubble-scale",bubbleScale);}
      if(changes.enabled&&changes.enabled.newValue===false)host.remove();
    });
    updateImage("idle");place();requestAnimationFrame(loop);
    setTimeout(()=>say(variant==="emo"?"hi. i am "+catName+" 🖤":"hi! welcome, "+catName+" 🐾",2600),900);
    mediaCheck();
  }
})();
