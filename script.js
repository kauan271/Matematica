// Lazy loading para iframes de vídeo
document.addEventListener('DOMContentLoaded', function() {
    // Carregar vídeos quando estiverem visíveis
    const lazyVideos = document.querySelectorAll('.video-container');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector('iframe');
                if (iframe && !iframe.src) {
                    // Adiciona o src a partir do data-src
                    iframe.src = iframe.dataset.src;
                    // Remove o placeholder de loading
                    entry.target.style.background = 'none';
                }
                videoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    lazyVideos.forEach(video => {
        videoObserver.observe(video);
    });

    // Botão voltar ao topo
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Suave scroll para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para o header fixo
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Verificar e corrigir links de vídeo quebrados
function checkVideoLinks() {
    const iframes = document.querySelectorAll('.video-container iframe');
    
    iframes.forEach(iframe => {
        const src = iframe.getAttribute('data-src') || iframe.getAttribute('src');
        
        // Verifica se é um link do YouTube válido
        if (src && src.includes('youtube.com')) {
            // Garante que é um link de embed
            if (!src.includes('embed')) {
                const videoId = src.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
                if (videoId && videoId[1]) {
                    iframe.setAttribute('data-src', `https://www.youtube.com/embed/${videoId[1]}`);
                }
            }
        }
    });
}

// Executar a verificação quando a página carregar
window.addEventListener('load', checkVideoLinks);