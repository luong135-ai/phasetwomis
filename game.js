/* ===================== AUDIO SYSTEM ===================== */
const AUDIO_FILES = {
  backgroundLoop: 'backgroundloop.mp3',
  correct: 'correct.mp3',
  wrong: 'wrong.mp3',
  swordSlide: 'swordslide.mp3',
  bladeSlide: 'bladeslide.mp3',
  losingHorn: 'losinghorn.mp3',
  dogBark: 'dogbark.mp3',
  brassWin: 'brasswin.mp3'
};

let audioContext = null;
let backgroundAudio = null;
let isGameActive = false;

// Initialize audio context and background loop
function initAudio() {
  // Create background audio element if it doesn't exist
  if (!backgroundAudio) {
    backgroundAudio = document.createElement('audio');
    backgroundAudio.id = 'gameBackgroundAudio';
    backgroundAudio.src = AUDIO_FILES.backgroundLoop;
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.5;
    document.body.appendChild(backgroundAudio);
  }
}

// Play background music
function playBackgroundMusic() {
  if (backgroundAudio && !isGameActive) {
    backgroundAudio.currentTime = 0;
    backgroundAudio.play().catch(err => console.log('Background music play failed:', err));
    isGameActive = true;
  }
}

// Stop background music
function stopBackgroundMusic() {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    isGameActive = false;
  }
}

// Play sound effect
function playSoundEffect(fileName, volume = 0.7) {
  const audio = document.createElement('audio');
  audio.src = fileName;
  audio.volume = volume;
  audio.play().catch(err => console.log('Sound effect play failed:', err));
}

// Play correct answer sound
function playCorrectSound() {
  playSoundEffect(AUDIO_FILES.correct, 0.8);
}

// Play wrong answer sound
function playWrongSound() {
  playSoundEffect(AUDIO_FILES.wrong, 0.8);
}

// Play sword slide sound (blade falling)
function playSwordSlideSound() {
  playSoundEffect(AUDIO_FILES.swordSlide, 0.9);
}

// Play blade slide sound (final knife drop)
function playBladeSlideSound() {
  playSoundEffect(AUDIO_FILES.bladeSlide, 0.9);
}

// Play losing sequence sounds
function playLosingSequence() {
  stopBackgroundMusic();
  
  // First: Losing horn
  const losingHorn = document.createElement('audio');
  losingHorn.src = AUDIO_FILES.losingHorn;
  losingHorn.volume = 0.8;
  losingHorn.onended = () => {
    // Then: Dog bark
    playSoundEffect(AUDIO_FILES.dogBark, 0.8);
  };
  losingHorn.play().catch(err => console.log('Losing horn play failed:', err));
}

// Play winning sequence sounds
function playWinningSequence() {
  stopBackgroundMusic();
  
  // First: Brass win sound
  const brassWin = document.createElement('audio');
  brassWin.src = AUDIO_FILES.brassWin;
  brassWin.volume = 0.8;
  brassWin.onended = () => {
    // Then: Dog bark
    playSoundEffect(AUDIO_FILES.dogBark, 0.8);
  };
  brassWin.play().catch(err => console.log('Brass win play failed:', err));
}

const CONFIG = {
  MAX_QUESTIONS: 5,   // số câu lấy ngẫu nhiên từ pool
  MAX_WRONG: 3,        // số sai tối đa cho phép
  questions: [
    {id:'q1', text:'Nasi Lemak is from:', choices:['Indonesia','Thailand','Malaysia','Singapore'], correctIndex:2},
    {id:'q2', text:'Feijoada is the national dish of:', choices:['Portugal','Brazil','Angola','Cape Verde'], correctIndex:1},
    {id:'q3', text:'Okroshka originates from:', choices:['Russia','Latvia','Belarus','Ukraine'], correctIndex:0},
    {id:'q4', text:'Cevapi are most associated with:', choices:['Serbia','Albania','Greece','Bosnia & Herzegovina'], correctIndex:3},
    {id:'q5', text:'Bobotie comes from:', choices:['Morocco','South Africa','Kenya','Botswana'], correctIndex:1},
    {id:'q6', text:'Mofongo is from:', choices:['Puerto Rico','Dominican Republic','Cuba','Jamaica'], correctIndex:0},
    {id:'q7', text:'Koshari is street food from:', choices:['Egypt','Jordan','Tunisia','Lebanon'], correctIndex:0},
    {id:'q8', text:'Hoppers originate in:', choices:['India','Nepal','Bangladesh','Sri Lanka'], correctIndex:3},
    {id:'q9', text:'Pljeskavica is popular in:', choices:['Montenegro','Serbia','Croatia','Slovenia'], correctIndex:1},
    {id:'q10', text:'Acarajé comes from:', choices:['Brazil','Haiti','Senegal','Angola'], correctIndex:0},
    {id:'q11', text:'Fårikål is the national dish of:', choices:['Finland','Norway','Sweden','Iceland'], correctIndex:1},
    {id:'q12', text:'Katsu Sando is originally from:', choices:['Japan','Taiwan','South Korea','China'], correctIndex:0},
    {id:'q13', text:'Tteokbokki comes from:', choices:['Japan','North Korea','South Korea','China'], correctIndex:2},
    {id:'q14', text:'Ghormeh Sabzi originates from:', choices:['Azerbaijan','Turkey','Iraq','Iran'], correctIndex:3},
    {id:'q15', text:'Rösti is from:', choices:['Germany','Switzerland','Austria','Liechtenstein'], correctIndex:1}
  ]
};

/* ===================== STATE & DOM ===================== */
let i = 0;
let wrong = 0;
let status = 'playing'; // 'playing' | 'won' | 'lost'
let GAME_QUESTIONS = [];
let TOTAL = 0;

const scene    = document.getElementById('scene');
const bladeSVG = document.getElementById('bladeSprite');
const bladeHead= document.getElementById('bladeHead');
const rope     = document.getElementById('rope');
const heartsHost = document.getElementById('hearts');
const overlay  = document.getElementById('overlay');
const ovTitle  = document.getElementById('ov-title');
const ovDesc   = document.getElementById('ov-desc');
const retryBtn = document.getElementById('retryBtn');

const progressEl = document.getElementById('progress');
const wrongEl    = document.getElementById('wrong');

const qText      = document.getElementById('qText');
const answersEl  = document.getElementById('answers');

/* ===================== BLADE + ROPE PHYSICS ===================== */
/** offset Y (px) trong toạ độ SVG cho bladeHead
 *  0  = sát trên
 *  1  = chạm tới đỉnh đầu bulldog trong bg1
 */
const TOP_OFFSET      = 0;
const BOTTOM_OFFSET   = 220; // chỉnh nếu muốn dao xuống thấp hơn / cao hơn
const ROPE_BASE_LEN   = 50;  // chiều cao ban đầu của <rect id="rope">
let currentOffset     = 0;

/** Cập nhật lưỡi dao & dây theo tỉ lệ (0..1) */
function setBladeRatio(ratio){
  const t = Math.max(0, Math.min(1, ratio));
  currentOffset = TOP_OFFSET + (BOTTOM_OFFSET - TOP_OFFSET)*t;

  // hạ bladeHead
  bladeHead.style.transform = `translateY(${currentOffset}px)`;

  // kéo dây: scaleY từ đỉnh xuống dưới
  const scale = 1 + currentOffset / ROPE_BASE_LEN;
  rope.style.transform = `scaleY(${scale})`;
}

/* ===================== HELPERS ===================== */
function sampleQuestions(pool, n){
  const arr = pool.slice();
  for(let k=arr.length-1;k>0;k--){
    const j = Math.floor(Math.random()*(k+1));
    [arr[k],arr[j]] = [arr[j],arr[k]];
  }
  const take = Math.min(n, arr.length);
  return arr.slice(0,take);
}

function makeHearts(n=22){
  heartsHost.innerHTML = '';
  for(let k=0;k<n;k++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = '❤';
    h.style.left = `${Math.random()*100}%`;
    h.style.animationDelay = `${Math.random()*1.2}s`;
    h.style.animationDuration = `${1.6 + Math.random()*0.9}s`;
    heartsHost.appendChild(h);
  }
}

function freezeButtons(ms=600){
  [...answersEl.children].forEach(btn=>btn.disabled=true);
  setTimeout(()=>{ if(status==='playing'){[...answersEl.children].forEach(btn=>btn.disabled=false);} }, ms);
}

/* ===================== GAME FLOW ===================== */
function init(){
  i=0; wrong=0; status='playing';
  scene.className = 'scene state-play';
  overlay.classList.remove('show');
  bladeSVG.style.display = ''; // hiện lại dao
  setBladeRatio(0); // dao ở trên cùng
  makeHearts();

  // Initialize and play background music
  initAudio();
  playBackgroundMusic();

  GAME_QUESTIONS = sampleQuestions(CONFIG.questions, CONFIG.MAX_QUESTIONS);
  TOTAL = GAME_QUESTIONS.length;

  renderQuestion();
}

function renderQuestion(){
  progressEl.textContent = `${Math.min(i+1, TOTAL)}/${TOTAL}`;
  wrongEl.textContent    = `${wrong}/${CONFIG.MAX_WRONG}`;

  const q = GAME_QUESTIONS[i];
  qText.textContent = q.text;
  answersEl.innerHTML = '';

  q.choices.forEach((choice, idx)=>{
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.onclick = ()=> onAnswer(idx, btn);
    answersEl.appendChild(btn);
  });
}

function onAnswer(idx, btn){
  if(status !== 'playing') return;
  const q = GAME_QUESTIONS[i];
  const correct = idx === q.correctIndex;

  btn.classList.add(correct ? 'correct' : 'wrong');
  freezeButtons();

  // Play appropriate sound
  if (correct) {
    playCorrectSound();
  } else {
    playWrongSound();
  }

  if(!correct){
    wrong++;
    if(wrong <= CONFIG.MAX_WRONG && CONFIG.MAX_WRONG > 0){
      const ratio = wrong / CONFIG.MAX_WRONG;
      setBladeRatio(ratio);
      
      // Play sword slide sound for each wrong answer
      if (wrong < CONFIG.MAX_WRONG) {
        setTimeout(() => playSwordSlideSound(), 100);
      } else {
        // Play blade slide sound for the final (losing) drop
        setTimeout(() => playBladeSlideSound(), 100);
      }
    }
  }

  setTimeout(()=>{
    if(!correct && wrong > CONFIG.MAX_WRONG) return lose();
    i++;
    if(i >= TOTAL) return (wrong <= CONFIG.MAX_WRONG) ? win() : lose();
    renderQuestion();
  }, 500);
}

function win(){
  status = 'won';
  scene.className = 'scene state-win';
  bladeSVG.style.display = 'none';
  ovTitle.textContent = '🎉 You saved me bro!';
  ovDesc.textContent  = 'Bulldog loves you so much 😎';
  overlay.classList.add('show');
  
  // Play winning sequence sounds
  playWinningSequence();
}

function lose(){
  status = 'lost';
  // cho một nhát “chốt hạ”: hạ thêm chút nữa + kéo dây theo
  const extra = 25;
  currentOffset += extra;
  bladeHead.style.transition = 'transform .25s ease-out';
  rope.style.transition      = 'transform .25s ease-out';

  bladeHead.style.transform = `translateY(${currentOffset}px)`;
  const scale = 1 + currentOffset / ROPE_BASE_LEN;
  rope.style.transform = `scaleY(${scale})`;

  scene.classList.add('shake');

  setTimeout(()=>{
    scene.className = 'scene state-lose';
    bladeSVG.style.display = 'none';
    ovTitle.textContent = '💀 Game over';
    ovDesc.textContent  = `You were wrong over ${CONFIG.MAX_WRONG} questions.`;
    overlay.classList.add('show');

    // Play losing sequence sounds
    playLosingSequence();

    // khôi phục transition mặc định cho lượt chơi kế
    bladeHead.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1)';
    rope.style.transition      = 'transform .45s cubic-bezier(.2,.8,.2,1)';
  }, 260);
}

/* ===================== EVENTS ===================== */
retryBtn.onclick = ()=> init();

window.addEventListener('keydown', e=>{
  if(status !== 'playing') return;
  const idx = ['1','2','3','4'].indexOf(e.key);
  if(idx>=0 && answersEl.children[idx]){
    answersEl.children[idx].click();
  }
});

/* preload backgrounds để đỡ giật */
['./bg1.png','./bg3.png','./bg4.png'].forEach(src=>{
  const img = new Image();
  img.src = src;
});

window.addEventListener('load', init);