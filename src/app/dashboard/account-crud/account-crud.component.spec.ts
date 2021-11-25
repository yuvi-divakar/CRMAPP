import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCRUDComponent } from './account-crud.component';

describe('AccountCRUDComponent', () => {
  let component: AccountCRUDComponent;
  let fixture: ComponentFixture<AccountCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCRUDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
