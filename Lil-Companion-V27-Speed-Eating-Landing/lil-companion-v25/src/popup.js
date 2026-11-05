const $=id=>document.getElementById(id);
const enabled=$("enabled"),wander=$("wander"),followMouse=$("followMouse"),nameInput=$("catName"),size=$("size"),bubbleSize=$("bubbleSize"),speed=$("speed");
const buttons=[...document.querySelectorAll(".variant")];
const variantFiles={
 orange:"../assets/cats/cat-orange.png", street:"../assets/cats/street.png", cream:"../assets/cats/cream.png",
 black:"../assets/cats/black.png", white:"../assets/cats/white.png", emo:"../assets/cats/emo.png"
};
const moods={
 idle:["../assets/cats/cat-orange.png","♡","Just vibing."],
 happy:["../assets/cats/happy.png","💖","Very happy!!"],
 angry:["../assets/cats/angry.png","💢","Not amused. Do not boop."],
 sad:["../assets/cats/sad.png","💧","A little emotional right now."],
 dizzy:["../assets/cats/dizzy.png","💫","The room is spinning!"],
 typing:["../assets/cats/typing.png","⌨️","Helping you get that code done."],
 music:["../assets/cats/headphones.png","🎵","Headphones on. Vibing to music."],
 sleep:["../assets/cats/sleep.png","💤","Tiny nap time. Zzz..."]
};
let selectedVariant="orange", selectedMood="idle", emoUnlocked=false;
function setPreview(mood){
 selectedMood=mood;
 const [src,icon,caption]=moods[mood];
 const emoMoods={idle:"../assets/cats/emo.png",happy:"../assets/cats/emo.png",angry:"../assets/cats/emo-angry.png",sad:"../assets/cats/emo-sad.png",dizzy:"../assets/cats/emo-dizzy.png",typing:"../assets/cats/emo-typing.png",music:"../assets/cats/emo-music.png",sleep:"../assets/cats/emo-sleep.png"};
 $("preview").src=selectedVariant==="emo" ? emoMoods[mood] : (selectedVariant==="orange" && mood==="sad" ? "../assets/cats/orange-crying.webp" : (mood==="idle" ? variantFiles[selectedVariant] : src));
 $("preview-mood").textContent=selectedVariant==="emo"?"🖤":icon;
 $("preview-caption").textContent=selectedVariant==="emo"?"too tired to pretend.":caption;
 document.querySelectorAll(".mood-btn").forEach(b=>b.classList.toggle("active",b.id==="preview-"+mood));
}
function applyVariant(v){
 selectedVariant=v;
 chrome.storage.local.set({variant:v,enabled:true});
 enabled.checked=true;
 buttons.forEach(x=>x.classList.toggle("active",x.dataset.variant===v));
 setPreview(selectedMood);
}
chrome.storage.local.get({enabled:true,variant:"orange",catName:"Mochi",wanderEnabled:true,followMouse:false,petScale:88,bubbleScale:1,moveSpeed:1,emoUnlocked:false},s=>{
 enabled.checked=s.enabled;wander.checked=s.wanderEnabled;followMouse.checked=!!s.followMouse;
 nameInput.value=s.catName;size.value=(Number(s.petScale)<=64?88:s.petScale);bubbleSize.value=s.bubbleScale;speed.value=s.moveSpeed||1;
 $("speed-label").textContent=(Number(speed.value)<=0.9?"Slow":Number(speed.value)>=1.8?"Fast":"Normal")+" · "+Number(speed.value).toFixed(1)+"×";
 if(Number(s.petScale)<=64) chrome.storage.local.set({petScale:88});
 $("bubble-label").textContent=(s.bubbleScale<=1?"Normal":s.bubbleScale<1.5?"Large":"Extra large")+" · "+Number(s.bubbleScale).toFixed(1)+"×";
 $("size-label").textContent=(size.value<=60?"Tiny":size.value<=76?"Small":"Medium")+" · "+size.value+"px";
 emoUnlocked=!!s.emoUnlocked;
 $("secret-section").hidden=!emoUnlocked;
 selectedVariant=s.variant;
 buttons.forEach(b=>b.classList.toggle("active",b.dataset.variant===s.variant));
 $("preview-name").textContent=s.catName;
 $("preview").src=variantFiles[s.variant]||variantFiles.orange;
 setPreview("idle");
});
enabled.addEventListener("change",()=>chrome.storage.local.set({enabled:enabled.checked}));
wander.addEventListener("change",()=>chrome.storage.local.set({wanderEnabled:wander.checked}));
nameInput.addEventListener("input",()=>{
 const v=nameInput.value.trim()||"Mochi";
 $("preview-name").textContent=v;
 chrome.storage.local.set({catName:v});
});
bubbleSize.addEventListener("input",()=>{
 const v=Number(bubbleSize.value);
 $("bubble-label").textContent=(v<=1?"Normal":v<1.5?"Large":"Extra large")+" · "+v.toFixed(1)+"×";
 chrome.storage.local.set({bubbleScale:v});
});
size.addEventListener("input",()=>{
 $("size-label").textContent=(size.value<=60?"Tiny":size.value<=76?"Small":"Medium")+" · "+size.value+"px";
 chrome.storage.local.set({petScale:Number(size.value)});
});
buttons.forEach(b=>b.addEventListener("click",()=>applyVariant(b.dataset.variant)));
$("choose-emo").addEventListener("click",()=>applyVariant("emo"));
document.querySelectorAll(".mood-btn").forEach(b=>b.addEventListener("click",()=>{
 const mood=b.id.replace("preview-","");
 setPreview(mood);
 chrome.storage.local.set({moodAction:{mood,at:Date.now()}});
}));
followMouse.addEventListener("change",()=>{
 chrome.storage.local.set({followMouse:followMouse.checked,wanderEnabled:followMouse.checked?false:wander.checked});
 if(followMouse.checked)wander.checked=false;
});

// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
const konami=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let codeIndex=0;
document.addEventListener("keydown",e=>{
 const key=e.key.length===1?e.key.toLowerCase():e.key;
 if(key===konami[codeIndex]) codeIndex++;
 else codeIndex=(key===konami[0]?1:0);
 if(codeIndex===konami.length){
   codeIndex=0; emoUnlocked=true;
   chrome.storage.local.set({emoUnlocked:true});
   $("secret-section").hidden=false;
   $("secret-section").classList.add("unlocked");
   $("secret-section").scrollIntoView({behavior:"smooth",block:"nearest"});
   $("preview-caption").textContent="you found me. 🖤";
   $("preview-mood").textContent="🖤";
 }
});
setPreview("idle");

speed.addEventListener("input",()=>{
 const v=Number(speed.value);
 $("speed-label").textContent=(v<=0.9?"Slow":v>=1.8?"Fast":"Normal")+" · "+v.toFixed(1)+"×";
 chrome.storage.local.set({moveSpeed:v});
});
