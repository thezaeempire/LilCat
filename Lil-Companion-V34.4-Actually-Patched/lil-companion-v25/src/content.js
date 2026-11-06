(() => {
  if (window.__lilCompanionV25) return;
  window.__lilCompanionV25 = true;
  if (!document.documentElement) return;

  const defaults = {enabled:true, variant:"orange"};
  chrome.storage.local.get({...defaults, catName:"Mochi", wanderEnabled:true, petScale:88}, cfg => {
    if (Number(cfg.petScale)<=64) { cfg.petScale=88; chrome.storage.local.set({petScale:88}); }
    if (!cfg.enabled || document.getElementById("lil-companion-host")) return;
    mount(cfg.variant==="emo"?"orange":(cfg.variant || "orange"), cfg.catName || "Mochi", cfg.bubbleScale || 1, !!cfg.followMouse, 2.5);
  });

  function mount(initialVariant, initialName, initialBubbleScale, initialFollowMouse=false, initialMoveSpeed=2.5) {
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
      .impact.ground .pixel{box-shadow:0 0 5px #e8d8c155;border-radius:2px}
      .impact .ground-line{position:absolute;left:0;top:0;display:block;width:var(--wide);height:5px;background:#98613b;box-shadow:0 0 7px #8b5a3566;transform:translate(-50%,-50%) scaleX(.2);transform-origin:center;animation:impactLine 1150ms ease-out forwards}
      @keyframes impactPixel{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.25)}}
      @keyframes impactLine{0%{opacity:0;transform:translate(-50%,-50%) scaleX(.15)}15%{opacity:1;transform:translate(-50%,-50%) scaleX(1)}100%{opacity:0;transform:translate(-50%,-50%) scaleX(1.25)}}

      .food-bowl{position:fixed;left:22px;bottom:8px;width:46px;height:36px;object-fit:contain;image-rendering:pixelated;cursor:grab;pointer-events:auto;touch-action:none;user-select:none;filter:drop-shadow(0 3px 3px #0004);z-index:2147483646}
      .cat-house{position:fixed;left:auto;top:auto;width:124px;height:100px;object-fit:contain;image-rendering:pixelated;cursor:grab;pointer-events:auto;touch-action:none;user-select:none;z-index:2147483644;filter:drop-shadow(0 3px 3px #0004);transform:none!important;transition:none!important}
      .cat-house:hover{transform:none}
      .food-bowl:active{cursor:grabbing}
      .pet{position:fixed;left:calc(100vw - 106px);top:calc(100vh - 106px);width:88px;height:88px;pointer-events:auto;cursor:grab;user-select:none;touch-action:none;z-index:2147483646;filter:drop-shadow(0 4px 3px #0003)}
      .pet.is-typing .sprite{animation:typeBob .22s ease-in-out infinite alternate}
      .pet.grooming .sprite{width:112%;height:112%;left:-6%;top:-8%;object-fit:contain;object-position:center bottom;image-rendering:pixelated;animation:none!important}
      .pet.eating .sprite{animation:none!important;width:100%;height:100%;left:0;top:0;object-fit:contain;object-position:center bottom;image-rendering:pixelated;transform:none!important;scale:1!important}
      .sprite.walking-art{width:118%;height:118%;left:-9%;top:-18%;object-fit:contain;object-position:center bottom;image-rendering:pixelated}
      .pet:active{cursor:grabbing}
      .sprite{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center bottom;image-rendering:pixelated;pointer-events:none;transform-origin:50% 100%}\n      .pet[data-variant="calico"] .sprite{filter:hue-rotate(-8deg) saturate(.82) sepia(.18)}\n      .pet[data-variant="gray"] .sprite{filter:grayscale(1) brightness(1.18)}\n      .pet[data-variant="cream"] .sprite{filter:sepia(.38) saturate(.68) brightness(1.12)}\n      .pet[data-variant="midnight"] .sprite{filter:grayscale(1) brightness(.62) contrast(1.22)}
      .pet.idle .sprite{animation:none!important}
      .pet.walk .sprite{animation:none!important}
      .pet.typing .sprite{animation:typeBob .24s ease-in-out infinite alternate}
      .pet.happy .sprite{animation:none!important;transform:scale(1.10);transform-origin:center bottom}
      .pet.idle,.pet.walk,.pet.happy{animation:none!important}
      .pet .sprite{object-position:center bottom}
      /* Dusty landing cloud: soft, earthy particles rather than bright grinder sparks. */
      .impact.ground .pixel{border-radius:50%;box-shadow:none;filter:blur(.7px);opacity:.65}
      .impact .dust-puff{position:absolute;left:0;top:0;display:block;width:var(--sz);height:var(--sz);border-radius:50%;background:var(--dust);opacity:0;filter:blur(2.5px);transform:translate(-50%,-50%);animation:dustPuff 850ms ease-out forwards}
      @keyframes dustPuff{0%{opacity:0;transform:translate(-50%,-50%) scale(.45)}20%{opacity:.38}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.65)}}
      /* Keep the regular cat planted; the supplied sprite animations provide the expression. */
      .pet .sprite{animation:none!important}
      .pet .keyboard{animation:none!important}
      .pet.sad .sprite{animation:none!important;transform:none!important}
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
      .bubble{position:absolute;left:50%;right:auto;bottom:calc(100% - 24px);transform:translateX(-50%);box-sizing:border-box;display:block;padding:clamp(5px,calc(7px * var(--bubble-scale,1)),11px) clamp(8px,calc(11px * var(--bubble-scale,1)),16px);border:2px solid #9c5a2d;border-radius:13px;background:#fff8e9;color:#3d291b;font:800 clamp(11px,calc(12px * min(var(--bubble-scale,1),1.2)),14px)/1.25 system-ui,sans-serif;white-space:normal;width:max-content;min-width:0;max-width:min(240px,calc(100vw - 20px));overflow-wrap:break-word;word-break:normal;text-align:center;opacity:0;transition:opacity .16s;pointer-events:none;filter:drop-shadow(0 2px 2px #0002)}
      .bubble{left:var(--bubble-left,50%);bottom:calc(100% + 9px);transform:translateX(0);max-width:min(240px,calc(100vw - 24px));}
      .bubble:before{content:"";position:absolute;left:var(--bubble-tail,50%);transform:translateX(-50%);bottom:-10px;border-width:9px 8px 0 8px;border-style:solid;border-color:#9c5a2d transparent transparent transparent}
      .bubble:after{content:"";position:absolute;left:var(--bubble-tail,50%);transform:translateX(-50%);bottom:-7px;border-width:7px 6px 0 6px;border-style:solid;border-color:#fff8e9 transparent transparent transparent}
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
    css.textContent += `
      .cat-dvd-screen{position:fixed;inset:0;background:#050505;z-index:2147483647;display:none;pointer-events:auto;overflow:hidden;cursor:none}
      .cat-dvd-screen.active{display:block}
      .cat-dvd-screen img{position:absolute;width:clamp(110px,22vw,220px);height:auto;object-fit:contain;image-rendering:pixelated;left:0;top:0;pointer-events:none}
      .egg-intro{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;pointer-events:none;overflow:hidden}
      .egg-intro img{width:clamp(112px,18vw,176px);height:auto;object-fit:contain;image-rendering:pixelated;animation:eggDrop .78s cubic-bezier(.22,.8,.25,1.15) both}
      @keyframes eggDrop{0%{transform:translateY(-110vh) rotate(-12deg)}72%{transform:translateY(10px) rotate(4deg)}86%{transform:translateY(-5px) rotate(-2deg)}100%{transform:translateY(0) rotate(0)}}
    `;
    const dvdScreen=document.createElement("div");dvdScreen.className="cat-dvd-screen";
    const dvdCat=document.createElement("img");dvdCat.src=chrome.runtime.getURL("assets/screensaver/dvd-cat.gif");dvdCat.alt="Lil Companion screensaver";
    dvdScreen.appendChild(dvdCat);root.appendChild(dvdScreen);
    let screensaverEnabled=true,lastActivity=Date.now(),dvdX=80,dvdY=80,dvdVX=2.5,dvdVY=1.9,dvdFrame=0;
    function wakeScreensaver(){lastActivity=Date.now();dvdScreen.classList.remove("active");}
    function startScreensaver(){if(!screensaverEnabled||insideHouse||dragging)return;dvdScreen.classList.add("active");}
    function dvdLoop(){
      if(dvdScreen.classList.contains("active")){
        const w=dvdScreen.clientWidth,h=dvdScreen.clientHeight;
        const r=dvdCat.getBoundingClientRect(),cw=r.width||180,ch=r.height||180;
        dvdX+=dvdVX;dvdY+=dvdVY;
        if(dvdX<=0||dvdX+cw>=w)dvdVX*=-1;
        if(dvdY<=0||dvdY+ch>=h)dvdVY*=-1;
        dvdX=Math.max(0,Math.min(w-cw,dvdX));dvdY=Math.max(0,Math.min(h-ch,dvdY));
        dvdCat.style.left=dvdX+"px";dvdCat.style.top=dvdY+"px";
      } else if(screensaverEnabled&&Date.now()-lastActivity>=300000){startScreensaver();}
      requestAnimationFrame(dvdLoop);
    }
    const dvdKeys=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];let dvdKeyIndex=0;
    const activity=()=>{if(dvdScreen.classList.contains("active"))wakeScreensaver();else lastActivity=Date.now();};
    ["pointerdown","pointermove","keydown","wheel","touchstart"].forEach(ev=>document.addEventListener(ev,activity,{capture:true,passive:true}));
    document.addEventListener("keydown",e=>{
      const k=e.key.length===1?e.key.toLowerCase():e.key;
      if(k===dvdKeys[dvdKeyIndex])dvdKeyIndex++;else dvdKeyIndex=(k===dvdKeys[0]?1:0);
      if(dvdKeyIndex===dvdKeys.length){dvdKeyIndex=0;lastActivity=0;startScreensaver();}
    },true);
    dvdScreen.addEventListener("click",wakeScreensaver);
    chrome.storage.local.get({screensaverEnabled:true},s=>{screensaverEnabled=!!s.screensaverEnabled;});
    requestAnimationFrame(dvdLoop);
    const pet=document.createElement("div");
    pet.className="pet idle";
    pet.innerHTML=`<div class="bubble"></div><img class="sprite" draggable="false" alt="Pixel cat">`;
    root.appendChild(pet);
    pet.style.display="none";
    // One-time page-load hatch: egg drops into the centre, cracks, and reveals the kitten.
    const eggIntro=document.createElement("div");eggIntro.className="egg-intro";eggIntro.style.display="none";
    const eggImg=document.createElement("img");eggImg.src=chrome.runtime.getURL("assets/intro/egg-hatch.webp");eggImg.alt="A pixel egg hatching into the orange kitten";
    eggIntro.appendChild(eggImg);root.appendChild(eggIntro);
    pet.style.opacity="1";
    let ownsCat=false;
    function activateCat(showIntro=false){
      ownsCat=true;insideHouse=false;foodBowl.style.display="";
      catHouse.src=chrome.runtime.getURL("assets/home/cat-house.png");
      catHouse.alt="Cat house — click to let the cat go inside";
      pet.style.display="";
      if(showIntro){
        pet.style.opacity="0";eggIntro.style.display="flex";
        const finishHatch=()=>{eggIntro.style.display="none";pet.style.opacity="1";};
        eggImg.onanimationend=()=>setTimeout(finishHatch,520);
        setTimeout(finishHatch,1900);
      }else{
        eggIntro.style.display="none";pet.style.opacity="1";
        const fromLeft=Math.random()<.5;
        x=fromLeft?-petScale:innerWidth+petScale;
        y=floorY();targetX=Math.max(12,Math.min(innerWidth-petScale,innerWidth*.5-petScale*.5));
        facing=fromLeft?1:-1;flip();place();setMode("walk");
      }
    }
    function deactivateCat(){
      ownsCat=false;insideHouse=false;
      pet.style.display="none";eggIntro.style.display="none";
      foodBowl.style.display="";
      catHouse.src=chrome.runtime.getURL("assets/home/cat-house.png");
      catHouse.alt="Click the house to call the cat to this tab";
      bubble.classList.remove("show");
    }
    chrome.runtime.onMessage.addListener(message=>{
      if(message?.type==="lil-cat-activate")activateCat(!!message.showIntro);
      if(message?.type==="lil-cat-deactivate")deactivateCat();
      if(message?.type==="lil-cat-try-claim"){
        chrome.runtime.sendMessage({type:"lil-cat-register"},response=>{
          if(!chrome.runtime.lastError&&response?.owner)activateCat(!!response.showIntro);
        });
      }
    });
    chrome.runtime.sendMessage({type:"lil-cat-register"},response=>{
      if(chrome.runtime.lastError)return;
      if(response?.owner)activateCat(!!response.showIntro);
      else deactivateCat();
    });
    const foodBowl=document.createElement("img");
    foodBowl.className="food-bowl";
    foodBowl.src=chrome.runtime.getURL("assets/food/cat-food-bowl.png");
    foodBowl.alt="Cat food bowl";
    foodBowl.draggable=false;
    root.appendChild(foodBowl);
    const catHouse=document.createElement("img");
    catHouse.className="cat-house";
    catHouse.src=chrome.runtime.getURL("assets/home/cat-house.png");
    catHouse.alt="Cat house — click to let the cat go inside";
    catHouse.draggable=false;
    root.appendChild(catHouse);
    const impactLayer=document.createElement("div");
    impactLayer.className="impact-layer";
    root.appendChild(impactLayer);
    const img=pet.querySelector(".sprite"),bubble=pet.querySelector(".bubble");
    const assets={orange:"assets/cats/cat-orange.png",street:"assets/cats/street.png",cream:"assets/cats/cream.png",black:"assets/cats/black.png",white:"assets/cats/white.png",emo:"assets/cats/emo.png",sad:"assets/cats/sad.png",angry:"assets/cats/angry.png",happy:"assets/cats/happy.png",love:"assets/cats/love.png",dizzy:"assets/cats/dizzy.png",typing:"assets/cats/typing.png",sleep:"assets/cats/sleep.png",music:"assets/cats/headphones.png",orangeWalk:"assets/cats/orange-walk.webp",orangeIdle:"assets/cats/orange-idle.gif",orangeAngry:"assets/cats/orange-angry.gif",orangeHappy:"assets/cats/orange-happy.gif",orangeSleep:"assets/cats/orange-sleep.gif",orangeTyping:"assets/cats/orange-typing.gif",orangeDizzy:"assets/cats/orange-dizzy.gif",orangeMusic:"assets/cats/orange-music.webp",orangeSad:"assets/cats/orange-crying.webp",orangeEating:"assets/cats/orange-eating.webp",emoIdle:"assets/cats/emo.png",emoDizzy:"assets/cats/emo-dizzy.png",emoMusic:"assets/cats/emo-music.png",emoTyping:"assets/cats/emo-typing.png",emoSad:"assets/cats/emo-sad.png",emoAngry:"assets/cats/emo-angry.png",emoSleep:"assets/cats/emo-sleep.png"};
    let liteMode=false, variant=(initialVariant==="emo"?"orange":initialVariant), x=Math.max(8,(innerWidth-88)/2), y=Math.max(8,innerHeight-88);
    let targetX=x, targetY=innerHeight-88, mode="idle", dragging=false, offsetX=0, offsetY=0, typingTimer=0, audioPlaying=false;
    let lastThink=performance.now(), nextWalk=performance.now()+6500+Math.random()*3500, nextChatAt=performance.now()+9000, facing=1, catName=initialName||"Mochi", wanderEnabled=true, followMouse=initialFollowMouse, mouseX=x+44, mouseY=y+44, petScale=88, moveSpeed=2.5, bubbleScale=Number(initialBubbleScale)||1, lastInteraction=performance.now(), sleeping=false, sleepStartedAt=0, hungry=false, goingToFood=false, eating=false, nextHungryAt=performance.now()+65000, foodX=22, foodY=innerHeight-58, bowlDragging=false, bowlPointerOffset={x:0,y:0}, insideHouse=false, randomMoodActive=false, randomMoodUntil=0, nextRandomMoodAt=performance.now()+35000+Math.random()*15000, nextGroomAt=performance.now()+45000+Math.random()*35000;
    pet.style.setProperty("--bubble-scale",bubbleScale);
    pet.dataset.variant=variant;pet.classList.toggle("emo",variant==="emo");
    const chats={normal:["meow! 🐾","you got this!","need a tiny break?","i'm supervising 👀","this page is ours now","pspsps...","remember to stretch!","i believe in you ✨","one more tab? really?","tiny paws, big plans"],pet:["purrrrr ❤️","best human ever","again again!! 💕","that tickles!"],emo:["uh, meow ig","where da milk at?","hail dinga","milk is for cats","...","whatever.","i'm fine. (not really)","the void is calling 🖤","don't talk to me before my playlist","it's not a phase.","sad songs hit harder at 2am","brb staring out the window","everything is temporary. even this tab.","🖤 🥀 🖤"],emoPet:["uh, meow ig","where da milk at?","hail dinga","milk is for cats","...okay, that was kinda nice.","don't tell anyone i liked that.","🖤","you can stay, i guess."]};
    const pick=a=>a[Math.floor(Math.random()*a.length)];
    const say=(t,ms=2400)=>{bubble.textContent=t;bubble.classList.add("show");requestAnimationFrame(place);clearTimeout(say.timer);say.timer=setTimeout(()=>bubble.classList.remove("show"),ms)};
    const chat=(kind="normal")=>say(pick(variant==="emo"?(kind==="pet"?chats.emoPet:chats.emo):(chats[kind]||chats.normal)));
    function assetFor(state){
      if(state==="eating") return "orangeEating";
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
      if(state==="typing") return "orangeTyping";
      if(state==="music") return "orangeMusic";
      if(state==="angry") return "orangeAngry";
      if(state==="dizzy") return "orangeDizzy";
      if(state==="sleep") return "orangeSleep";
      if(state==="happy"||state==="love") return "orangeHappy";
      if(state==="idle") return "orangeIdle";
      if(state==="sad") return "orangeSad";
      return variant;
    }
    function updateImage(state="idle"){
      if(groomingActive)return;
      img.classList.remove("typing-art","walking-art");
      const selectedAsset=(variant==="orange"&&state==="walk")?"orangeWalk":assetFor(state);
      if(variant==="orange"&&state==="walk"&&!liteMode)img.classList.add("walking-art");
      if(liteMode){
        // Lite mode uses the original expressive PNG sprites, not one repeated face.
        const liteSprites={
          idle:"cat-orange.png",walk:"cat-orange.png",happy:"happy.png",love:"love.png",
          angry:"angry.png",sad:"sad.png",dizzy:"dizzy.png",sleep:"sleep.png",
          typing:"typing.png",music:"headphones.png",eating:"../lite/eating.png"
        };
        img.src=chrome.runtime.getURL("assets/cats/"+(liteSprites[state]||"cat-orange.png"));
      }else{
        img.src=chrome.runtime.getURL(assets[selectedAsset]||assets.orange);
      }
      img.onerror=()=>{img.onerror=null;img.src=chrome.runtime.getURL("assets/cats/cat-orange.png");};
    }
    let groomingTimer=null,groomingActive=false;
    function playGrooming(){
      if(!ownsCat||insideHouse||eating||dragging||physicsActive||sleeping||mode!=="idle")return;
      clearTimeout(groomingTimer);groomingActive=true;pet.classList.add("grooming");
      img.src=chrome.runtime.getURL("assets/cats/orange-grooming.webp");
      groomingTimer=setTimeout(()=>{
        groomingActive=false;pet.classList.remove("grooming");
        if(!insideHouse&&!eating)updateImage(mode);
      },2300);
    }
    function setMode(m){
      if(groomingActive&&m!=="idle")return;
      if(eating && m!=="eating"){
        clearTimeout(foodEatTimer);
        clearTimeout(say.timer);
        bubble.classList.remove("show");
        eating=false;
        goingToFood=false;
        foodBowl.style.display="";
      }
      mode=m;pet.classList.remove("idle","walk","typing","happy","sad","angry","dizzy","sleep","drag","eating");
      pet.classList.add(m);pet.classList.toggle("emo",variant==="emo");
      updateImage(m);
    }
    function place(){
      x=Math.max(0,Math.min(innerWidth-petScale,x));y=Math.max(0,Math.min(innerHeight-petScale,y));
      pet.style.left=x+"px";pet.style.top=y+"px";
      const bubbleWidth=bubble.offsetWidth||180;
      const center=x+petScale/2;
      const bubbleLeft=Math.max(12,Math.min(innerWidth-bubbleWidth-12,center-bubbleWidth/2));
      bubble.style.setProperty("--bubble-left",(bubbleLeft-x)+"px");
      bubble.style.setProperty("--bubble-tail",(center-bubbleLeft)+"px");
    }
    function flip(){
      // Flip only the sprite, never the bubble or accessories/text.
      img.style.scale=facing<0?"-1 1":"1 1";
    }
    function wander(){
      if(dragging||pet.classList.contains("is-typing")||audioPlaying)return;
      // Tiny occasional repositioning only: stay close to the current spot.
      const drift=(Math.random()<.5?-1:1)*(48+Math.random()*78);
      targetX=Math.max(8,Math.min(innerWidth-petScale-8,x+drift));
      if(Math.abs(targetX-x)<18){nextWalk=performance.now()+9000+Math.random()*6000;return;}
      facing=targetX<x?-1:1;flip();setMode("walk");
    }
    function placeBowl(){
      foodX=Math.max(4,Math.min(innerWidth-52,foodX));
      foodY=innerHeight-36;
      foodBowl.style.left=foodX+"px";foodBowl.style.top="auto";foodBowl.style.bottom="0px";
    }
    // Free-position hut with vertical gravity, but no rotation or rolling.
    const HOUSE_W=124,HOUSE_H=100;
    let houseX=Math.max(4,innerWidth-HOUSE_W-12),houseY=innerHeight-HOUSE_H,houseDragging=false,houseMoved=false,
        houseOffsetX=0,houseOffsetY=0,houseStartX=0,houseStartY=0,houseFallVelocity=0,houseFallFrame=0;
    function placeHouse(){
      houseX=Math.max(0,Math.min(innerWidth-HOUSE_W,houseX));
      houseY=Math.max(0,Math.min(innerHeight-HOUSE_H,houseY));
      catHouse.style.left=houseX+"px";catHouse.style.top=houseY+"px";
      catHouse.style.right="auto";catHouse.style.bottom="auto";
    }
    function savePropPositions(){
      chrome.storage.local.set({lilPropPositions:{
        bowlX:foodX/Math.max(1,innerWidth),
        houseX:houseX/Math.max(1,innerWidth),
        houseY:houseY/Math.max(1,innerHeight)
      }});
    }
    function startHouseFall(){
      cancelAnimationFrame(houseFallFrame);houseFallVelocity=0;
      const tick=()=>{
        if(houseDragging)return;
        houseFallVelocity=Math.min(18,houseFallVelocity+0.72);
        houseY+=houseFallVelocity;
        if(houseY>=innerHeight-HOUSE_H){houseY=innerHeight-HOUSE_H;placeHouse();savePropPositions();return;}
        placeHouse();houseFallFrame=requestAnimationFrame(tick);
      };
      houseFallFrame=requestAnimationFrame(tick);
    }
    chrome.storage.local.get({lilPropPositions:null},data=>{
      const pos=data.lilPropPositions;if(!pos)return;
      if(Number.isFinite(pos.bowlX))foodX=pos.bowlX*innerWidth;
      if(Number.isFinite(pos.houseX))houseX=pos.houseX*innerWidth;
      if(Number.isFinite(pos.houseY))houseY=pos.houseY*innerHeight;
      placeBowl();placeHouse();
      if(houseY<innerHeight-HOUSE_H-2)startHouseFall();
    });
    chrome.storage.onChanged.addListener((changes,area)=>{
      if(area!=="local"||!changes.lilPropPositions||houseDragging||bowlDragging)return;
      const pos=changes.lilPropPositions.newValue;if(!pos)return;
      if(Number.isFinite(pos.bowlX))foodX=pos.bowlX*innerWidth;
      if(Number.isFinite(pos.houseX))houseX=pos.houseX*innerWidth;
      if(Number.isFinite(pos.houseY))houseY=pos.houseY*innerHeight;
      placeBowl();placeHouse();
      if(houseY<innerHeight-HOUSE_H-2)startHouseFall();
    });
    catHouse.addEventListener("pointerdown",e=>{
      houseDragging=true;houseMoved=false;cancelAnimationFrame(houseFallFrame);houseFallVelocity=0;
      houseStartX=e.clientX;houseStartY=e.clientY;
      houseOffsetX=e.clientX-houseX;houseOffsetY=e.clientY-houseY;
      catHouse.setPointerCapture(e.pointerId);e.preventDefault();
    });
    catHouse.addEventListener("pointermove",e=>{
      if(!houseDragging)return;
      if(Math.hypot(e.clientX-houseStartX,e.clientY-houseStartY)>5)houseMoved=true;
      houseX=e.clientX-houseOffsetX;houseY=e.clientY-houseOffsetY;placeHouse();
    });
    catHouse.addEventListener("pointerup",()=>{
      if(!houseDragging)return;
      houseDragging=false;
      if(houseMoved){
        catHouse.dataset.justDragged="1";setTimeout(()=>delete catHouse.dataset.justDragged,220);
        if(insideHouse){
          insideHouse=false;
          catHouse.src=chrome.runtime.getURL("assets/home/cat-house.png");
          pet.style.display="";
          x=Math.max(0,Math.min(innerWidth-petScale,houseX+20));
          y=Math.max(0,houseY-petScale+12);targetX=x;targetY=floorY();
          releaseVX=0.8;releaseVY=1.5;angularVelocity=0;ragdollAngle=0;img.style.rotate="0deg";
          setMode("dizzy");place();say("HEY!! THE HOUSE MOVED! 😵",1800);startPhysics();
        }
        savePropPositions();startHouseFall();
      }
    });
    catHouse.addEventListener("pointercancel",()=>{
      if(houseDragging){houseDragging=false;savePropPositions();startHouseFall();}
    });
    placeHouse();

    function leaveHouse(){
      if(!insideHouse)return;
      insideHouse=false;
      catHouse.src=chrome.runtime.getURL("assets/home/cat-house.png");
      pet.style.display="";
      x=Math.max(8,innerWidth-petScale-172);
      y=floorY();targetX=x;targetY=y;
      setMode("idle");place();
      lastInteraction=performance.now();
      nextWalk=lastInteraction+9000+Math.random()*5000;
      say(pick(variant==="emo"?["...i needed some air. 🥀","the outside world is still disappointing.","i have returned. 🖤"]:["I'm back! 🐾","did you miss me?","what did i miss?","home is where the snacks are."]),2200);
    }
    catHouse.addEventListener("click",()=>{
      if(catHouse.dataset.justDragged==="1")return;
      if(!ownsCat){
        chrome.runtime.sendMessage({type:"lil-cat-summon"});
        return;
      }
      if(insideHouse){leaveHouse();return;}
      if(dragging||physicsActive)return;
      insideHouse=true;
      say(pick(["home sweet home. 🏠","do not disturb. zzz...","finally, some peace.","brb, cat things."]),2200);
      clearTimeout(foodEatTimer);clearTimeout(say.timer);bubble.classList.remove("show");
      eating=false;goingToFood=false;hungry=false;foodBowl.style.display="";
      physicsActive=false;releaseVX=0;releaseVY=0;angularVelocity=0;ragdollAngle=0;
      pet.style.display="none";
      bubble.classList.remove("show");
      catHouse.src=chrome.runtime.getURL("assets/home/cat-house-sleeping.webp");
      catHouse.alt="Cat is inside its house — click to let it out";
    });
    function goToFood(){
      if(insideHouse)leaveHouse();
      if(dragging||sleeping)return;
      hungry=true;goingToFood=true;eating=false;
      targetX=Math.max(0,Math.min(innerWidth-petScale,foodX+23-petScale/2));
      targetY=floorY();
      facing=targetX<x?-1:1;flip();setMode("walk");
      say(variant==="emo"?"...is that food? 🥀":"food time!! 🍗",2200);
    }
    let foodEatTimer=null,bowlDragStart=null;
    foodBowl.addEventListener("pointerdown",e=>{
      bowlDragging=true;bowlDragStart={x:e.clientX,y:e.clientY};
      const r=foodBowl.getBoundingClientRect();bowlPointerOffset={x:e.clientX-r.left,y:e.clientY-r.top};
      foodBowl.setPointerCapture(e.pointerId);e.preventDefault();
    });
    foodBowl.addEventListener("pointermove",e=>{
      if(!bowlDragging)return;
      foodX=e.clientX-bowlPointerOffset.x;placeBowl();
    });
    foodBowl.addEventListener("pointerup",e=>{
      if(!bowlDragging)return;
      const moved=bowlDragStart&&Math.hypot(e.clientX-bowlDragStart.x,e.clientY-bowlDragStart.y)>7;
      bowlDragging=false;bowlDragStart=null;
      if(moved)savePropPositions();
      if(!moved){hungry=true;goToFood();}
    });
    foodBowl.addEventListener("pointercancel",()=>{bowlDragging=false;bowlDragStart=null;});
    placeBowl();
    window.addEventListener("resize",()=>{place();placeBowl();placeHouse();},{passive:true});
    document.addEventListener("pointermove",e=>{
      if(!followMouse||dragging)return;
      mouseX=e.clientX;mouseY=e.clientY;
    },{passive:true});
    function loop(now){
      const dt=Math.min(40,now-lastThink);lastThink=now;
      if(insideHouse){requestAnimationFrame(loop);return;}
      // Keep the eating sprite visible for the full meal duration in BOTH
      // normal wandering and mouse-follow modes. No movement/mood logic may
      // replace the eating state until its 10-second timer completes.
      if(eating||groomingActive){requestAnimationFrame(loop);return;}
      // Random personality moments: after each emotion, return to normal for 15 seconds.
      if(randomMoodActive && now>=randomMoodUntil){
        randomMoodActive=false;
        if(!dragging&&!sleeping&&!audioPlaying&&!pet.classList.contains("is-typing"))setMode("idle");
        nextRandomMoodAt=now+15000;
      }
      const canHaveRandomMood=!randomMoodActive && now>=nextRandomMoodAt &&
        mode==="idle" && !dragging && !sleeping && !physicsActive && !goingToFood &&
        !eating && !audioPlaying && !pet.classList.contains("is-typing") && !followMouse;
      if(canHaveRandomMood){
        const mood=pick(["happy","sad","angry","bored"]);
        randomMoodActive=true;
        const duration=mood==="sad"?5600:4600;
        randomMoodUntil=now+duration;
        if(mood==="bored"){
          setMode("idle");
          say(variant==="emo"?"bored. existing, as usual. 🥀":"hmm... kinda bored. entertain me? 🐾",duration);
        }else{
          setMode(mood);
          const lines={
            happy:variant==="emo"?"...okay. life is kinda nice. 🖤":"YIPPEE!! just felt happy! 💖",
            sad:variant==="emo"?"the void is extra void today. 🥀":"aw... feeling a little sad. 🥺",
            angry:variant==="emo"?"everything is annoying. 🖤":"WHO moved my nap spot?! 😾"
          };
          say(lines[mood],duration);
        }
      }
      if(mode==="idle"&&!randomMoodActive&&!sleeping&&!dragging&&!audioPlaying&&!pet.classList.contains("is-typing")&&now-lastInteraction>28000){
        sleeping=true;sleepStartedAt=now;setMode("sleep");say("Zzz... 💤",2600);
      }
      if(sleeping&&now-sleepStartedAt>60000&&!dragging){
        sleeping=false;lastInteraction=now;setMode("idle");say(variant==="emo"?"ugh... morning already? 🥀":"*yawns* i'm awake!",2200);
        nextWalk=now+24000;
      }
      if(followMouse&&!goingToFood&&!eating&&!dragging&&!sleeping&&!audioPlaying&&!pet.classList.contains("is-typing")){
        // Mouse-follow is horizontal only: the cat stays planted on the page floor.
        targetX=Math.max(0,Math.min(innerWidth-petScale,mouseX-petScale/2));
        targetY=floorY();
        y=floorY();
        const dx=targetX-x,distance=Math.abs(dx);
        if(distance>3){
          // This sprite's default art faces left, so mirror it when travelling right.
          const nextFacing=dx>0?1:-1;
          if(facing!==nextFacing){facing=nextFacing;flip();}
          if(mode!=="walk")setMode("walk");
          const step=Math.min(distance,dt*.075*moveSpeed);
          x+=Math.sign(dx)*step;
          place();
        } else if(mode==="walk"){setMode("idle");}
      } else if(mode==="walk"&&!dragging&&!pet.classList.contains("is-typing")&&!audioPlaying){
        const dx=targetX-x,dy=innerHeight-petScale-y;
        const distance=Math.hypot(dx,dy),step=Math.min(distance,dt*.035*moveSpeed);
        if(distance>0.5){x+=dx/distance*step;y+=dy/distance*step;place();}
        if(distance<2){
          if(goingToFood){
            const bowlCenter=foodX+23;
            const catCenter=x+petScale/2;
            const groundY=innerHeight-petScale;
            if(Math.abs(catCenter-bowlCenter)>38 || Math.abs(y-groundY)>3){
              targetX=Math.max(0,Math.min(innerWidth-petScale,bowlCenter-petScale/2));
              targetY=groundY;
              requestAnimationFrame(loop);return;
            }
            goingToFood=false;eating=true;hungry=false;foodBowl.style.display="none";setMode("eating");say(variant==="emo"?"...fine. this is good. 🖤":"nom nom nom! 😋",10000);
            clearTimeout(foodEatTimer);foodEatTimer=setTimeout(()=>{
              eating=false;foodBowl.style.display="";
              if(!dragging&&!insideHouse){setMode("idle");say(variant==="emo"?"i have regained 2% energy. 🥀":"all done! that was delicious! 😸",2200);setTimeout(playGrooming,500);}
              nextWalk=performance.now()+8500+Math.random()*6000;
            },10000);
          } else {
            setMode("idle");nextWalk=now+8500+Math.random()*6500;if(Math.random()<.34)chat();
          }
        }
      }
      if(!randomMoodActive&&now>=nextHungryAt&&!hungry&&!eating&&!sleeping&&!dragging&&mode==="idle"){
        hungry=true;goToFood();nextHungryAt=now+85000+Math.random()*25000;
      }
      if(!groomingActive&&now>=nextGroomAt&&mode==="idle"&&!eating&&!sleeping&&!dragging&&!physicsActive){playGrooming();nextGroomAt=now+55000+Math.random()*65000;}
      if(!randomMoodActive&&now>nextWalk&&mode==="idle"&&!sleeping&&!dragging&&!physicsActive&&wanderEnabled&&!followMouse&&!pet.classList.contains("is-typing")&&!audioPlaying&&!eating)wander();
      if(!randomMoodActive&&now>nextChatAt&&mode==="idle"&&!sleeping&&!dragging&&!physicsActive&&!audioPlaying&&!pet.classList.contains("is-typing")){
        chat();nextChatAt=now+22000+Math.random()*18000;
      }
      requestAnimationFrame(loop);
    }
    let dragStartedAt=0, maxLift=0, gotAirborne=false, suppressNextClick=false;
    let previousPointer=null, releaseVX=0, releaseVY=0, physicsActive=false, dizzyTimer=null, pointerStart=null, didDrag=false, ragdollAngle=0, angularVelocity=0;
    const floorY=()=>Math.max(0,innerHeight-petScale);
    pet.addEventListener("pointerdown",e=>{
      lastInteraction=performance.now();
      if(sleeping){sleeping=false;setMode("idle");}
      goingToFood=false;dragging=true;physicsActive=false;dragStartedAt=performance.now();maxLift=0;gotAirborne=false;didDrag=false;
      pointerStart={x:e.clientX,y:e.clientY};
      previousPointer={x:e.clientX,y:e.clientY,t:performance.now()};
      pet.setPointerCapture(e.pointerId);offsetX=e.clientX-x;offsetY=e.clientY-y;setMode("drag");foodBowl.style.display="";
    });
    pet.addEventListener("pointermove",e=>{
      if(!dragging)return;
      const now=performance.now(), nx=e.clientX-offsetX, ny=e.clientY-offsetY;
      if(pointerStart && Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>7) didDrag=true;
      if(previousPointer){
        const elapsed=Math.max(8,now-previousPointer.t);
        const moveX=nx-x,moveY=ny-y;
        releaseVX=moveX/elapsed*16;
        releaseVY=moveY/elapsed*16;
        angularVelocity=Math.max(-18,Math.min(18,(moveX-moveY*.35)*.12));
        ragdollAngle+=angularVelocity;
        img.style.rotate=ragdollAngle+"deg";
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
      const dirt=["#8b5a35","#a66b3f","#b77b4b","#c58a55","#d2a16c","#755039","#9b704e"];
      const softWall=["#e7d8ca","#d7c7b9","#c8b8aa"];
      const colors=kind==="ground"?dirt:softWall;
      const count=kind==="ground"?44:9;
      for(let i=0;i<count;i++){
        const bit=document.createElement("i");
        bit.className="pixel";
        const angle=kind==="ground"?(Math.PI*1.08+Math.random()*(Math.PI*.84)):(Math.random()*Math.PI*2);
        const distance=(kind==="ground"?8:12)+Math.random()*(kind==="ground"?48:24)*strength;
        const dx=Math.cos(angle)*distance;
        const dy=kind==="ground"?-(3+Math.random()*(13+strength*9)):Math.sin(angle)*distance;
        bit.style.setProperty("--dx",Math.round(dx)+"px");
        bit.style.setProperty("--dy",Math.round(dy)+"px");
        bit.style.setProperty("--sz",(kind==="ground"?(4+Math.round(Math.random()*6)):(3+Math.round(Math.random()*3)))+"px");
        bit.style.setProperty("--dur",(kind==="ground"?650:420)+Math.round(Math.random()*420)+"ms");
        bit.style.setProperty("--dust",colors[Math.floor(Math.random()*colors.length)]);
        bit.style.opacity=kind==="ground"?(0.28+Math.random()*.48):"0.55";
        bit.style.animationDelay=(Math.random()*65)+"ms";
        fx.appendChild(bit);
      }
      if(kind==="ground"){
        // A few soft, low dust puffs make the landing read as dirt, not sparks.
        for(let i=0;i<4;i++){
          const puff=document.createElement("i");
          puff.className="dust-puff";
          puff.style.setProperty("--dx",Math.round((Math.random()-.5)*52)+"px");
          puff.style.setProperty("--dy",Math.round(-5-Math.random()*12)+"px");
          puff.style.setProperty("--sz",Math.round(13+Math.random()*15)+"px");
          puff.style.setProperty("--dust",dirt[Math.floor(Math.random()*dirt.length)]);
          puff.style.animationDelay=(i*35)+"ms";
          fx.appendChild(puff);
        }
      }
      impactLayer.appendChild(fx);
      setTimeout(()=>fx.remove(),kind==="ground"?1500:850);
    }
    function startPhysics(){
      physicsActive=true;
      let last=performance.now(), bounces=0;
      function frame(now){
        if(!physicsActive||dragging)return;
        const dt=Math.min(2,(now-last)/16.67);last=now;
        releaseVY+=0.72*dt;
        x+=releaseVX*dt;y+=releaseVY*dt;
        ragdollAngle+=angularVelocity*dt;
        angularVelocity*=Math.pow(.965,dt);
        img.style.rotate=ragdollAngle+"deg";
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
            const ceilingSpeed=Math.abs(releaseVY);
            if(ceilingSpeed>0.7)spawnImpact(x+petScale/2,4,"wall",Math.max(.8,Math.min(1.8,ceilingSpeed/5)));
            releaseVY=Math.max(2.2,ceilingSpeed*.62);
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
            img.style.rotate="0deg";ragdollAngle=0;angularVelocity=0;
            setMode("dizzy");say("whoaaa... 😵",1000);
            clearTimeout(pet.landingDizzyTimer);clearTimeout(pet.landingSadTimer);
            pet.landingDizzyTimer=setTimeout(()=>{
              if(!dragging&&!physicsActive&&!insideHouse){
                setMode("sad");say(variant==="emo"?"...that hurt. 🥀":"that was a rough landing... 🥺",1800);
                pet.landingSadTimer=setTimeout(()=>{
                  if(!dragging&&!physicsActive&&!insideHouse&&mode==="sad")setMode("idle");
                },1800);
              }
            },1000);
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
      if(didDrag){angularVelocity=Math.max(-16,Math.min(16,releaseVX*.8-releaseVY*.22));startPhysics();}
      else {physicsActive=false;setMode("idle");img.style.rotate="0deg";ragdollAngle=0;angularVelocity=0;}
      setTimeout(()=>{suppressNextClick=false;},180);
    }
    pet.addEventListener("pointerup",release);pet.addEventListener("pointercancel",release);
    let clickTimes=[], angryUntil=0;
    pet.addEventListener("click",()=>{
      if(dragging||suppressNextClick)return;
      const now=performance.now();lastInteraction=now;
      if(sleeping){sleeping=false;setMode("idle");}
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
        angryUntil=now+10000;
        setMode("angry");
        say(variant==="emo"?"I SAID I AM FINE. 🖤":"STOP POKING ME!! 😾");
        clearTimeout(pet.angerTimer);
        pet.angerTimer=setTimeout(()=>{
          if(!dragging&&mode==="angry")setMode("idle");
          angryUntil=0;
        },10000);
      } else {
        setMode(variant==="emo"?"happy":"love");
        say(variant==="emo"?pick(chats.emoPet):(clickTimes.length===1?pick(chats.pet):"MORE PETS PLEASE! 💕"));
        clearTimeout(pet.loveTimer);
        pet.loveTimer=setTimeout(()=>{if(!dragging&&(mode==="love"||mode==="happy"))setMode("idle");},2100);
      }
    });
    function onTyping(e){
      if(e.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;
      const el=e.target;
      if(!el)return;
      const tag=(el.tagName||"").toLowerCase();
      const editable=tag==="input"||tag==="textarea"||el.isContentEditable||el.getAttribute?.("role")==="textbox";
      if(!editable)return;
      lastInteraction=performance.now();
      if(sleeping||mode==="sleep"){sleeping=false;sleepStartedAt=0;setMode("idle");}
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
    chrome.storage.local.get({liteMode:false},settings=>{liteMode=!!settings.liteMode;updateImage(mode);});
    chrome.storage.onChanged.addListener((changes,area)=>{
      if(area!=="local")return;
      if(changes.variant){variant=changes.variant.newValue||"orange";pet.dataset.variant=variant;pet.classList.toggle("emo",variant==="emo");updateImage(mode);say(variant==="emo"?"welcome to the dark side 🥀":"new look! cute, right? ✨",2200);}
      if(changes.catName){catName=changes.catName.newValue||"Mochi";}
      if(changes.liteMode){
        liteMode=!!changes.liteMode.newValue;
        updateImage(mode);
      }
      if(changes.wanderEnabled){wanderEnabled=!!changes.wanderEnabled.newValue;}
      if(changes.followMouse){
        followMouse=!!changes.followMouse.newValue;
        if(followMouse){wanderEnabled=false;y=floorY();targetY=floorY();setMode("walk");place();}
        else {targetX=x;targetY=innerHeight-petScale;setMode("idle");}
      }
      if(changes.moodAction&&changes.moodAction.newValue){
        const mood=changes.moodAction.newValue.mood;
        randomMoodActive=false;nextRandomMoodAt=performance.now()+30000;
        if(["happy","angry","sad","dizzy","typing","music","sleep","idle"].includes(mood)){
          sleeping=mood==="sleep";if(sleeping)sleepStartedAt=performance.now();
          setMode(mood);say(({happy:"YAY!! 💖",angry:"HEY!! 😾",sad:"...oh.",dizzy:"whoa... 💫",typing:"tiny paws at work ⌨️",music:"vibing... 🎧",sleep:"Zzz... 💤",idle:"back to chilling."})[mood],2400);
          clearTimeout(pet.menuMoodTimer);
          if(mood!=="sleep"&&mood!=="idle")pet.menuMoodTimer=setTimeout(()=>{if(!dragging&&mode===mood){setMode("idle");}},mood==="sad"?6500:5000);
        }
      }
      if(changes.petScale){petScale=Number(changes.petScale.newValue)||64;pet.style.width=petScale+"px";pet.style.height=petScale+"px";place();}
      if(changes.bubbleScale){bubbleScale=Number(changes.bubbleScale.newValue)||1;pet.style.setProperty("--bubble-scale",bubbleScale);}
      // Walking speed is intentionally fixed at 2.5×; no per-user speed setting.
      if(changes.screensaverEnabled){screensaverEnabled=!!changes.screensaverEnabled.newValue;if(!screensaverEnabled)dvdScreen.classList.remove("active");lastActivity=Date.now();}
      if(changes.screensaverTrigger&&screensaverEnabled){lastActivity=0;startScreensaver();}
      if(changes.enabled&&changes.enabled.newValue===false)host.remove();
    });
    updateImage("idle");place();requestAnimationFrame(loop);
    setTimeout(()=>say(variant==="emo"?"I AM A CAR.":"I AM A CAR.",2600),900);
    mediaCheck();
  }
})();
