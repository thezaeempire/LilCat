const $=id=>document.getElementById(id);
const enabled=$("enabled"),wander=$("wander"),nameInput=$("catName"),size=$("size"),bubbleSize=$("bubbleSize");
const buttons=[...document.querySelectorAll(".variant")];
const moods={
 idle:["cat-orange.png","♡","Chilling and minding their business."],
 angry:["angry.png","💢","Not amused. Do not boop."],
 sad:["sad.png","💧","A little emotional right now."],
 dizzy:["dizzy.png","💫","The room is spinning!"],
 typing:["typing.png","⌨️","Helping you get that code done."],
 music:["headphones.png","🎵","Headphones on. Vibing to music."],
 sleep:["sleep.png","💤","Tiny nap time. Zzz..."]
};
let selectedVariant="orange", selectedMood="idle";
function setPreview(mood){
 selectedMood=mood;
 const [src,icon,caption]=moods[mood];
 $("preview").src=src;
 $("preview-mood").textContent=icon;
 $("preview-caption").textContent=caption;
 document.querySelectorAll(".mood-btn").forEach(b=>b.classList.toggle("active",b.id==="preview-"+mood));
}
chrome.storage.local.get({enabled:true,variant:"orange",catName:"Mochi",wanderEnabled:true,petScale:64,bubbleScale:1},s=>{
 enabled.checked=s.enabled;wander.checked=s.wanderEnabled;
 nameInput.value=s.catName;size.value=s.petScale;bubbleSize.value=s.bubbleScale;
 $("bubble-label").textContent=(s.bubbleScale<=1?"Normal":s.bubbleScale<1.5?"Large":"Extra large")+" · "+Number(s.bubbleScale).toFixed(1)+"×";
 $("size-label").textContent=(s.petScale<=60?"Tiny":s.petScale<=76?"Small":"Medium")+" · "+s.petScale+"px";
 selectedVariant=s.variant;
 buttons.forEach(b=>b.classList.toggle("active",b.dataset.variant===s.variant));
 $("preview-name").textContent=s.catName;
 $("preview").src=s.variant==="orange"?"cat-orange.png":"cat-orange.png";
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
buttons.forEach(b=>b.addEventListener("click",()=>{
 selectedVariant=b.dataset.variant;
 chrome.storage.local.set({variant:selectedVariant,enabled:true});
 enabled.checked=true;
 buttons.forEach(x=>x.classList.toggle("active",x===b));
}));
document.querySelectorAll(".mood-btn").forEach(b=>b.addEventListener("click",()=>setPreview(b.id.replace("preview-",""))));
setPreview("idle");