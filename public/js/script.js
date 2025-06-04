// Adiciona efeitos de fade-in quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar efeito fade-in a elementos
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Confirmação para exclusões
    const deleteButtons = document.querySelectorAll('button[onclick*="confirm"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Tem certeza que deseja excluir este item?')) {
                e.preventDefault();
            }
        });
    });

    // Tooltip simples para badges de status
    const statusBadges = document.querySelectorAll('.status-badge, .priority-badge');
    statusBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Adicionar ícones aos status se não existirem
    const statusElements = document.querySelectorAll('.status-badge');
    statusElements.forEach(element => {
        const status = element.textContent.trim().toLowerCase();
        let icon = '';
        
        switch(status) {
            case 'pendente':
                icon = '⏳ ';
                break;
            case 'em progresso':
                icon = '🔄 ';
                break;
            case 'concluida':
            case 'concluída':
                icon = '✅ ';
                break;
            case 'cancelada':
                icon = '❌ ';
                break;
        }
        
        if (icon && !element.textContent.includes(icon)) {
            element.textContent = icon + element.textContent;
        }
    });

    // Adicionar ícones às prioridades se não existirem
    const priorityElements = document.querySelectorAll('.priority-badge');
    priorityElements.forEach(element => {
        const priority = element.textContent.trim().toLowerCase();
        let icon = '';
        
        switch(priority) {
            case 'baixa':
                icon = '🔽 ';
                break;
            case 'media':
            case 'média':
                icon = '➡️ ';
                break;
            case 'alta':
                icon = '🔺 ';
                break;
            case 'urgente':
                icon = '🔥 ';
                break;
        }
        
        if (icon && !element.textContent.includes(icon)) {
            element.textContent = icon + element.textContent;
        }
    });
});

// Função para animar elementos quando aparecem na tela
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .feature');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// Executar animação no scroll
window.addEventListener('scroll', animateOnScroll);
