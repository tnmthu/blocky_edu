import {
    transition,
    state,
    style,
    trigger,
    animate,
    animation,
    keyframes,
    AnimationTriggerMetadata
} from '@angular/animations';

export function fadeIn(name: string, duration: string, delay: string): AnimationTriggerMetadata {
    return trigger(name, [
        transition(':enter', [
            style({
                opacity: 0,
            }),
            animate(
                `${duration} ${delay} ease-in`,
                style({
                    opacity: 1,
                })
            )
        ])
    ]);
}

export function slideInRight(name: string, right: string, duration: string, delay: string): AnimationTriggerMetadata {
    return trigger(name, [
        transition(':enter', [
            style({
                transform: `translateX(${right}%)`,
                opacity: 0,
            }),
            animate(
                `${duration} ${delay} ease-in`,
                style({
                    transform: 'translateX(0%)',
                    opacity: 1
                })
            )
        ])
    ])
}

export function typeWriting(name: string, duration: string, delay: string): AnimationTriggerMetadata {
    return trigger(name, [
        transition(':enter', [
            style({
                width: '0%',
            }),
            animate(
                `${duration} ${delay} ease-in`,
                style({
                    width: '100%',
                })
            )
        ])
    ])
}

export function rotate3D(name: string, duration: string, delay: string): AnimationTriggerMetadata {
    return trigger(name, [
        transition(':enter', [
            style({
                transform: 'rotateY(90deg)',
            }),
            animate(
                `${duration} ${delay} ease-in`,
                style({
                    transform: 'none'
                })
            )
        ])
    ])
}