import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateWholesalersHeader = (scope?: Element | string) => {
    return gsap.context(() => {
        gsap.set('.logoContainer', { autoAlpha: 0, y: -70, scale: 0.65, rotation: -10 });
        gsap.set('.navLinks ul li', { autoAlpha: 0, y: -40, scale: 0.8 });

        const timeline = gsap.timeline({
            defaults: { ease: 'power4.out' }
        });

        timeline.to('.logoContainer', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: 'back.out(1.9)'
        });

        timeline.to('.navLinks ul li', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: 'back.out(1.7)'
        }, '-=0.55');
    }, scope);
};

export const animateWholesalersHero = (scope?: Element | string) => {
    return gsap.context(() => {
        gsap.set('.contentLeft .badge', { autoAlpha: 0, x: -70, rotation: -8, scale: 0.7 });
        gsap.set('.contentLeft .title', { autoAlpha: 0, y: 90, rotation: -4, scale: 0.85 });
        gsap.set('.contentLeft .title span', { autoAlpha: 0, y: 20, scale: 0.85 });
        gsap.set('.contentLeft .description', { autoAlpha: 0, y: 55 });
        gsap.set('.placesList .placeCard', { autoAlpha: 0, y: 45, scale: 0.75, rotation: -5 });
        gsap.set('.buttonsContainer a', { autoAlpha: 0, y: 45, scale: 0.8 });
        gsap.set('.heroMedia .heroImage', { autoAlpha: 0, x: 95, rotation: 8, scale: 0.75 });
        gsap.set('.heroMedia .qualityBadgeContainer', { autoAlpha: 0, y: 38, x: 20, scale: 0.6 });

        const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

        timeline.to('.contentLeft .badge', {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(2.1)'
        });

        timeline.to('.contentLeft .title', {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.8)'
        }, '-=0.65');

        timeline.to('.contentLeft .title span', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'elastic.out(1, 0.65)'
        }, '-=0.45');

        timeline.to('.contentLeft .description', {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.5');

        timeline.to('.placesList .placeCard', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'back.out(1.6)'
        }, '-=0.35');

        timeline.to('.buttonsContainer a', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: 'back.out(2.3)'
        }, '-=0.4');

        timeline.to('.heroMedia .heroImage', {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 1.15,
            ease: 'back.out(1.6)'
        }, '-=1');

        timeline.to('.heroMedia .qualityBadgeContainer', {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.95,
            ease: 'elastic.out(1, 0.7)'
        }, '-=0.55');
    }, scope);
};

export const animateWhyCrosti = (scope?: Element | string) => {
    return gsap.context(() => {
        gsap.set('.titleStickerLeft', { autoAlpha: 0, x: -95, y: 30, rotation: -30, scale: 0.45 });
        gsap.set('.titleStickerRight', { autoAlpha: 0, x: 95, y: -20, rotation: 30, scale: 0.45 });
        gsap.set('.title h1', { autoAlpha: 0, y: 80, rotation: -4, scale: 0.82 });
        gsap.set('.title h2', { autoAlpha: 0, y: 35 });
        gsap.set('.whyCrostiCards .whyCard', { autoAlpha: 0, y: 85, scale: 0.78, rotation: -4 });
        gsap.set('.whyCrostiCards .whyCard .whyCardIcon', { autoAlpha: 0, scale: 0.2, rotation: -30 });

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scope ?? '.whyCrosti',
                start: 'top 65%',
                once: true,
                invalidateOnRefresh: true
            },
            defaults: { ease: 'power4.out' }
        });

        timeline.to('.titleStickerLeft', {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(2.4)'
        });

        timeline.to('.title h1', {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.95,
            ease: 'back.out(1.8)'
        }, '-=0.65');

        timeline.to('.titleStickerRight', {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(2.4)'
        }, '<');

        timeline.to('.title h2', {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
        }, '-=0.55');

        timeline.to('.whyCrostiCards .whyCard', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.11,
            ease: 'back.out(1.4)'
        }, '-=0.45');

        timeline.to('.whyCrostiCards .whyCard .whyCardIcon', {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'elastic.out(1, 0.8)'
        }, '-=0.9');
    }, scope);
};

export const animateProcess = (scope?: Element | string) => {
    return gsap.context(() => {
        gsap.set('.titleStickerLeft', { autoAlpha: 0, x: -85, y: -12, rotation: -28, scale: 0.45 });
        gsap.set('.titleStickerRight', { autoAlpha: 0, x: 85, y: 12, rotation: 28, scale: 0.45 });
        gsap.set('.title h1', { autoAlpha: 0, y: 80, scale: 0.8 });
        gsap.set('.title h2', { autoAlpha: 0, y: 40 });
        gsap.set('.processSteps .stepCard', { autoAlpha: 0, x: 85, y: 30, scale: 0.85 });
        gsap.set('.processSteps .stepCard .stepMarker', { autoAlpha: 0, scale: 0.2, rotation: -45 });
        gsap.set('.processSteps .stepCard .stepContent', { autoAlpha: 0, y: 25 });

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scope ?? '.processSection',
                start: 'top 65%',
                once: true,
                invalidateOnRefresh: true
            },
            defaults: { ease: 'power4.out' }
        });

        timeline.to('.titleStickerLeft', {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(2.4)'
        });

        timeline.to('.title h1', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'back.out(1.7)'
        }, '-=0.65');

        timeline.to('.titleStickerRight', {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(2.4)'
        }, '<');

        timeline.to('.title h2', {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
        }, '-=0.5');

        timeline.to('.processSteps .stepCard', {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.16,
            ease: 'back.out(1.35)'
        }, '-=0.4');

        timeline.to('.processSteps .stepCard .stepContent', {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=1.15');

        timeline.to('.processSteps .stepCard .stepMarker', {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.62,
            stagger: 0.15,
            ease: 'elastic.out(1, 0.7)'
        }, '-=1.1');
    }, scope);
};

export const animateWholesalersContact = (scope?: Element | string) => {
    return gsap.context(() => {
        gsap.set('.titleStickerLeft', { autoAlpha: 0, x: -95, rotation: -24, scale: 0.45 });
        gsap.set('.titleStickerRight', { autoAlpha: 0, x: 95, rotation: 24, scale: 0.45 });
        gsap.set('.title h1', { autoAlpha: 0, y: 75, scale: 0.82 });
        gsap.set('.title h2', { autoAlpha: 0, y: 40 });
        gsap.set('.wholesalersForm', { autoAlpha: 0, y: 90, scale: 0.9, rotationX: 18, transformOrigin: '50% 0%' });
        gsap.set('.wholesalersForm .fieldGroup', { autoAlpha: 0, y: 28 });
        gsap.set('.wholesalersForm .whatsappButton', { autoAlpha: 0, y: 35, scale: 0.85 });
        gsap.set('.wholesalersForm .formFootnote', { autoAlpha: 0, y: 16 });

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scope ?? '.wholesalersContact',
                start: 'top 68%',
                once: true,
                invalidateOnRefresh: true
            },
            defaults: { ease: 'power4.out' }
        });

        timeline.to('.titleStickerLeft', {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(2.5)'
        });

        timeline.to('.title h1', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
            ease: 'back.out(1.7)'
        }, '-=0.65');

        timeline.to('.titleStickerRight', {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(2.5)'
        }, '<');

        timeline.to('.title h2', {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
        }, '-=0.55');

        timeline.to('.wholesalersForm', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.05,
            ease: 'back.out(1.4)'
        }, '-=0.3');

        timeline.to('.wholesalersForm .fieldGroup', {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power3.out'
        }, '-=0.75');

        timeline.to('.wholesalersForm .whatsappButton', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'back.out(2.2)'
        }, '-=0.35');

        timeline.to('.wholesalersForm .formFootnote', {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out'
        }, '-=0.35');
    }, scope);
};