import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  animateChild,
} from '@angular/animations';

export const navAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative', perspective: '1500px' }),

    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity, filter',
        }),
      ],
      { optional: true },
    ),

    group([
      query(
        ':leave',
        [
          animate(
            '500ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({
              opacity: 0,
              transform: 'scale(0.92) translateZ(-100px)',
              filter: 'blur(20px) brightness(0.5)',
            }),
          ),
        ],
        { optional: true },
      ),
      query(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'scale(1.08) translateZ(100px)',
            filter: 'blur(15px) brightness(1.5)',
          }),
          animate(
            '700ms 100ms cubic-bezier(0.05, 0.7, 0.1, 1)',
            style({
              opacity: 1,
              transform: 'scale(1) translateZ(0)',
              filter: 'blur(0px) brightness(1)',
            }),
          ),
        ],
        { optional: true },
      ),
      query(':enter', animateChild(), { optional: true }),
    ]),
  ]),
]);
