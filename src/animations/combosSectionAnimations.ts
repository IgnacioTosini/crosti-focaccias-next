import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateCombosSection = (scope?: Element | string) => {
    return gsap.context(() => {
        // Estado inicial INMEDIATO — evita el flash de parpadeo con ScrollTrigger
        gsap.set('.combosTitle', { autoAlpha: 0, y: 80, rotation: -4, scale: 0.75 });
        gsap.set('.combosGrid > *', { autoAlpha: 0, y: 90, scale: 0.75 });

        // Recalcular posiciones tras carga asíncrona
        ScrollTrigger.refresh();

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scope ?? '.combosSection',
                start: 'top 60%',
                once: true,
                invalidateOnRefresh: true
            },
            defaults: { ease: 'power4.out' }
        });

        // Título: slide con rotación y escala
        timeline.to('.combosTitle', {
            autoAlpha: 1, y: 0, rotation: 0, scale: 1,
            duration: 1, ease: 'back.out(1.7)'
        });

        // Cards de combos: aparecen desde abajo con escala y stagger
        timeline.to('.combosGrid > *', {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.9, stagger: 0.22, ease: 'back.out(1.5)'
        }, '-=0.5');
    }, scope);
};
