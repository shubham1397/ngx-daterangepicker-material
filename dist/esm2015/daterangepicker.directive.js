var DaterangepickerDirective_1;
import { __decorate } from "tslib";
import { Directive, HostListener, forwardRef, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
const moment = _moment;
let DaterangepickerDirective = DaterangepickerDirective_1 = class DaterangepickerDirective {
    constructor(viewContainerRef, _changeDetectorRef, _componentFactoryResolver, _el, _renderer, differs, _localeService, elementRef) {
        this.viewContainerRef = viewContainerRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._el = _el;
        this._renderer = _renderer;
        this.differs = differs;
        this._localeService = _localeService;
        this.elementRef = elementRef;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._validatorChange = Function.prototype;
        this.dateLimit = null;
        this.showCancel = false;
        this.lockStartDate = false;
        // timepicker variables
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.closeOnAutoApply = true;
        this._locale = {};
        this._endKey = 'endDate';
        this._startKey = 'startDate';
        this.notForChangesProperty = [
            'locale',
            'endKey',
            'startKey'
        ];
        this.onChange = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
        this.drops = 'down';
        this.opens = 'auto';
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(DaterangepickerComponent);
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        this.picker = componentRef.instance;
        this.picker.inline = false; // set inline to false for all directive usage
    }
    set locale(value) {
        this._locale = Object.assign(Object.assign({}, this._localeService.config), value);
    }
    get locale() {
        return this._locale;
    }
    set startKey(value) {
        if (value !== null) {
            this._startKey = value;
        }
        else {
            this._startKey = 'startDate';
        }
    }
    set endKey(value) {
        if (value !== null) {
            this._endKey = value;
        }
        else {
            this._endKey = 'endDate';
        }
    }
    get value() {
        return this._value || null;
    }
    set value(val) {
        this._value = val;
        this._onChange(val);
        this._changeDetectorRef.markForCheck();
    }
    get disabled() { return this._disabled; }
    ngOnInit() {
        this.picker.startDateChanged.asObservable().subscribe((itemChanged) => {
            this.startDateChanged.emit(itemChanged);
        });
        this.picker.endDateChanged.asObservable().subscribe((itemChanged) => {
            this.endDateChanged.emit(itemChanged);
        });
        this.picker.rangeClicked.asObservable().subscribe((range) => {
            this.rangeClicked.emit(range);
        });
        this.picker.datesUpdated.asObservable().subscribe((range) => {
            this.datesUpdated.emit(range);
        });
        this.picker.choosedDate.asObservable().subscribe((change) => {
            if (change) {
                const value = {};
                value[this._startKey] = change.startDate;
                value[this._endKey] = change.endDate;
                this.value = value;
                this.onChange.emit(value);
                if (typeof change.chosenLabel === 'string') {
                    this._el.nativeElement.value = change.chosenLabel;
                }
            }
        });
        this.picker.firstMonthDayClass = this.firstMonthDayClass;
        this.picker.lastMonthDayClass = this.lastMonthDayClass;
        this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
        this.picker.emptyWeekColumnClass = this.emptyWeekColumnClass;
        this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.picker.drops = this.drops;
        this.picker.opens = this.opens;
        this.localeDiffer = this.differs.find(this.locale).create();
        this.picker.closeOnAutoApply = this.closeOnAutoApply;
    }
    ngOnChanges(changes) {
        for (const change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.notForChangesProperty.indexOf(change) === -1) {
                    this.picker[change] = changes[change].currentValue;
                }
            }
        }
    }
    ngDoCheck() {
        if (this.localeDiffer) {
            const changes = this.localeDiffer.diff(this.locale);
            if (changes) {
                this.picker.updateLocale(this.locale);
            }
        }
    }
    onBlur() {
        this._onTouched();
    }
    open(event) {
        if (this.disabled) {
            return;
        }
        this.picker.show(event);
        setTimeout(() => {
            this.setPosition();
        });
    }
    hide(e) {
        this.picker.hide(e);
    }
    toggle(e) {
        if (this.picker.isShown) {
            this.hide(e);
        }
        else {
            this.open(e);
        }
    }
    clear() {
        this.picker.clear();
    }
    writeValue(value) {
        this.setValue(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(state) {
        this._disabled = state;
    }
    setValue(val) {
        if (val) {
            this.value = val;
            if (val[this._startKey]) {
                this.picker.setStartDate(val[this._startKey]);
            }
            if (val[this._endKey]) {
                this.picker.setEndDate(val[this._endKey]);
            }
            this.picker.calculateChosenLabel();
            if (this.picker.chosenLabel) {
                this._el.nativeElement.value = this.picker.chosenLabel;
            }
        }
        else {
            this.picker.clear();
        }
    }
    /**
     * Set position of the calendar
     */
    setPosition() {
        let style;
        let containerTop;
        const container = this.picker.pickerContainer.nativeElement;
        const element = this._el.nativeElement;
        if (this.drops && this.drops === 'up') {
            containerTop = (element.offsetTop - container.clientHeight) + 'px';
        }
        else {
            containerTop = 'auto';
        }
        if (this.opens === 'left') {
            style = {
                top: containerTop,
                left: (element.offsetLeft - container.clientWidth + element.clientWidth) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens === 'center') {
            style = {
                top: containerTop,
                left: (element.offsetLeft + element.clientWidth / 2
                    - container.clientWidth / 2) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens === 'right') {
            style = {
                top: containerTop,
                left: element.offsetLeft + 'px',
                right: 'auto'
            };
        }
        else {
            const position = element.offsetLeft + element.clientWidth / 2 - container.clientWidth / 2;
            if (position < 0) {
                style = {
                    top: containerTop,
                    left: element.offsetLeft + 'px',
                    right: 'auto'
                };
            }
            else {
                style = {
                    top: containerTop,
                    left: position + 'px',
                    right: 'auto'
                };
            }
        }
        if (style) {
            this._renderer.setStyle(container, 'top', style.top);
            this._renderer.setStyle(container, 'left', style.left);
            this._renderer.setStyle(container, 'right', style.right);
        }
    }
    inputChanged(e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }
        if (!e.target.value.length) {
            return;
        }
        const dateString = e.target.value.split(this.picker.locale.separator);
        let start = null, end = null;
        if (dateString.length === 2) {
            start = moment(dateString[0], this.picker.locale.format);
            end = moment(dateString[1], this.picker.locale.format);
        }
        if (this.singleDatePicker || start === null || end === null) {
            start = moment(e.target.value, this.picker.locale.format);
            end = start;
        }
        if (!start.isValid() || !end.isValid()) {
            return;
        }
        this.picker.setStartDate(start);
        this.picker.setEndDate(end);
        this.picker.updateView();
    }
    /**
     * For click outside of the calendar's container
     * @param event event object
     */
    outsideClick(event) {
        if (!event.target) {
            return;
        }
        if (event.target.classList.contains('ngx-daterangepicker-action')) {
            return;
        }
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hide();
        }
    }
};
__decorate([
    Input()
], DaterangepickerDirective.prototype, "minDate", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "maxDate", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "autoApply", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "alwaysShowCalendars", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "showCustomRangeLabel", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "linkedCalendars", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "dateLimit", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "singleDatePicker", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "showWeekNumbers", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "showISOWeekNumbers", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "showDropdowns", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "isInvalidDate", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "isCustomDate", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "isTooltipDate", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "showClearButton", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "customRangeDirection", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "ranges", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "opens", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "drops", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "lastMonthDayClass", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "emptyWeekRowClass", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "emptyWeekColumnClass", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "firstDayOfNextMonthClass", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "lastDayOfPreviousMonthClass", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "keepCalendarOpeningWithRange", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "showRangeLabelOnInput", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "showCancel", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "lockStartDate", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "timePicker", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "timePicker24Hour", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "timePickerIncrement", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "timePickerSeconds", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "closeOnAutoApply", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "locale", null);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "_endKey", void 0);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "startKey", null);
__decorate([
    Input()
], DaterangepickerDirective.prototype, "endKey", null);
__decorate([
    Output('change')
], DaterangepickerDirective.prototype, "onChange", void 0);
__decorate([
    Output('rangeClicked')
], DaterangepickerDirective.prototype, "rangeClicked", void 0);
__decorate([
    Output('datesUpdated')
], DaterangepickerDirective.prototype, "datesUpdated", void 0);
__decorate([
    Output()
], DaterangepickerDirective.prototype, "startDateChanged", void 0);
__decorate([
    Output()
], DaterangepickerDirective.prototype, "endDateChanged", void 0);
__decorate([
    HostBinding('disabled')
], DaterangepickerDirective.prototype, "disabled", null);
__decorate([
    HostListener('document:click', ['$event'])
], DaterangepickerDirective.prototype, "outsideClick", null);
DaterangepickerDirective = DaterangepickerDirective_1 = __decorate([
    Directive({
        selector: 'input[ngxDaterangepickerMd]',
        host: {
            '(keyup.esc)': 'hide()',
            '(blur)': 'onBlur()',
            '(click)': 'open()',
            '(keyup)': 'inputChanged($event)'
        },
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DaterangepickerDirective_1), multi: true
            }
        ]
    })
], DaterangepickerDirective);
export { DaterangepickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJGOi9QUk9KRUNUL1RFTVAvbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC9zcmMvZGF0ZXJhbmdlcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBSVQsWUFBWSxFQUNaLFVBQVUsRUFLVixLQUFLLEVBSUwsTUFBTSxFQUNOLFlBQVksRUFFWixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFHbEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBaUJ2QixJQUFhLHdCQUF3QixnQ0FBckMsTUFBYSx3QkFBd0I7SUF1SG5DLFlBQ1MsZ0JBQWtDLEVBQ2xDLGtCQUFxQyxFQUNwQyx5QkFBbUQsRUFDbkQsR0FBZSxFQUNmLFNBQW9CLEVBQ3BCLE9BQXdCLEVBQ3hCLGNBQTZCLEVBQzdCLFVBQXNCO1FBUHZCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUNwQyw4QkFBeUIsR0FBekIseUJBQXlCLENBQTBCO1FBQ25ELFFBQUcsR0FBSCxHQUFHLENBQVk7UUFDZixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQzdCLGVBQVUsR0FBVixVQUFVLENBQVk7UUE3SHhCLGNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQy9CLGVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1FB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b250ZW50IjpbImltcG9ydCB7XHJcbiAgRGlyZWN0aXZlLFxyXG4gIFZpZXdDb250YWluZXJSZWYsXHJcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIGZvcndhcmRSZWYsXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIERvQ2hlY2ssXHJcbiAgS2V5VmFsdWVEaWZmZXIsXHJcbiAgS2V5VmFsdWVEaWZmZXJzLFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgUmVuZGVyZXIyLFxyXG4gIEhvc3RCaW5kaW5nXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCB7IExvY2FsZUNvbmZpZyB9IGZyb20gJy4vZGF0ZXJhbmdlcGlja2VyLmNvbmZpZyc7XHJcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuL2xvY2FsZS5zZXJ2aWNlJztcclxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnaW5wdXRbbmd4RGF0ZXJhbmdlcGlja2VyTWRdJyxcclxuICBob3N0OiB7XHJcbiAgICAnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcclxuICAgICcoYmx1ciknOiAnb25CbHVyKCknLFxyXG4gICAgJyhjbGljayknOiAnb3BlbigpJyxcclxuICAgICcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xyXG4gIH0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUpLCBtdWx0aTogdHJ1ZVxyXG4gICAgfVxyXG5dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XHJcbiAgcHVibGljIHBpY2tlcjogRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50O1xyXG4gIHByaXZhdGUgX29uQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG4gIHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcclxuICBwcml2YXRlIF92YWxpZGF0b3JDaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XHJcbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBfdmFsdWU6IGFueTtcclxuICBwcml2YXRlIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xyXG4gIEBJbnB1dCgpXHJcbiAgbWluRGF0ZTogX21vbWVudC5Nb21lbnRcclxuICBASW5wdXQoKVxyXG4gIG1heERhdGU6IF9tb21lbnQuTW9tZW50XHJcbiAgQElucHV0KClcclxuICBhdXRvQXBwbHk6IGJvb2xlYW47XHJcbiAgQElucHV0KClcclxuICBhbHdheXNTaG93Q2FsZW5kYXJzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpXHJcbiAgc2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XHJcbiAgQElucHV0KClcclxuICBsaW5rZWRDYWxlbmRhcnM6IGJvb2xlYW47XHJcbiAgQElucHV0KClcclxuICBkYXRlTGltaXQ6IG51bWJlciA9IG51bGw7XHJcbiAgQElucHV0KClcclxuICBzaW5nbGVEYXRlUGlja2VyOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpXHJcbiAgc2hvd1dlZWtOdW1iZXJzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpXHJcbiAgc2hvd0lTT1dlZWtOdW1iZXJzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpXHJcbiAgc2hvd0Ryb3Bkb3duczogYm9vbGVhbjtcclxuICBASW5wdXQoKVxyXG4gIGlzSW52YWxpZERhdGU6IEZ1bmN0aW9uO1xyXG4gIEBJbnB1dCgpXHJcbiAgaXNDdXN0b21EYXRlOiBGdW5jdGlvbjtcclxuICBASW5wdXQoKVxyXG4gIGlzVG9vbHRpcERhdGU6IEZ1bmN0aW9uO1xyXG4gIEBJbnB1dCgpXHJcbiAgc2hvd0NsZWFyQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpXHJcbiAgY3VzdG9tUmFuZ2VEaXJlY3Rpb246IGJvb2xlYW47XHJcbiAgQElucHV0KClcclxuICByYW5nZXM6IGFueTtcclxuICBASW5wdXQoKVxyXG4gIG9wZW5zOiBzdHJpbmc7XHJcbiAgQElucHV0KClcclxuICBkcm9wczogc3RyaW5nO1xyXG4gIGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xyXG4gIEBJbnB1dCgpXHJcbiAgbGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcclxuICBASW5wdXQoKVxyXG4gIGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmc7XHJcbiAgQElucHV0KClcclxuICBlbXB0eVdlZWtDb2x1bW5DbGFzczogc3RyaW5nO1xyXG4gIEBJbnB1dCgpXHJcbiAgZmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmc7XHJcbiAgQElucHV0KClcclxuICBsYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M6IHN0cmluZztcclxuICBASW5wdXQoKVxyXG4gIGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW47XHJcbiAgQElucHV0KClcclxuICBzaG93UmFuZ2VMYWJlbE9uSW5wdXQ6IGJvb2xlYW47XHJcbiAgQElucHV0KClcclxuICBzaG93Q2FuY2VsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KClcclxuICBsb2NrU3RhcnREYXRlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgLy8gdGltZXBpY2tlciB2YXJpYWJsZXNcclxuICBASW5wdXQoKVxyXG4gIHRpbWVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKVxyXG4gIHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKVxyXG4gIHRpbWVQaWNrZXJJbmNyZW1lbnQ6IG51bWJlciA9IDE7XHJcbiAgQElucHV0KClcclxuICB0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGNsb3NlT25BdXRvQXBwbHkgPSB0cnVlO1xyXG4gIF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xyXG4gIEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcclxuICAgIHRoaXMuX2xvY2FsZSA9IHsuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWV9O1xyXG4gIH1cclxuICBnZXQgbG9jYWxlKCk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gIH1cclxuICBASW5wdXQoKVxyXG4gIHByaXZhdGUgX2VuZEtleTogc3RyaW5nID0gJ2VuZERhdGUnO1xyXG4gIHByaXZhdGUgX3N0YXJ0S2V5OiBzdHJpbmcgPSAnc3RhcnREYXRlJztcclxuICBASW5wdXQoKSBzZXQgc3RhcnRLZXkodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fc3RhcnRLZXkgPSAnc3RhcnREYXRlJztcclxuICAgIH1cclxuICB9XHJcbiAgQElucHV0KCkgc2V0IGVuZEtleSh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuX2VuZEtleSA9IHZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fZW5kS2V5ID0gJ2VuZERhdGUnO1xyXG4gICAgfVxyXG4gIH1cclxuICBub3RGb3JDaGFuZ2VzUHJvcGVydHk6IEFycmF5PHN0cmluZz4gPSBbXHJcbiAgICAnbG9jYWxlJyxcclxuICAgICdlbmRLZXknLFxyXG4gICAgJ3N0YXJ0S2V5J1xyXG4gIF07XHJcblxyXG4gIGdldCB2YWx1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl92YWx1ZSB8fCBudWxsO1xyXG4gIH1cclxuICBzZXQgdmFsdWUodmFsKSB7XHJcbiAgICB0aGlzLl92YWx1ZSA9IHZhbDtcclxuICAgIHRoaXMuX29uQ2hhbmdlKHZhbCk7XHJcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcclxuICB9XHJcbiAgQE91dHB1dCgnY2hhbmdlJykgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoJ3JhbmdlQ2xpY2tlZCcpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgnZGF0ZXNVcGRhdGVkJykgZGF0ZXNVcGRhdGVkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGVuZERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBASG9zdEJpbmRpbmcoJ2Rpc2FibGVkJykgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxyXG4gICAgcHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcclxuICAgIHByaXZhdGUgX2VsOiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcclxuICAgIHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxyXG4gICAgcHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSxcclxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZlxyXG4gICkge1xyXG4gICAgdGhpcy5kcm9wcyA9ICdkb3duJztcclxuICAgIHRoaXMub3BlbnMgPSAnYXV0byc7XHJcbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCk7XHJcbiAgICB2aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcclxuICAgIHRoaXMucGlja2VyID0gKDxEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQ+Y29tcG9uZW50UmVmLmluc3RhbmNlKTtcclxuICAgIHRoaXMucGlja2VyLmlubGluZSA9IGZhbHNlOyAvLyBzZXQgaW5saW5lIHRvIGZhbHNlIGZvciBhbGwgZGlyZWN0aXZlIHVzYWdlXHJcbiAgfVxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5waWNrZXIuc3RhcnREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcclxuICAgICAgdGhpcy5zdGFydERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBpY2tlci5lbmREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcclxuICAgICAgdGhpcy5lbmREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5waWNrZXIucmFuZ2VDbGlja2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xyXG4gICAgICB0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHJhbmdlKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5waWNrZXIuZGF0ZXNVcGRhdGVkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xyXG4gICAgICB0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHJhbmdlKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5waWNrZXIuY2hvb3NlZERhdGUuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoY2hhbmdlKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB7fTtcclxuICAgICAgICB2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBjaGFuZ2Uuc3RhcnREYXRlO1xyXG4gICAgICAgIHZhbHVlW3RoaXMuX2VuZEtleV0gPSBjaGFuZ2UuZW5kRGF0ZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHZhbHVlKTtcclxuICAgICAgICBpZiAodHlwZW9mIGNoYW5nZS5jaG9zZW5MYWJlbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBjaGFuZ2UuY2hvc2VuTGFiZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMucGlja2VyLmZpcnN0TW9udGhEYXlDbGFzcyA9IHRoaXMuZmlyc3RNb250aERheUNsYXNzO1xyXG4gICAgdGhpcy5waWNrZXIubGFzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmxhc3RNb250aERheUNsYXNzO1xyXG4gICAgdGhpcy5waWNrZXIuZW1wdHlXZWVrUm93Q2xhc3MgPSB0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzO1xyXG4gICAgdGhpcy5waWNrZXIuZW1wdHlXZWVrQ29sdW1uQ2xhc3MgPSB0aGlzLmVtcHR5V2Vla0NvbHVtbkNsYXNzO1xyXG4gICAgdGhpcy5waWNrZXIuZmlyc3REYXlPZk5leHRNb250aENsYXNzID0gdGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3M7XHJcbiAgICB0aGlzLnBpY2tlci5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgPSB0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcztcclxuICAgIHRoaXMucGlja2VyLmRyb3BzID0gdGhpcy5kcm9wcztcclxuICAgIHRoaXMucGlja2VyLm9wZW5zID0gdGhpcy5vcGVucztcclxuICAgIHRoaXMubG9jYWxlRGlmZmVyID0gdGhpcy5kaWZmZXJzLmZpbmQodGhpcy5sb2NhbGUpLmNyZWF0ZSgpO1xyXG4gICAgdGhpcy5waWNrZXIuY2xvc2VPbkF1dG9BcHBseSA9IHRoaXMuY2xvc2VPbkF1dG9BcHBseTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkICB7XHJcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcclxuICAgICAgICBpZiAodGhpcy5ub3RGb3JDaGFuZ2VzUHJvcGVydHkuaW5kZXhPZihjaGFuZ2UpID09PSAtMSkge1xyXG4gICAgICAgICAgdGhpcy5waWNrZXJbY2hhbmdlXSA9IGNoYW5nZXNbY2hhbmdlXS5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ0RvQ2hlY2soKSB7XHJcbiAgICBpZiAodGhpcy5sb2NhbGVEaWZmZXIpIHtcclxuICAgICAgY29uc3QgY2hhbmdlcyA9IHRoaXMubG9jYWxlRGlmZmVyLmRpZmYodGhpcy5sb2NhbGUpO1xyXG4gICAgICBpZiAoY2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMucGlja2VyLnVwZGF0ZUxvY2FsZSh0aGlzLmxvY2FsZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQmx1cigpIHtcclxuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xyXG4gIH1cclxuXHJcbiAgb3BlbihldmVudD86IGFueSkge1xyXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5waWNrZXIuc2hvdyhldmVudCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBoaWRlKGU/KSB7XHJcbiAgICB0aGlzLnBpY2tlci5oaWRlKGUpO1xyXG4gIH1cclxuICB0b2dnbGUoZT8pIHtcclxuICAgIGlmICh0aGlzLnBpY2tlci5pc1Nob3duKSB7XHJcbiAgICAgIHRoaXMuaGlkZShlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMub3BlbihlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsZWFyKCkge1xyXG4gICAgdGhpcy5waWNrZXIuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIHdyaXRlVmFsdWUodmFsdWUpIHtcclxuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xyXG4gIH1cclxuICByZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XHJcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xyXG4gIH1cclxuICByZWdpc3Rlck9uVG91Y2hlZChmbikge1xyXG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XHJcbiAgfVxyXG4gIHNldERpc2FibGVkU3RhdGUoc3RhdGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuX2Rpc2FibGVkID0gc3RhdGU7XHJcbn1cclxuICBwcml2YXRlIHNldFZhbHVlKHZhbDogYW55KSB7XHJcbiAgICBpZiAodmFsKSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XHJcbiAgICAgIGlmICh2YWxbdGhpcy5fc3RhcnRLZXldKSB7XHJcbiAgICAgICAgdGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHZhbFt0aGlzLl9zdGFydEtleV0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWxbdGhpcy5fZW5kS2V5XSkge1xyXG4gICAgICAgIHRoaXMucGlja2VyLnNldEVuZERhdGUodmFsW3RoaXMuX2VuZEtleV0pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucGlja2VyLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XHJcbiAgICAgIGlmICh0aGlzLnBpY2tlci5jaG9zZW5MYWJlbCkge1xyXG4gICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLnBpY2tlci5jaG9zZW5MYWJlbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5waWNrZXIuY2xlYXIoKTtcclxuICAgIH1cclxuICB9XHJcbiAgLyoqXHJcbiAgICogU2V0IHBvc2l0aW9uIG9mIHRoZSBjYWxlbmRhclxyXG4gICAqL1xyXG4gIHNldFBvc2l0aW9uKCkge1xyXG4gICAgbGV0IHN0eWxlO1xyXG4gICAgbGV0IGNvbnRhaW5lclRvcDtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMucGlja2VyLnBpY2tlckNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBpZiAodGhpcy5kcm9wcyAmJiB0aGlzLmRyb3BzID09PSAndXAnKSB7XHJcbiAgICAgIGNvbnRhaW5lclRvcCA9IChlbGVtZW50Lm9mZnNldFRvcCAtIGNvbnRhaW5lci5jbGllbnRIZWlnaHQpICsgJ3B4JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnRhaW5lclRvcCA9ICdhdXRvJztcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm9wZW5zID09PSAnbGVmdCcpIHtcclxuICAgICAgc3R5bGUgPSB7XHJcbiAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcclxuICAgICAgICAgIGxlZnQ6IChlbGVtZW50Lm9mZnNldExlZnQgLSBjb250YWluZXIuY2xpZW50V2lkdGggKyBlbGVtZW50LmNsaWVudFdpZHRoKSArICdweCcsXHJcbiAgICAgICAgICByaWdodDogJ2F1dG8nXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdjZW50ZXInKSB7XHJcbiAgICAgICAgc3R5bGUgPSB7XHJcbiAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcclxuICAgICAgICAgIGxlZnQ6IChlbGVtZW50Lm9mZnNldExlZnQgICsgIGVsZW1lbnQuY2xpZW50V2lkdGggLyAyXHJcbiAgICAgICAgICAgICAgICAgIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMikgKyAncHgnLFxyXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJ1xyXG4gICAgICAgIH07XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdyaWdodCcpIHtcclxuICAgICAgICBzdHlsZSA9IHtcclxuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxyXG4gICAgICAgICAgbGVmdDogZWxlbWVudC5vZmZzZXRMZWZ0ICArICdweCcsXHJcbiAgICAgICAgICByaWdodDogJ2F1dG8nXHJcbiAgICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZWxlbWVudC5vZmZzZXRMZWZ0ICArICBlbGVtZW50LmNsaWVudFdpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDI7XHJcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHtcclxuICAgICAgICBzdHlsZSA9IHtcclxuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxyXG4gICAgICAgICAgbGVmdDogZWxlbWVudC5vZmZzZXRMZWZ0ICsgJ3B4JyxcclxuICAgICAgICAgIHJpZ2h0OiAnYXV0bydcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHN0eWxlID0ge1xyXG4gICAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcclxuICAgICAgICAgICAgbGVmdDogcG9zaXRpb24gKyAncHgnLFxyXG4gICAgICAgICAgICByaWdodDogJ2F1dG8nXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHN0eWxlKSB7XHJcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3RvcCcsIHN0eWxlLnRvcCk7XHJcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCBzdHlsZS5sZWZ0KTtcclxuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAncmlnaHQnLCBzdHlsZS5yaWdodCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlucHV0Q2hhbmdlZChlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnaW5wdXQnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICghZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCh0aGlzLnBpY2tlci5sb2NhbGUuc2VwYXJhdG9yKTtcclxuICAgIGxldCBzdGFydCA9IG51bGwsIGVuZCA9IG51bGw7XHJcbiAgICBpZiAoZGF0ZVN0cmluZy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgc3RhcnQgPSBtb21lbnQoZGF0ZVN0cmluZ1swXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XHJcbiAgICAgIGVuZCA9IG1vbWVudChkYXRlU3RyaW5nWzFdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIgfHwgc3RhcnQgPT09IG51bGwgfHwgZW5kID09PSBudWxsKSB7XHJcbiAgICAgIHN0YXJ0ID0gbW9tZW50KGUudGFyZ2V0LnZhbHVlLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcclxuICAgICAgZW5kID0gc3RhcnQ7XHJcbiAgICB9XHJcbiAgICBpZiAoIXN0YXJ0LmlzVmFsaWQoKSB8fCAhZW5kLmlzVmFsaWQoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnBpY2tlci5zZXRTdGFydERhdGUoc3RhcnQpO1xyXG4gICAgdGhpcy5waWNrZXIuc2V0RW5kRGF0ZShlbmQpO1xyXG4gICAgdGhpcy5waWNrZXIudXBkYXRlVmlldygpO1xyXG5cclxuICB9XHJcbiAgLyoqXHJcbiAgICogRm9yIGNsaWNrIG91dHNpZGUgb2YgdGhlIGNhbGVuZGFyJ3MgY29udGFpbmVyXHJcbiAgICogQHBhcmFtIGV2ZW50IGV2ZW50IG9iamVjdFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJywgWyckZXZlbnQnXSlcclxuICBvdXRzaWRlQ2xpY2soZXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICghZXZlbnQudGFyZ2V0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbmd4LWRhdGVyYW5nZXBpY2tlci1hY3Rpb24nKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XHJcbiAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=