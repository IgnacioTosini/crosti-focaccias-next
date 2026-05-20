import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateOurMenu = (scope?: Element | string) => {
    return gsap.context(() => {
        // Estado inicial para evitar parpadeo (fix flash)
        gsap.set('.ourMenuTitle', { autoAlpha: 0, y: 90, rotation: -4, scale: 0.75 });
        gsap.set('.extraInfo', { autoAlpha: 0, y: 60, scale: 0.8 });

        // Recalcular posiciones tras carga asíncrona de datos
        ScrollTrigger.refresh();

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scope ?? '.ourMenu',
                start: 'top 60%',
                once: true,
                invalidateOnRefresh: true
            },
            defaults: { ease: 'power4.out' }
        });

        // Título: slide y rotación pronunciada
        timeline.to('.ourMenuTitle', {
            autoAlpha: 1, y: 0, rotation: 0, scale: 1,
            duration: 1, ease: 'back.out(1.7)'
        });

        // Extra info: pop desde abajo
        timeline.to('.extraInfo', {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.8, ease: 'back.out(1.5)'
        }, '-=0.4');
    }, scope);
};
