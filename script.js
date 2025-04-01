document.addEventListener('DOMContentLoaded', function() {
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

  // 4. Modal para Imagens Ampliadas (COM BOTÕES DE NAVEGAÇÃO)
  function initModal() {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-imagem');
    const closeBtn = document.querySelector('.fechar-modal');
    const galleryImages = document.querySelectorAll('.galeria-item img');
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
    const imagesArray = Array.from(galleryImages);
    
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', function() {
        currentImageIndex = index;
        openModal(this.src);
      });
    });
    
    function openModal(src) {
      modal.style.display = 'block';
      modalImg.src = src;
      document.body.style.overflow = 'hidden';
    }
    
    function navigate(direction) {
      if (direction === 'prev') {
        currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
      } else {
        currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
      }
      modalImg.src = imagesArray[currentImageIndex].src;
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
    
    // Navegação por teclado
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

// 6. Estilos Dinâmicos (incluindo estilos para os botões do modal)
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(233, 30, 99, 0.2);
    border-radius: 50%;
    border-top-color: #e91e63;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  .loading-screen p {
    font-family: 'Pacifico', cursive;
    color: #e91e63;
    font-size: 1.5rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Animação dos balões */
  @keyframes balloon-float {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(10deg);
      opacity: 0.7;
    }
  }
  
  .balloon {
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  }
  
  .balloon::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 12px;
    height: 15px;
    background: inherit;
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    transform: translateX(-50%);
    opacity: 0.8;
  }
  
  /* Efeitos de navegação */
  nav a, .filtro-btn {
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  nav a:hover, .filtro-btn:hover {
    transform: translateY(-2px);
  }
  
  nav a:active, .filtro-btn:active {
    transform: translateY(1px);
  }
  
  /* Seções */
  section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  
  /* Botões do Modal */
  .modal-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    z-index: 1001;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-btn:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }
  
  .prev-btn {
    left: 20px;
  }
  
  .next-btn {
    right: 20px;
  }
`;
document.head.appendChild(dynamicStyles);