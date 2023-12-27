import { TestBed } from '@angular/core/testing';

import { LoginStatusGuard } from './login-status.guard';

describe('LoginStatusGuard', () => {
  let guard: LoginStatusGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginStatusGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
