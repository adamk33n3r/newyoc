/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TeamSpeakComponent } from './teamspeak.component';

describe('TeamSpeakComponent', () => {
  let component: TeamSpeakComponent;
  let fixture: ComponentFixture<TeamSpeakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamSpeakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSpeakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
