document.addEventListener('DOMContentLoaded', function() {
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('.galeria-item img');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src; // Substitui o src pelo data-src
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px', // Carrega a imagem um pouco antes de entrar na tela
      threshold: 0.1
    });

    lazyImages.forEach(img => {
      observer.observe(img);
    });
  }

  initLazyLoad();

  // 1. Efeito de Carregamento
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  loadingScreen.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Preparando a Magia...</p>
  `;
  document.body.appendChild(loadingScreen);

  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.remove();
      initPage();
    }, 500);
  }, 1500);

  function initPage() {
    initGallery();
    initModal();
    animateSections();
    initButtonEffects();
  }

  // 2. Efeito de Balões nos Botões
  function initButtonEffects() {
    const buttons = document.querySelectorAll('nav a, .filtro-btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
      
      button.addEventListener('click', function(e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 200);
        createBalloons(e.clientX, e.clientY);
      });
    });
    
    function createBalloons(x, y) {
      const colors = ['#ff6b9d', '#f103de', '#25d366', '#ffc107', '#e91e63', '#9c27b0', '#3f51b5'];
      const balloonContainer = document.createElement('div');
      balloonContainer.className = 'balloon-container';
      balloonContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
      `;
      document.body.appendChild(balloonContainer);
      
      const balloonCount = Math.floor(Math.random() * 4) + 5;
      
      for (let i = 0; i < balloonCount; i++) {
        setTimeout(() => {
          const balloon = document.createElement('div');
          balloon.className = 'balloon';
          
          const size = Math.random() * 40 + 30;
          const color = colors[Math.floor(Math.random() * colors.length)];
          const duration = Math.random() * 3 + 3;
          
          balloon.style.cssText = ` 
            position: absolute;
            width: ${size}px;
            height: ${size * 1.2}px;
            background: ${color};
            border-radius: 50%;
            left: ${x + (Math.random() * 60 - 30)}px;
            bottom: ${window.innerHeight - y}px;
            z-index: 100;
            transform-origin: bottom center;
            animation: balloon-float ${duration}s ease-in forwards;
            box-shadow: inset -8px -8px 10px rgba(0,0,0,0.1);
          `;
          
          const string = document.createElement('div');
          string.style.cssText = ` 
            position: absolute;
            bottom: -15px;
            left: 50%;
            width: 2px;
            height: 20px;
            background: rgba(0,0,0,0.1);
            transform: translateX(-50%);
          `;
          balloon.appendChild(string);
          
          balloonContainer.appendChild(balloon);
        }, i * 200);
      }
      
      setTimeout(() => {
        balloonContainer.remove();
      }, 5000);
    }
  }

  // 3. Galeria com Filtros
  function initGallery() {
    const galleryItems = document.querySelectorAll('.galeria-item');
    const filterButtons = document.querySelectorAll('.filtro-btn');

    galleryItems.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-categoria');
        
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-categoria');
          
          if (filterValue === 'todos' || itemCategory === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  function initModal() {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-imagem');
    const closeBtn = document.querySelector('.fechar-modal');
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');
    
    // Adiciona botões de navegação
    prevBtn.innerHTML = '&larr;';
    nextBtn.innerHTML = '&rarr;';
    prevBtn.className = 'modal-btn prev-btn';
    nextBtn.className = 'modal-btn next-btn';
    
    modal.appendChild(prevBtn);
    modal.appendChild(nextBtn);
    
    let currentImageIndex = 0;
    let visibleImages = [];
    
    // Atualiza o array com as imagens visíveis (considerando o filtro ativo)
    function updateVisibleImages() {
      visibleImages = Array.from(document.querySelectorAll('.galeria-item img')).filter(img => {
        return window.getComputedStyle(img.closest('.galeria-item')).display !== 'none';
      });
    }
    
    // Ao clicar em uma imagem, atualiza a lista de imagens visíveis e abre o modal
    document.querySelectorAll('.galeria-item img').forEach(img => {
      img.addEventListener('click', function() {
        updateVisibleImages();
        currentImageIndex = visibleImages.findIndex(vi => vi === this);
        openModal(this.src);
      });
    });
    
    function openModal(src) {
      modal.style.display = 'block';
      modalImg.src = src;
      document.body.style.overflow = 'hidden';
    }
    
    function navigate(direction) {
      updateVisibleImages(); // Atualiza a lista sempre que navega
      if (!visibleImages.length) return;
      if (direction === 'prev') {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
      } else {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
      }
      modalImg.src = visibleImages[currentImageIndex].src;
    }
    
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate('prev');
    });
    
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate('next');
    });
    
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
          navigate('prev');
        } else if (e.key === 'ArrowRight') {
          navigate('next');
        } else if (e.key === 'Escape') {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      }
    });
  }
  
  // 5. Animar Seções
  function animateSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, 200 * index);
    });
  }
});

