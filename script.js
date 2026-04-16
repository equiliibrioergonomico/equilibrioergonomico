// ===== TIMELINE SCROLL PROGRESS =====
(function () {
  const track = document.querySelector('.metodo__linha-track');
  const progresso = document.getElementById('metodoprogressolinha');
  const etapas = document.querySelectorAll('.metodo__etapa');

  if (!track || !progresso || !etapas.length) return;

  function calcularProgresso() {
    const trackRect = track.getBoundingClientRect();
    const alturaVisivel = window.innerHeight;

    // Quanto da linha já passou pelo centro da tela
    const inicioLinha = trackRect.top;
    const fimLinha = trackRect.bottom;
    const totalAltura = fimLinha - inicioLinha;

    // Ponto de referência: 10% da tela (um pouco abaixo do centro)
    const pontoDeTrigger = alturaVisivel * 0.6;

    let percentual = (pontoDeTrigger - inicioLinha) / totalAltura;
    percentual = Math.min(Math.max(percentual, 0), 1);

    progresso.style.height = (percentual * 100) + '%';

    // Ativa cada etapa conforme a bolinha é alcançada
    etapas.forEach(function (etapa) {
      const bolinha = etapa.querySelector('.metodo__bolinha');
      if (!bolinha) return;

      const bolinhaRect = bolinha.getBoundingClientRect();
      const bolinhaPos = bolinhaRect.top + bolinhaRect.height / 2;

      if (bolinhaPos <= pontoDeTrigger) {
        etapa.classList.add('ativa');
      } else {
        etapa.classList.remove('ativa');
      }
    });
  }

  window.addEventListener('scroll', calcularProgresso, { passive: true });
  calcularProgresso(); // roda ao carregar
})();


// ===== ANIMAÇÃO SCROLL CARDS SERVIÇOS =====
(function () {
  const cards = document.querySelectorAll('.servicos__card.fade-up');

  if (!cards.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        // Delay escalonado: cada card aparece um pouco depois do anterior
        setTimeout(function () {
          entry.target.classList.add('visivel');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  cards.forEach(function (card) {
    observer.observe(card);
  });
})();

// ===== CARROSSEL DEPOIMENTOS =====
(function () {
  const track = document.getElementById('depoimentosTrack');
  const btnPrev = document.getElementById('depPrev');
  const btnNext = document.getElementById('depNext');
  const dotsContainer = document.getElementById('depDots');

  if (!track) return;

  const cards = track.querySelectorAll('.depoimentos__card');
  const total = cards.length;
  let atual = 0;
  let cardsPorVez = 3;
  let startX = 0;
  let isDragging = false;

  // Calcula quantos cards cabem por vez
  function calcularCardsPorVez() {
    const largura = window.innerWidth;
    if (largura <= 600) return 1;
    if (largura <= 900) return 2;
    return 3;
  }

  // Máximo de posições possíveis
  function maxIndex() {
    return Math.max(0, total - cardsPorVez);
  }

  // Move o carrossel
  function irPara(index) {
    atual = Math.min(Math.max(index, 0), maxIndex());

    const card = cards[0];
    const gap = 24;
    const larguraCard = card.offsetWidth + gap;

    track.style.transform = 'translateX(-' + (atual * larguraCard) + 'px)';
    atualizarDots();
  }

  // Cria os dots
  function criarDots() {
    dotsContainer.innerHTML = '';
    const numDots = maxIndex() + 1;

    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('depoimentos__dot');
      dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
      if (i === atual) dot.classList.add('ativo');
      dot.addEventListener('click', function () { irPara(i); });
      dotsContainer.appendChild(dot);
    }
  }

  // Atualiza dots
  function atualizarDots() {
    const dots = dotsContainer.querySelectorAll('.depoimentos__dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('ativo', i === atual);
    });
  }

  // Botões
  btnPrev && btnPrev.addEventListener('click', function () { irPara(atual - 1); });
  btnNext && btnNext.addEventListener('click', function () { irPara(atual + 1); });

  // Swipe touch
  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? irPara(atual + 1) : irPara(atual - 1);
    }
  }, { passive: true });

  // Auto play
  let autoplay = setInterval(function () {
    const proximo = atual >= maxIndex() ? 0 : atual + 1;
    irPara(proximo);
  }, 5000);

  // Pausa autoplay ao interagir
  [btnPrev, btnNext].forEach(function (btn) {
    btn && btn.addEventListener('click', function () {
      clearInterval(autoplay);
    });
  });

  // Recalcula ao redimensionar
  window.addEventListener('resize', function () {
    cardsPorVez = calcularCardsPorVez();
    if (atual > maxIndex()) atual = maxIndex();
    criarDots();
    irPara(atual);
  });

  // Init
  cardsPorVez = calcularCardsPorVez();
  criarDots();
  irPara(0);

})();

// ===== CARROSSEL DEPOIMENTOS =====
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".referral-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  observer.observe(section);
});

// ===== SEÇÃO CONTATOS =====
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.2 // Dispara quando 20% do elemento estiver visível
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: para a animação só acontecer uma vez
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos com a classe scroll-reveal
    const hiddenElements = document.querySelectorAll('.scroll-reveal');
    hiddenElements.forEach((el) => observer.observe(el));
});






document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica do Menu Mobile ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animação simples do ícone hamburguer
            menuToggle.classList.toggle('is-active');
        });
    }

    // --- Lógica do Carrossel ---
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Remove active de todos
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Calcula o próximo índice
        currentSlide = (index + slides.length) % slides.length;
        
        // Adiciona active ao atual
        slides[currentSlide].classList.add('active');
        
        // Reinicia o tempo para não pular rápido demais se o usuário clicar
        resetTimer();
    }

    function resetTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => showSlide(currentSlide + 1), 6000); // Troca a cada 6 segundos
    }

    // Eventos de clique
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

    // Iniciar timer automático
    resetTimer();
});


window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});