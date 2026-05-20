import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateConnectUs = (scope?: Element | string) => {
    return gsap.context(() => {
        // Estado inicial para evitar parpadeo (fix flash)
        gsap.set('.connectCharacter', { autoAlpha: 0, x: -90, rotation: -25, scale: 0.4 });
        gsap.set('.connectUsTitle', { autoAlpha: 0, y: 90, scale: 0.7 });
        gsap.set('.connectSticker', { autoAlpha: 0, x: 90, rotation: 25, scale: 0.4 });
        gsap.set('.connectCardsContainer > *', { autoAlpha: 0, y: 80, scale: 0.75 });

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scope ?? '.connectUs',
                start: 'top 60%',
                once: true,
                invalidateOnRefresh: true
            },
            defaults: { ease: 'power4.out' },
        });

        // Personaje: vuela desde el costado con elastic
        timeline.to('.connectCharacter', {
            autoAlpha: 1, x: 0, rotation: 0, scale: 1,
            duration: 1.2, ease: 'elastic.out(1, 0.5)'
        });

        // Título: pop desde abajo
        timeline.to('.connectUsTitle', {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 1, ease: 'back.out(1.7)'
        }, '-=0.8');

        // Sticker: simultáneo al título con elastic
        timeline.to('.connectSticker', {
            autoAlpha: 1, x: 0, rotation: 0, scale: 1,
            duration: 1.2, ease: 'elastic.out(1, 0.5)'
        }, '<');

        // Tarjetas: aparecen desde abajo con escala y stagger
        timeline.to('.connectCardsContainer > *', {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.9, stagger: 0.22, ease: 'back.out(1.5)'
        }, '-=0.6');
    }, scope);
};
