import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateHowToOrder = (scope?: Element | string) => {
    return gsap.context(() => {
        // Estado inicial INMEDIATO — evita el flash de parpadeo con ScrollTrigger
        gsap.set('.titleStickerLeft', { autoAlpha: 0, x: -100, rotation: -30, scale: 0.4 });
        gsap.set('.howToOrderTitle', { autoAlpha: 0, y: 90 });
        gsap.set('.titleStickerRight', { autoAlpha: 0, x: 100, rotation: 30, scale: 0.4 });
        gsap.set('.howToOrderSteps .step', { autoAlpha: 0, y: 80, scale: 0.8 });

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scope ?? '.howToOrder',
                start: 'top 60%',
                once: true,
                invalidateOnRefresh: true
            },
            defaults: { ease: 'power4.out' },
        });

        // Sticker izquierdo: vuela desde el costado con rotación y pop
        timeline.to('.titleStickerLeft', {
            autoAlpha: 1, x: 0, rotation: 0, scale: 1,
            duration: 1, ease: 'back.out(2.5)'
        });

        // Título: slide dramático desde abajo
        timeline.to('.howToOrderTitle', {
            autoAlpha: 1, y: 0,
            duration: 1, ease: 'back.out(1.7)'
        }, '-=0.7');

        // Sticker derecho: simultáneo al título
        timeline.to('.titleStickerRight', {
            autoAlpha: 1, x: 0, rotation: 0, scale: 1,
            duration: 1, ease: 'back.out(2.5)'
        }, '<');

        // Pasos: aparecen desde abajo con escala y stagger
        timeline.to('.howToOrderSteps .step', {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.9, stagger: 0.3, ease: 'back.out(1.5)'
        }, '-=0.5');
    }, scope);
};
