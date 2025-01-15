import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnChanges,
  Optional,
  Output,
  Renderer2,
  Self,
  SimpleChanges,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith } from 'rxjs';

@Directive({
  selector: '[appCustomPagination]',
  standalone: true,
})
export class CustomPaginationDirective implements AfterViewInit, OnChanges {
  @Output() pageIndexChangeEmitter: EventEmitter<number> =
    new EventEmitter<number>();

  @Input() appCustomLength: number = 0;
  @Input() renderButtonsNumber: number = 2;
  @Input() showFirstButton: boolean = true;
  @Input() showLastButton: boolean = true;

  private dotsEndRef!: HTMLElement;
  private dotsStartRef!: HTMLElement;
  private customContainerRef!: HTMLElement;

  private buttonsRef: HTMLElement[] = [];

  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private elementRef: ElementRef,
    private ren: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.styleDefaultPagination();
    this.createCustomDivRef();
    this.renderButtons();

    const initialIndex = this.matPag.pageIndex - 1 || 0;
    const prevIndex = initialIndex - 1 || 0;
    this.changeActiveButtonStyles(prevIndex, initialIndex);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['appCustomLength']?.firstChange) {
      this.removeButtons();

      this.switchPage(0);
      this.renderButtons();
    }
  }

  private styleDefaultPagination(): void {
    const nativeElement = this.elementRef.nativeElement;

    const itemsPerPage = nativeElement.querySelector(
      '.mat-mdc-paginator-page-size'
    );
    const howManyDisplayedEl = nativeElement.querySelector(
      '.mat-mdc-paginator-range-label'
    );

    this.ren.setStyle(itemsPerPage, 'display', 'none');
    this.ren.setStyle(howManyDisplayedEl, 'display', 'none');
  }

  private createCustomDivRef(): void {
    const nativeElement = this.elementRef.nativeElement;

    const actionContainer = nativeElement.querySelector(
      'div.mat-mdc-paginator-range-actions'
    );
    const nextButtonDefault = nativeElement.querySelector(
      'button.mat-mdc-paginator-navigation-next'
    );

    this.customContainerRef = this.ren.createElement('div') as HTMLElement;
    this.ren.addClass(this.customContainerRef, 'custom-paginator-container');

    this.ren.insertBefore(
      actionContainer,
      this.customContainerRef,
      nextButtonDefault
    );
  }

  private removeButtons(): void {
    this.buttonsRef.forEach((button) => {
      this.ren.removeChild(this.customContainerRef, button);
    });

    this.ren.removeChild(this.customContainerRef, this.dotsStartRef);
    this.ren.removeChild(this.customContainerRef, this.dotsEndRef);

    this.buttonsRef.length = 0;
  }

  private renderButtons(): void {
    this.buildButtons();

    this.matPag.page
      .pipe(
        map((e) => [e.previousPageIndex ?? 0, e.pageIndex]),
        startWith([0, 0])
      )
      .subscribe(([prev, curr]) => {
        this.changeActiveButtonStyles(prev, curr);
      });
  }

  private changeActiveButtonStyles(
    previousIndex: number,
    newIndex: number
  ): void {
    const previouslyActive = this.buttonsRef[previousIndex];
    const currentActive = this.buttonsRef[newIndex];
    console.log('this.buttonsRef', this.buttonsRef);
    console.log('newIndex', newIndex);
    console.log('currentActive', currentActive);

    if (previouslyActive)
      this.ren.removeClass(previouslyActive, 'custom-page-button_active');
    if (currentActive)
      this.ren.addClass(currentActive, 'custom-page-button_active');

    this.buttonsRef.forEach((button) => {
      this.ren.setStyle(button, 'display', 'none');
    });

    const renderElements = this.renderButtonsNumber;
    const endDots = newIndex + renderElements < this.buttonsRef.length - 1;
    const startDots = newIndex - renderElements > 0;

    const firstButton = this.buttonsRef[0];
    const lastButton = this.buttonsRef[this.buttonsRef.length - 1];

    if (this.showLastButton) {
      this.ren.setStyle(this.dotsEndRef, 'display', endDots ? 'block' : 'none');
      this.ren.setStyle(lastButton, 'display', 'flex');
    }

    if (this.showFirstButton) {
      this.ren.setStyle(
        this.dotsStartRef,
        'display',
        startDots ? 'block' : 'none'
      );
      this.ren.setStyle(firstButton, 'display', 'flex');
    }

    const startingIndex = Math.max(
      0,
      startDots ? newIndex - renderElements : 0
    );
    const endingIndex = Math.min(
      this.buttonsRef.length,
      endDots ? newIndex + renderElements + 1 : this.buttonsRef.length
    );

    for (let i = startingIndex; i < endingIndex; i++) {
      const button = this.buttonsRef[i];
      this.ren.setStyle(button, 'display', 'flex');
    }
  }

  private buildButtons(): void {
    const neededButtons = Math.ceil(
      this.appCustomLength / this.matPag.pageSize
    );

    if (neededButtons === 1) {
      this.ren.setStyle(this.elementRef.nativeElement, 'display', 'none');
      return;
    } else {
      this.ren.setStyle(this.elementRef.nativeElement, 'display', 'block');
    }

    this.buttonsRef = [this.createButton(0)];

    this.dotsStartRef = this.createDotsElement();

    for (let index = 1; index < neededButtons - 1; index++) {
      this.buttonsRef = [...this.buttonsRef, this.createButton(index)];
    }

    this.dotsEndRef = this.createDotsElement();

    this.buttonsRef = [
      ...this.buttonsRef,
      this.createButton(neededButtons - 1),
    ];
  }

  private createButton(i: number): HTMLElement {
    const pageButton = this.ren.createElement('button');
    const text = this.ren.createText(String(i + 1));

    this.ren.addClass(pageButton, 'custom-page-button');
    this.ren.appendChild(pageButton, text);

    this.ren.listen(pageButton, 'click', () => {
      this.switchPage(i);
    });

    this.ren.appendChild(this.customContainerRef, pageButton);

    this.ren.setStyle(pageButton, 'display', 'none');

    return pageButton;
  }

  private createDotsElement(): HTMLElement {
    const dotsEl = this.ren.createElement('span');
    const dotsText = this.ren.createText('...');

    this.ren.setStyle(dotsEl, 'font-size', '18px');
    this.ren.setStyle(dotsEl, 'margin-right', '8px');
    this.ren.setStyle(dotsEl, 'padding-top', '6px');
    this.ren.setStyle(dotsEl, 'color', '#757575');

    this.ren.appendChild(dotsEl, dotsText);

    this.ren.appendChild(this.customContainerRef, dotsEl);

    this.ren.setStyle(dotsEl, 'display', 'none');

    return dotsEl;
  }

  private switchPage(i: number): void {
    const previousPageIndex = this.matPag.pageIndex;
    this.matPag.pageIndex = i;
    this.matPag['_emitPageEvent'](previousPageIndex);
  }
}
