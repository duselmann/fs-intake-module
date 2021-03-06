import { Directive, OnInit, Input, Output, HostListener, EventEmitter, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTrackScroll]'
})
export class TrackScrollDirective implements OnInit {
  @Input() offset = 0;
  @Input() position = 'top';
  @Output() trackScrollEnter = new EventEmitter<boolean>();
  @Output() trackScrollLeave = new EventEmitter<boolean>();

  constructor(private element: ElementRef) {}

  @HostListener('document:scroll', ['$event'])
  public track(event: Event) {
    this.getPositions();
  }

  public getPositions() {
    const offsetTop = this.element.nativeElement.offsetTop;
    const offsetHeight = this.element.nativeElement.offsetHeight;
    const offsetBottom = offsetTop + offsetHeight + Number(this.offset);
    const scrollY: number = window.scrollY + window.innerHeight;

    if (this.position === 'top' && offsetTop <= scrollY) {
      this.trackScrollEnter.emit(true);
    }

    if (this.position === 'bottom' && offsetBottom <= scrollY) {
      this.trackScrollEnter.emit(true);
    }

    if (this.position === 'top' && offsetTop > scrollY) {
      this.trackScrollLeave.emit(true);
    }

    if (this.position === 'bottom' && offsetBottom > scrollY) {
      this.trackScrollLeave.emit(true);
    }
  }

  public ngOnInit() {
    this.getPositions();
  }
}
