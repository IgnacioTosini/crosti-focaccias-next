import gsap from 'gsap';

export const animateBanner = (scope?: Element | string) => {
    return gsap.context(() => {
        const timeline = gsap.timeline({
            defaults: { ease: 'power4.out' }
        });

        // Logo/imagen: aparece con escala dramática
        timeline.from('.bannerContainer', {
            scale: 0.3,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.5)'
        });

        // Sticker izquierdo: entra desde lejos con rotación
        timeline.from('.bannerStickerLeft', {
            x: -120,
            rotation: -35,
            opacity: 0,
            scale: 0.3,
            duration: 1,
            ease: 'back.out(2)'
        }, '-=0.7');

        // Sticker derecho: simultáneo al izquierdo
        timeline.from('.bannerStickerRight', {
            x: 120,
            rotation: 35,
            opacity: 0,
            scale: 0.3,
            duration: 1,
            ease: 'back.out(2)'
        }, '<');

        // Título: slide dramático desde abajo
        timeline.from('.bannerTitle', {
            y: 100,
            opacity: 0,
            duration: 0.9,
            ease: 'power4.out'
        }, '-=0.6');

        // Span del título: pop elástico
        timeline.from('.bannerTitle span', {
            scale: 0,
            opacity: 0,
            duration: 0.9,
            ease: 'elastic.out(1, 0.5)'
        }, '-=0.5');

        // Subtítulo
        timeline.from('.bannerSubtitle', {
            y: 50,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.5');

        // Botones: aparecen con pop y stagger
        timeline.from('.buttonsContainer > *', {
            y: 50,
            scale: 0.5,
            opacity: 0,
            duration: 0.7,
            stagger: 0.18,
            ease: 'back.out(2.5)'
        }, '-=0.4');
    }, scope);
};
