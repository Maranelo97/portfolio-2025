import {
  ListEntranceStrategy,
  HeroEntranceStrategy,
  FloatingHeartbeatStrategy,
  TechMorphStrategy,
  ResetTechMorphStrategy,
  DrawerEntranceStrategy,
  DrawerExitStrategy,
  ContactEntranceStrategy,
  StaggerScaleStrategy,
  ShakeErrorStrategy,
} from './index';

describe('Animation Strategies - Exports', () => {
  it('should export ListEntranceStrategy', () => {
    expect(ListEntranceStrategy).toBeDefined();
    const strategy = new ListEntranceStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should export HeroEntranceStrategy', () => {
    expect(HeroEntranceStrategy).toBeDefined();
    const strategy = new HeroEntranceStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should export FloatingHeartbeatStrategy', () => {
    expect(FloatingHeartbeatStrategy).toBeDefined();
    const strategy = new FloatingHeartbeatStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should export TechMorphStrategy', () => {
    expect(TechMorphStrategy).toBeDefined();
    const strategy = new TechMorphStrategy('angular');
    expect(strategy).toBeTruthy();
  });

  it('should export ResetTechMorphStrategy', () => {
    expect(ResetTechMorphStrategy).toBeDefined();
    const strategy = new ResetTechMorphStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should export DrawerEntranceStrategy', () => {
    expect(DrawerEntranceStrategy).toBeDefined();
    const strategy = new DrawerEntranceStrategy('.drawer', '.backdrop');
    expect(strategy).toBeTruthy();
  });

  it('should export DrawerExitStrategy', () => {
    expect(DrawerExitStrategy).toBeDefined();
    const onComplete = () => {};
    const strategy = new DrawerExitStrategy('.drawer', '.backdrop', onComplete);
    expect(strategy).toBeTruthy();
  });

  it('should export ContactEntranceStrategy', () => {
    expect(ContactEntranceStrategy).toBeDefined();
    const refs = {
      header: document.createElement('div'),
      form: document.createElement('form'),
      sidebar: document.createElement('aside'),
    };
    const strategy = new ContactEntranceStrategy(refs);
    expect(strategy).toBeTruthy();
  });

  it('should export StaggerScaleStrategy', () => {
    expect(StaggerScaleStrategy).toBeDefined();
    const strategy = new StaggerScaleStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should export ShakeErrorStrategy', () => {
    expect(ShakeErrorStrategy).toBeDefined();
    const strategy = new ShakeErrorStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should have all strategies implement IAnimationStrategy', () => {
    const listEntrance = new ListEntranceStrategy();
    expect(listEntrance.apply).toBeDefined();

    const heroEntrance = new HeroEntranceStrategy();
    expect(heroEntrance.apply).toBeDefined();

    const floating = new FloatingHeartbeatStrategy();
    expect(floating.apply).toBeDefined();

    const techMorph = new TechMorphStrategy('angular');
    expect(techMorph.apply).toBeDefined();

    const resetTech = new ResetTechMorphStrategy();
    expect(resetTech.apply).toBeDefined();

    const drawerEntrance = new DrawerEntranceStrategy('.drawer', '.backdrop');
    expect(drawerEntrance.apply).toBeDefined();

    const drawerExit = new DrawerExitStrategy('.drawer', '.backdrop', () => {});
    expect(drawerExit.apply).toBeDefined();

    const refs = {
      header: document.createElement('div'),
      form: document.createElement('form'),
      sidebar: document.createElement('aside'),
    };
    const contactEntrance = new ContactEntranceStrategy(refs);
    expect(contactEntrance.apply).toBeDefined();

    const staggerScale = new StaggerScaleStrategy();
    expect(staggerScale.apply).toBeDefined();

    const shakeError = new ShakeErrorStrategy();
    expect(shakeError.apply).toBeDefined();
  });
});
