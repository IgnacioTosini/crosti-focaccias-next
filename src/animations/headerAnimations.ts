import gsap from 'gsap';

export const animateHeader = (scope?: Element | string) => {
    return gsap.context(() => {
        const timeline = gsap.timeline({
            defaults: { ease: 'power4.out' }
        });

        // Logo: cae desde arriba con escala
        timeline.from('.logoContainer', {
            y: -100,
            scale: 0.4,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)'
        });

        // Nav items: cascade desde arriba
        timeline.from('.navLinks ul li', {
            y: -50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.6');

        // Botón mayoristas: escala + slide
        timeline.fromTo(
            '.buttonsContainer .wholesalersButton',
            { y: -40, scale: 0.5, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' }
        , '-=0.4');

        // Botón carrito: pop con rotación inicial
        timeline.fromTo(
            '.buttonsContainer .primaryButton',
            { scale: 0, opacity: 0, rotation: -20 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.5)' }
        , '-=0.3');
    }, scope);
};
