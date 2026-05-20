import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateItemCard = (element: HTMLElement, index: number = 0) => {
    return gsap.context(() => {
        // Estado inicial para evitar parpadeo (fix flash)
        gsap.set(element, { autoAlpha: 0, y: 80, scale: 0.75 });

        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                once: true,
                invalidateOnRefresh: true
            },
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.08,
            ease: 'back.out(1.7)'
        });
    }, element);
};
