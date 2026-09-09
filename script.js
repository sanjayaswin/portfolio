/* =====================================================
   script.js — Portfolio JavaScript
   Sanjay M Personal Portfolio
   ===================================================== */

'use strict';

// ─────────────────────────────────────────────────────
// 1. TYPING EFFECT
// ─────────────────────────────────────────────────────
(function initTypingEffect() {
  const typedEl  = document.getElementById('typed-text');
  if (!typedEl) return;

  const roles    = ['Full-Stack Developer', 'AI & LLM Engineer', 'Problem Solver'];
  let roleIdx    = 0;   // current phrase index
  let charIdx    = 0;   // current character position
  let isDeleting = false;
  let speed      = 90;  // ms per char

  function type() {
    const currentRole = roles[roleIdx];

    if (!isDeleting) {
      // Typing forward
      typedEl.textContent = currentRole.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentRole.length) {
        // Pause at end before deleting
        isDeleting = true;
        speed = 1800; // display pause
      } else {
        speed = 70 + Math.random() * 50; // natural variation
      }
    } else {
      // Deleting
      typedEl.textContent = currentRole.slice(0, charIdx - 1);
      charIdx--;
      speed = 40;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx     = (roleIdx + 1) % roles.length;
        speed       = 400; // pause before next word
      }
    }

    setTimeout(type, speed);
  }

  // Start after a short delay
  setTimeout(type, 700);
})();


// ─────────────────────────────────────────────────────
// 2. STICKY NAV — add 'scrolled' class on scroll
// ─────────────────────────────────────────────────────
(function initStickyNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();


// ─────────────────────────────────────────────────────
// 3. ACTIVE NAV LINK HIGHLIGHTING via IntersectionObserver
// ─────────────────────────────────────────────────────
(function initActiveNavHighlight() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    {
      rootMargin: '-50% 0px -45% 0px', // trigger near the middle of viewport
      threshold:  0
    }
  );

  sections.forEach((section) => observer.observe(section));
})();


// ─────────────────────────────────────────────────────
// 4. HAMBURGER MENU (mobile)
// ─────────────────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


// ─────────────────────────────────────────────────────
// 5. SCROLL-REVEAL ANIMATIONS
// ─────────────────────────────────────────────────────
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // once revealed, done
        }
      });
    },
    {
      rootMargin: '0px 0px -60px 0px',
      threshold:  0.12
    }
  );

  reveals.forEach((el) => observer.observe(el));
})();


// ─────────────────────────────────────────────────────
// 6. BACK-TO-TOP BUTTON
// ─────────────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ─────────────────────────────────────────────────────
// 7. COPY EMAIL TO CLIPBOARD
// ─────────────────────────────────────────────────────
(function initCopyEmail() {
  const btn      = document.getElementById('copy-email-btn');
  const btnText  = document.getElementById('copy-btn-text');
  const email    = 'sanjay.m.stack@gmail.com';
  if (!btn || !btnText) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      btnText.textContent = '✓ Copied!';
      btn.style.background = 'rgba(0, 212, 255, 0.15)';
      setTimeout(() => {
        btnText.textContent = 'Copy Email';
        btn.style.background = '';
      }, 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = email;
      el.style.position = 'fixed';
      el.style.opacity  = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      btnText.textContent = '✓ Copied!';
      setTimeout(() => (btnText.textContent = 'Copy Email'), 2500);
    }
  });
})();


// ─────────────────────────────────────────────────────
// 8. PARTICLE CANVAS — subtle animated network
// ─────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const PARTICLE_COUNT = 60;
  const MAX_DIST       = 140; // connection distance

  // Resize canvas to fill hero section
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  // Create particle objects
  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      vx:   (Math.random() - 0.5) * 0.5,
      vy:   (Math.random() - 0.5) * 0.5,
      r:    Math.random() * 1.5 + 0.6,
      a:    Math.random() * 0.5 + 0.2,
    }));
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw each particle
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(92, 127, 94, ${p.a * 0.50})`;
      ctx.fill();
    });

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.09;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(92, 127, 94, ${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  // Init
  resize();
  createParticles();
  animate();

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  }, { passive: true });
})();


// ─────────────────────────────────────────────────────
// 9. SKILL TAGS — staggered entrance animation
// ─────────────────────────────────────────────────────
(function initSkillTagAnimations() {
  const skillGroups = document.querySelectorAll('.skill-group');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll('.skill-tag');
          tags.forEach((tag, i) => {
            setTimeout(() => {
              tag.style.opacity   = '1';
              tag.style.transform = 'translateY(0)';
            }, i * 60);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  skillGroups.forEach((group) => {
    const tags = group.querySelectorAll('.skill-tag');
    tags.forEach((tag) => {
      tag.style.opacity   = '0';
      tag.style.transform = 'translateY(16px)';
      tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease';
    });
    observer.observe(group);
  });
})();


// ─────────────────────────────────────────────────────
// 10. HERO PHOTO — graceful error handling
//     (already handled via onerror on <img>, but we also
//      ensure the fallback initials always show correctly)
// ─────────────────────────────────────────────────────
(function initHeroPhoto() {
  const img  = document.getElementById('hero-photo');
  if (!img)  return;

  // If src is empty or missing, show initials immediately
  if (!img.src || img.src === window.location.href) {
    img.dispatchEvent(new Event('error'));
  }
})();
