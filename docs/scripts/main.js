console.clear();
var el = {
  background: document.querySelector('.background'),
  pomTimeVal: document.querySelector('#pom-value'),
  breakTimeVal: document.querySelector('#break-value'),
  pomTimeSlider: document.querySelector('#pom-time'),
  breakTimeSlider: document.querySelector('#break-time'),
  start: document.querySelector('.start'),
  mode: document.querySelector('.mode'),
  reset: document.querySelector('.reset'),
  min: document.querySelector('.minutes'),
  sec: document.querySelector('.seconds'),
  getBlur: function() {return window.getComputedStyle(this.background).filter}
}
//declare vars and set some defaults
var current = {
  pomTime: '25',
  breakTime: '05',
  run: {
    state: false,
    text: "start"
  },
  mode: "mode",
  min: '25',
  sec: '00',
  blur: "blur(90px)",
  intervalId: '',
  soundClip: new Audio("http://www.sounddogs.com/previews/101/mp3/162566_SOUNDDOGS__ba.mp3")

}
//logic lay here
var control = {
  setTime: function(e) {
    if (e.target.id === "pom-time" && !current.run.state) {
      current.pomTime = el.pomTimeSlider.value;
      current.mode = "mode";
      view.setMode("mode");
      control.resetSec();
      view.setPomTime();
    }
    if (e.target.id === "break-time" && !current.run.state) {
      current.breakTime = el.breakTimeSlider.value;
      current.mode = "break";
      view.setMode("break");
      control.resetSec();
      view.setBreakTime();
    }
  },

  startStop: function() {
    if (!current.run.state) {
      current.run.text = "pause";
      current.run.state = true;
      view.setStartStop();
      current.blur = el.getBlur();
      view.setBlur();
      control.clock();
    } else if (current.run.state) {
      current.run.text = "start";
      current.run.state = false;
      view.setStartStop();
      current.blur = el.getBlur();
      view.setBlur();
    }
  },

  mode: function() {
    if (current.mode === "mode" && !current.run.state) {
      current.mode = "break";
      control.resetSec();
      view.setMode("break");
    } else if (current.mode === "break" && !current.run.state) {
      current.mode = "mode";
      control.resetSec();
      view.setMode("mode");
    }
  },

  reset: function() {
    current.run.state = false;
    current.run.text = "start";
    current.sec = '00';
    current.blur = "blur(90px)";
    view.setStartStop();
    view.setTimer();
    view.setBlur();
  },

  resetSec: function() {
    current.sec = '00';
  },

  clock: function() {
    if (current.run.state) { 
       current.intervalId = setInterval(this.interval, 1000);
      } 
  },
//count down...a bit poorly written but gets the job done
  interval: function() {
    if (!current.run.state) {
      clearInterval(current.intervalId)
    } else {
      // console.log("at interval" + current.min, current.sec);
      if (+current.min < 1 && +current.sec < 1) {  
        current.run.state = false;
        control.alarm();
      } else { 
        // console.log(current.sec)
        if (current.sec == 0) {
          current.min--;
          current.sec = "60";
        }
        current.sec--
        view.runTimer();
      }
    }
  },
  
  alarm: function() {
    current.soundClip.play();
    setTimeout(function() {
      control.mode();
      control.reset();
      control.startStop();
    }, 4000);
    // console.log('times up');  
  }
}
//output to client
var view = {
  setPomTime: function() {
    if (current.pomTime.toString().length < 2) current.pomTime = 0 + current.pomTime;
    el.pomTimeVal.innerHTML = current.pomTime;
    this.setTimer();
  },
  
  setBreakTime: function() {
    if (current.breakTime.toString().length < 2) current.breakTime = 0 + current.breakTime;
    el.breakTimeVal.innerHTML = current.breakTime;
    this.setTimer();
  },

  setTimer: function() {
    if (current.mode === "mode") {
      el.min.innerHTML = current.pomTime;
      current.min = current.pomTime;
      el.sec.innerHTML = '00';
    } else if (current.mode === "break") {
      el.min.innerHTML = current.breakTime;
      current.min = current.breakTime;
      el.sec.innerHTML = '00';
      // console.log("at setTimer func", current.min, current.sec);
    }
  },

  runTimer: function() {
    // console.log("at runTimer func", current.sec.toString().length);
    if (current.min.toString().length < 2) current.min = '0' + current.min;
    if (current.sec.toString().length < 2) current.sec = '0' + current.sec;
    el.min.innerHTML = current.min;
    el.sec.innerHTML = current.sec;
  },

  setStartStop: function() {
    el.start.innerHTML = current.run.text;
    //disable sliders while running
    if (current.run.state) {
      el.breakTimeSlider.disabled = true;
      el.pomTimeSlider.disabled = true;
    } else if (!current.run.state) {
      el.breakTimeSlider.disabled = false;
      el.pomTimeSlider.disabled = false;
    }
  },

  setMode: function(m) {
    el.mode.innerHTML = current.mode;
    if (m === "break") {
      this.setBreakTime();
    } else if (m === "mode") {
      this.setPomTime();
    }
  },

  setBlur: function() {
    if (current.run.state === true) {
      //deal with under one minute left
      // console.log((+current.min*60) + +current.sec)
      +current.min < 1 ? el.background.style.transition = `${+current.sec}s` : el.background.style.transition = `${(+current.min*60) + +current.sec}s`;
      el.background.style.filter = "blur(0px)";  
    } else {      
      el.background.style.filter = current.blur;
      el.background.style.transition = ''; //functions w/o with line but transitioning to equal blur value
      // console.log(el.background.classList);
    }
  }
}

function init() {
  el.pomTimeSlider.addEventListener('input', control.setTime);
  el.breakTimeSlider.addEventListener('input', control.setTime);
  el.start.addEventListener('click', control.startStop);
  el.mode.addEventListener('click', control.mode);
  el.reset.addEventListener('click', control.reset);
}
init();