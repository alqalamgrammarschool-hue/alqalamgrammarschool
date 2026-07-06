/* =========================================================
   AL-QALAM GRAMMAR SCHOOL — INTERACTION LAYER
   Loading screen, cursor, particles, smooth scroll (Lenis),
   scroll reveals, horizontal pinned "Why Choose Us" track
   (GSAP ScrollTrigger), 3D tilt, magnetic buttons, forms.
   ========================================================= */
(function(){
  "use strict";

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  /* ---------------- LOADER ---------------- */
  var loader = document.getElementById('loader');
  window.addEventListener('load', function(){
    setTimeout(function(){
      loader && loader.classList.add('done');
      document.body.style.overflow = '';
    }, 900);
  });

  /* ---------------- LENIS SMOOTH SCROLL ---------------- */
  var lenis = null;
  if (!prefersReduced && window.Lenis) {
    try {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      }
    } catch(e){ lenis = null; }
  }

  /* ---------------- NAV ---------------- */
  var nav = document.getElementById('siteNav');
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var scrollProgress = document.getElementById('scrollProgress');

  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('scrolled', y > 40);
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (y / docH) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  navToggle && navToggle.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true':'false');
    mobileMenu.setAttribute('aria-hidden', open ? 'false':'true');
  });
  document.querySelectorAll('[data-nav]').forEach(function(link){
    link.addEventListener('click', function(){
      mobileMenu && mobileMenu.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded','false');
    });
  });

  /* active link on scroll */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  if ('IntersectionObserver' in window && sections.length){
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          navLinks.forEach(function(l){
            l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function(s){ navObserver.observe(s); });
  }

  /* ---------------- CURSOR ---------------- */
  var cursorDot = document.getElementById('cursorDot');
  var cursorGlow = document.getElementById('cursorGlow');
  var isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch && cursorDot && cursorGlow){
    var mx=0,my=0, gx=0, gy=0;
    window.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      cursorDot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function animGlow(){
      gx += (mx-gx)*0.12; gy += (my-gy)*0.12;
      cursorGlow.style.transform = 'translate(' + gx + 'px,' + gy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(animGlow);
    })();

    document.querySelectorAll('a,button,.tilt,summary').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursorDot.style.width = cursorDot.style.height = '18px'; });
      el.addEventListener('mouseleave', function(){ cursorDot.style.width = cursorDot.style.height = '8px'; });
    });
  } else {
    cursorDot && (cursorDot.style.display = 'none');
    cursorGlow && (cursorGlow.style.display = 'none');
  }

  /* ---------------- MAGNETIC BUTTONS ---------------- */
  if (!isTouch && !prefersReduced){
    document.querySelectorAll('.magnetic').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        btn.style.transform = 'translate(' + x*0.25 + 'px,' + y*0.35 + 'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
    });
  }

  /* ---------------- 3D TILT ---------------- */
  if (!isTouch && !prefersReduced){
    document.querySelectorAll('[data-tilt]').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left)/r.width - 0.5;
        var py = (e.clientY - r.top)/r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (px*10) + 'deg) rotateX(' + (py*-10) + 'deg) translateZ(10px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
      });
    });
  }

  /* hero stage mouse parallax */
  var stage = document.getElementById('stage3d');
  if (stage && !isTouch && !prefersReduced){
    window.addEventListener('mousemove', function(e){
      var px = (e.clientX / window.innerWidth) - 0.5;
      var py = (e.clientY / window.innerHeight) - 0.5;
      stage.style.transform = 'rotateY(' + (px*14) + 'deg) rotateX(' + (py*-10) + 'deg)';
    });
  }

  /* ---------------- SCROLL REVEALS ---------------- */
  var revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window){
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry, i){
        if (entry.isIntersecting){
          setTimeout(function(){ entry.target.classList.add('in'); }, (i%4) * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.15 });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------------- PARTICLES CANVAS (hero) ---------------- */
  var canvas = document.getElementById('particles');
  if (canvas && !prefersReduced){
    var ctx = canvas.getContext('2d');
    var particles = [];
    var heroEl = canvas.closest('.hero');

    function resize(){
      canvas.width = heroEl.offsetWidth;
      canvas.height = heroEl.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var count = window.innerWidth < 700 ? 26 : 55;
    for (var i=0;i<count;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*2 + 0.6,
        vy: Math.random()*0.4 + 0.15,
        vx: (Math.random()-0.5)*0.2,
        o: Math.random()*0.5 + 0.2
      });
    }
    var gold = [201,162,75];
    var blue = [42,63,158];

    function tick(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(function(p){
        p.y -= p.vy; p.x += p.vx;
        if (p.y < -10){ p.y = canvas.height + 10; p.x = Math.random()*canvas.width; }
        var c = Math.random() > 0.5 ? gold : blue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + p.o + ')';
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------------- GSAP: HORIZONTAL PIN "WHY CHOOSE US" ---------------- */
  if (window.gsap && window.ScrollTrigger && !prefersReduced){
    gsap.registerPlugin(ScrollTrigger);

    var track = document.getElementById('whyTrack');
    var progressBar = document.getElementById('whyProgressBar');

    if (track){
      requestAnimationFrame(function initHorizontal(){
        var trackWidth = track.scrollWidth;
        var viewWidth = window.innerWidth;
        var distance = Math.max(trackWidth - viewWidth + 160, 0);

        var tween = gsap.to(track, {
          x: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: '.why-pin',
            start: 'top top',
            end: '+=' + (distance + window.innerHeight * 1.2),
            scrub: 0.6,
            pin: '.why-sticky',
            anticipatePin: 1,
            onUpdate: function(self){
              if (progressBar) progressBar.style.width = (self.progress*100) + '%';
            }
          }
        });

        gsap.utils.toArray('.why-card').forEach(function(card, i){
          gsap.fromTo(card, { opacity: 0.4, y: 30, rotateY: 12 }, {
            opacity: 1, y: 0, rotateY: 0, ease: 'none',
            scrollTrigger: {
              trigger: '.why-pin',
              containerAnimation: tween,
              start: 'left 80%',
              toggleActions: 'play none none reverse'
            }
          });
        });

        window.addEventListener('resize', function(){ ScrollTrigger.refresh(); });
      });
    }
  } else {
    /* graceful fallback: horizontal scroll becomes a native swipe row */
    var trackFallback = document.getElementById('whyTrack');
    if (trackFallback){ trackFallback.style.overflowX = 'auto'; }
  }

  /* ---------------- FORMS (front-end only demo) ---------------- */
  function handleForm(formId, statusId, successMsg){
    var form = document.getElementById(formId);
    var status = document.getElementById(statusId);
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.checkValidity()){
        status.textContent = 'Please complete all required fields.';
        status.style.color = '#b23b3b';
        return;
      }
      status.style.color = '';
      status.textContent = successMsg;
      form.reset();
    });
  }
  handleForm('admissionForm', 'formStatus', 'Thank you — our admissions team will contact you shortly.');
  handleForm('contactForm', 'contactStatus', 'Thank you for your message — we will be in touch soon.');

})();
