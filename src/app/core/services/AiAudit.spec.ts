import { TestBed } from '@angular/core/testing';
import { AiAuditService } from './AiAudit';
import { environment } from '../../environments/environment';

describe('AiAuditService', () => {
  let service: AiAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiAuditService],
    });
    service = TestBed.inject(AiAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProjectAudit should parse successful JSON response', async () => {
    const mockProject = {
      id: 'test',
      title: 'Test Project',
      fullDescription: 'Test description',
    } as any;

    const mockResponse = {
      insight: 'Test insight',
      blueprint: 'A -> B -> C',
    };

    spyOn<any>(service['model'], 'generateContent').and.returnValue(
      Promise.resolve({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      }),
    );

    const result = await service.getProjectAudit('React', mockProject);

    expect(result).toEqual(mockResponse);
  });

  it('getProjectAudit should remove markdown code blocks from response', async () => {
    const mockProject = {
      id: 'test',
      title: 'Test Project',
      fullDescription: 'Test description',
    } as any;

    const mockResponse = {
      insight: 'Test insight',
      blueprint: 'A -> B -> C',
    };

    spyOn<any>(service['model'], 'generateContent').and.returnValue(
      Promise.resolve({
        response: {
          text: () => `\`\`\`json\n${JSON.stringify(mockResponse)}\n\`\`\``,
        },
      }),
    );

    const result = await service.getProjectAudit('React', mockProject);

    expect(result).toEqual(mockResponse);
  });

  it('getProjectAudit should return fallback response on error', async () => {
    const mockProject = {
      id: 'test',
      title: 'Test Project',
      fullDescription: 'Test description',
    } as any;

    spyOn<any>(service['model'], 'generateContent').and.returnValue(
      Promise.reject(new Error('API Error')),
    );

    spyOn(console, 'error');

    const result = await service.getProjectAudit('React', mockProject);

    expect(result).toEqual({
      insight: 'Análisis de React optimizado para el ecosistema del proyecto.',
      blueprint: 'Client -> [React Logic] -> Render',
    });
    expect(console.error).toHaveBeenCalledWith('AI Audit Error:', jasmine.any(Error));
  });

  it('getProjectAudit should handle JSON.parse errors with fallback', async () => {
    const mockProject = {
      id: 'test',
      title: 'Test Project',
      fullDescription: 'Test description',
    } as any;

    spyOn<any>(service['model'], 'generateContent').and.returnValue(
      Promise.resolve({
        response: {
          text: () => 'Invalid JSON',
        },
      }),
    );

    spyOn(console, 'error');

    const result = await service.getProjectAudit('Angular', mockProject);

    expect(result).toEqual({
      insight: 'Análisis de Angular optimizado para el ecosistema del proyecto.',
      blueprint: 'Client -> [Angular Logic] -> Render',
    });
  });

  it('executeAuditWithUI should call onLoading with true then false', async () => {
    const mockProject = {
      id: 'test',
      title: 'Test Project',
      fullDescription: 'Test description',
    } as any;

    const mockResponse = {
      insight: 'Test insight',
      blueprint: 'A -> B -> C',
    };

    spyOn<any>(service['model'], 'generateContent').and.returnValue(
      Promise.resolve({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      }),
    );

    const callbacks = {
      onLoading: jasmine.createSpy('onLoading'),
      onResult: jasmine.createSpy('onResult'),
      onError: jasmine.createSpy('onError'),
    };

    await service.executeAuditWithUI('React', mockProject, callbacks);

    expect(callbacks.onLoading).toHaveBeenCalledWith(true);
    expect(callbacks.onLoading).toHaveBeenCalledWith(false);
  });

  it('executeAuditWithUI should call onResult on success', async () => {
    const mockProject = {
      id: 'test',
      title: 'Test Project',
      fullDescription: 'Test description',
    } as any;

    const mockResponse = {
      insight: 'Test insight',
      blueprint: 'A -> B -> C',
    };

    spyOn<any>(service['model'], 'generateContent').and.returnValue(
      Promise.resolve({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      }),
    );

    const callbacks = {
      onLoading: jasmine.createSpy('onLoading'),
      onResult: jasmine.createSpy('onResult'),
      onError: jasmine.createSpy('onError'),
    };

    await service.executeAuditWithUI('React', mockProject, callbacks);

    expect(callbacks.onResult).toHaveBeenCalledWith(mockResponse);
  });

  it('executeAuditWithUI should call onLoading false in finally block even on error', async () => {
    const mockProject = {
      id: 'test',
      title: 'Test Project',
      fullDescription: 'Test description',
    } as any;

    spyOn<any>(service['model'], 'generateContent').and.returnValue(
      Promise.reject(new Error('API Error')),
    );

    spyOn(console, 'error');

    const callbacks = {
      onLoading: jasmine.createSpy('onLoading'),
      onResult: jasmine.createSpy('onResult'),
      onError: jasmine.createSpy('onError'),
    };

    await service.executeAuditWithUI('React', mockProject, callbacks);

    expect(callbacks.onLoading).toHaveBeenCalledWith(false);
  });

  it('getProjectAudit should preserve JSON structure when no markdown present', async () => {
    const mockProject = {
      id: 'test',
      title: 'Test Project',
      fullDescription: 'Test description',
    } as any;

    const mockResponse = {
      insight: 'Complex insight with "quotes"',
      blueprint: 'A -> B -> C -> D',
    };

    spyOn<any>(service['model'], 'generateContent').and.returnValue(
      Promise.resolve({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      }),
    );

    const result = await service.getProjectAudit('TypeScript', mockProject);

    expect(result.insight).toBe(mockResponse.insight);
    expect(result.blueprint).toBe(mockResponse.blueprint);
  });
});
