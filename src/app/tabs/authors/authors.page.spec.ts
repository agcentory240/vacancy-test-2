import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorsPage } from './authors.page';

describe('AuthorsPage', () => {
  let component: AuthorsPage;
  let fixture: ComponentFixture<AuthorsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AuthorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
