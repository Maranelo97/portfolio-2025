import { TestBed } from '@angular/core/testing';
import { LifeCycleService } from './lifeCycle';
import { ZoneService } from './zone';
import { Injector } from '@angular/core';

describe('LifeCycleService', () => {
  let service: LifeCycleService;
  let zoneServiceSpy: jasmine.SpyObj<ZoneService>;

  beforeEach(() => {
    const zoneServiceMock = jasmine.createSpyObj('ZoneService', ['runOutside']);

    TestBed.configureTestingModule({
      providers: [LifeCycleService, { provide: ZoneService, useValue: zoneServiceMock }],
    });
    service = TestBed.inject(LifeCycleService);
    zoneServiceSpy = TestBed.inject(ZoneService) as jasmine.SpyObj<ZoneService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('scheduleAnimationAfterRender should call callback when no options provided', (done) => {
    const callbackSpy = jasmine.createSpy('callback');

    service.scheduleAnimationAfterRender(callbackSpy);

    // afterNextRender is async, so we need to wait
    setTimeout(() => {
      expect(callbackSpy).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('scheduleAnimationAfterRender should call runOutside when runOutside option is true', (done) => {
    const callbackSpy = jasmine.createSpy('callback');
    zoneServiceSpy.runOutside.and.callFake((fn: any) => fn());

    service.scheduleAnimationAfterRender(callbackSpy, { runOutside: true });

    // afterNextRender is async, so we need to wait
    setTimeout(() => {
      expect(zoneServiceSpy.runOutside).toHaveBeenCalled();
      expect(callbackSpy).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('scheduleAnimationAfterRender should not call runOutside when runOutside option is false', (done) => {
    const callbackSpy = jasmine.createSpy('callback');

    service.scheduleAnimationAfterRender(callbackSpy, { runOutside: false });

    // afterNextRender is async, so we need to wait
    setTimeout(() => {
      expect(zoneServiceSpy.runOutside).not.toHaveBeenCalled();
      expect(callbackSpy).toHaveBeenCalled();
      done();
    }, 10);
  });
});
