import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateAboutUs = (scope?: Element | string) => {
    return gsap.context(() => {
        // Estado inicial INMEDIATO — evita el flash de parpadeo con ScrollTrigger
        gsap.set('.aboutUsCharacterFloat', { autoAlpha: 0, x: 80, rotation: -25, scale: 0.4 });
        gsap.set('.aboutUsTitle', { autoAlpha: 0, y: 80 });
        gsap.set('.textContainer .aboutUsText', { autoAlpha: 0, y: 60 });
        gsap.set('.imageContainer img', { autoAlpha: 0, y: 80, rotation: -10, scale: 0.7 });
        gsap.set('.imageContainer .aboutUsText', { autoAlpha: 0, y: 40 });

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scope ?? '.aboutUsContainer',
                start: 'top 60%',
                once: true,
                invalidateOnRefresh: true
            },
            defaults: { ease: 'power4.out' }
        });

        // Personaje: vuela desde el costado con elastic y rotación
        timeline.to('.aboutUsCharacterFloat', {
            autoAlpha: 1, x: 0, rotation: 0, scale: 1,
            duration: 1.2, ease: 'elastic.out(1, 0.5)'
        });

        // Título: slide dramático desde abajo
        timeline.to('.aboutUsTitle', {
            autoAlpha: 1, y: 0,
            duration: 0.9, ease: 'back.out(1.7)'
        }, '-=0.8');

        // Textos con stagger pronunciado
        timeline.to('.textContainer .aboutUsText', {
            autoAlpha: 1, y: 0,
            duration: 0.8, stagger: 0.22, ease: 'power3.out'
        }, '-=0.5');

        // Imagen con rotación y escala dramática
        timeline.to('.imageContainer img', {
            autoAlpha: 1, y: 0, rotation: 0, scale: 1,
            duration: 1.1, ease: 'back.out(1.5)'
        }, '-=0.7');

        // Texto de imagen
        timeline.to('.imageContainer .aboutUsText', {
            autoAlpha: 1, y: 0,
            duration: 0.7, ease: 'power2.out'
        }, '-=0.5');
    }, scope);
};
