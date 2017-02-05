/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StardewComponent } from './stardew.component';

describe('StardewComponent', () => {
  let component: StardewComponent;
  let fixture: ComponentFixture<StardewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StardewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StardewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
