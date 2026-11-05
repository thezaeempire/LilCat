const $=id=>document.getElementById(id);
const enabled=$("enabled"),wander=$("wander"),nameInput=$("catName"),size=$("size"),bubbleSize=$("bubbleSize");
const buttons=[...document.querySelectorAll(".variant")];
const variantFiles={
 orange:"../assets/cats/cat-orange.png", street:"../assets/cats/street.png", cream:"../assets/cats/cream.png",
 black:"../assets/cats/black.png", white:"../assets/cats/white.png", emo:"../assets/cats/emo.png"
};
const moods={
 idle:["../assets/cats/cat-orange.png","♡","Just vibing."],
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
 $("preview").src=selectedVariant==="emo" ? variantFiles.emo : (mood==="idle" ? variantFiles[selectedVariant] : src);
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
chrome.storage.local.get({enabled:true,variant:"orange",catName:"Mochi",wanderEnabled:true,petScale:64,bubbleScale:1,emoUnlocked:false},s=>{
 enabled.checked=s.enabled;wander.checked=s.wanderEnabled;
 nameInput.value=s.catName;size.value=s.petScale;bubbleSize.value=s.bubbleScale;
 $("bubble-label").textContent=(s.bubbleScale<=1?"Normal":s.bubbleScale<1.5?"Large":"Extra large")+" · "+Number(s.bubbleScale).toFixed(1)+"×";
 $("size-label").textContent=(s.petScale<=60?"Tiny":s.petScale<=76?"Small":"Medium")+" · "+s.petScale+"px";
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
document.querySelectorAll(".mood-btn").forEach(b=>b.addEventListener("click",()=>setPreview(b.id.replace("preview-",""))));

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
