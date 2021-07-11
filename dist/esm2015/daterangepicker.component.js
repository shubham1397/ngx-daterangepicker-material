var DaterangepickerComponent_1;
import { __decorate } from "tslib";
import { Component, EventEmitter, forwardRef, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
const moment = _moment;
export var SideEnum;
(function (SideEnum) {
    SideEnum["left"] = "left";
    SideEnum["right"] = "right";
})(SideEnum || (SideEnum = {}));
let DaterangepickerComponent = DaterangepickerComponent_1 = class DaterangepickerComponent {
    constructor(el, _ref, _localeService) {
        this.el = el;
        this._ref = _ref;
        this._localeService = _localeService;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.tooltiptext = []; // for storing tooltiptext
        this.timepickerVariables = { left: {}, right: {} };
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.applyBtn = { disabled: false };
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.dateLimit = null;
        // used in template for compile time support of enum values.
        this.sideEnum = SideEnum;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.linkedCalendars = false;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.maxSpan = false;
        this.lockStartDate = false;
        // timepicker variables
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        // end of timepicker variables
        this.showClearButton = false;
        this.firstMonthDayClass = null;
        this.lastMonthDayClass = null;
        this.emptyWeekRowClass = null;
        this.emptyWeekColumnClass = null;
        this.firstDayOfNextMonthClass = null;
        this.lastDayOfPreviousMonthClass = null;
        this._locale = {};
        // custom ranges
        this._ranges = {};
        this.showCancel = false;
        this.keepCalendarOpeningWithRange = false;
        this.showRangeLabelOnInput = false;
        this.customRangeDirection = false;
        this.rangesArray = [];
        // some state information
        this.isShown = false;
        this.inline = true;
        this.leftCalendar = {};
        this.rightCalendar = {};
        this.showCalInRanges = false;
        this.nowHoveredDate = null;
        this.pickingDate = false;
        this.options = {}; // should get some opt from user
        this.closeOnAutoApply = true;
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
        this.cancelClicked = new EventEmitter();
    }
    set minDate(value) {
        if (_moment.isMoment(value)) {
            this._minDate = value;
        }
        else if (typeof value === 'string') {
            this._minDate = moment(value);
        }
        else {
            this._minDate = null;
        }
    }
    ;
    getMinDate() {
        return this._minDate;
    }
    set maxDate(value) {
        if (_moment.isMoment(value)) {
            this._maxDate = value;
        }
        else if (typeof value === 'string') {
            this._maxDate = moment(value);
        }
        else {
            this._maxDate = null;
        }
    }
    getMaxDate() {
        return this._maxDate;
    }
    set locale(value) {
        this._locale = Object.assign(Object.assign({}, this._localeService.config), value);
    }
    get locale() {
        return this._locale;
    }
    set ranges(value) {
        this._ranges = value;
        this.renderRanges();
    }
    get ranges() {
        return this._ranges;
    }
    ngOnInit() {
        this._buildLocale();
        const daysOfWeek = [...this.locale.daysOfWeek];
        this.locale.firstDay = this.locale.firstDay % 7;
        if (this.locale.firstDay !== 0) {
            let iterator = this.locale.firstDay;
            while (iterator > 0) {
                daysOfWeek.push(daysOfWeek.shift());
                iterator--;
            }
        }
        this.locale.daysOfWeek = daysOfWeek;
        if (this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        if (this.startDate && this.timePicker) {
            this.setStartDate(this.startDate);
            this.renderTimePicker(SideEnum.left);
        }
        if (this.endDate && this.timePicker) {
            this.setEndDate(this.endDate);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();
    }
    renderRanges() {
        this.rangesArray = [];
        let start, end;
        if (typeof this.ranges === 'object') {
            for (const range in this.ranges) {
                if (this.ranges[range]) {
                    if (typeof this.ranges[range][0] === 'string') {
                        start = moment(this.ranges[range][0], this.locale.format);
                    }
                    else {
                        start = moment(this.ranges[range][0]);
                    }
                    if (typeof this.ranges[range][1] === 'string') {
                        end = moment(this.ranges[range][1], this.locale.format);
                    }
                    else {
                        end = moment(this.ranges[range][1]);
                    }
                    // If the start or end date exceed those allowed by the minDate or maxSpan
                    // options, shorten the range to the allowable period.
                    if (this.getMinDate() && start.isBefore(this.getMinDate())) {
                        start = this.getMinDate().clone();
                    }
                    let maxDate = this.getMaxDate();
                    if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
                        maxDate = start.clone().add(this.maxSpan);
                    }
                    if (maxDate && end.isAfter(maxDate)) {
                        end = maxDate.clone();
                    }
                    // If the end of the range is before the minimum or the start of the range is
                    // after the maximum, don't display this range option at all.
                    if ((this.getMinDate() && end.isBefore(this.getMinDate(), this.timePicker ? 'minute' : 'day'))
                        || (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                        continue;
                    }
                    // Support unicode chars in the range names.
                    const elem = document.createElement('textarea');
                    elem.innerHTML = range;
                    const rangeHtml = elem.value;
                    this.ranges[rangeHtml] = [start, end];
                }
            }
            for (const range in this.ranges) {
                if (this.ranges[range]) {
                    this.rangesArray.push(range);
                }
            }
            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }
        }
    }
    renderTimePicker(side) {
        let selected, minDate;
        const maxDate = this.getMaxDate();
        if (side === SideEnum.left) {
            selected = this.startDate.clone(),
                minDate = this.getMinDate();
        }
        else if (side === SideEnum.right && this.endDate) {
            selected = this.endDate.clone(),
                minDate = this.startDate;
        }
        else if (side === SideEnum.right && !this.endDate) {
            // don't have an end date, use the start date then put the selected time for the right side as the time
            selected = this._getDateWithTime(this.startDate, SideEnum.right);
            if (selected.isBefore(this.startDate)) {
                selected = this.startDate.clone(); //set it back to the start date the time was backwards
            }
            minDate = this.startDate;
        }
        const start = this.timePicker24Hour ? 0 : 1;
        const end = this.timePicker24Hour ? 23 : 12;
        this.timepickerVariables[side] = {
            hours: [],
            minutes: [],
            minutesLabel: [],
            seconds: [],
            secondsLabel: [],
            disabledHours: [],
            disabledMinutes: [],
            disabledSeconds: [],
            selectedHour: 0,
            selectedMinute: 0,
            selectedSecond: 0,
        };
        // generate hours
        for (let i = start; i <= end; i++) {
            let i_in_24 = i;
            if (!this.timePicker24Hour) {
                i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : (i === 12 ? 0 : i);
            }
            const time = selected.clone().hour(i_in_24);
            let disabled = false;
            if (minDate && time.minute(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.minute(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].hours.push(i);
            if (i_in_24 === selected.hour() && !disabled) {
                this.timepickerVariables[side].selectedHour = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledHours.push(i);
            }
        }
        // generate minutes
        for (let i = 0; i < 60; i += this.timePickerIncrement) {
            const padded = i < 10 ? '0' + i : i;
            const time = selected.clone().minute(i);
            let disabled = false;
            if (minDate && time.second(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.second(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].minutes.push(i);
            this.timepickerVariables[side].minutesLabel.push(padded);
            if (selected.minute() === i && !disabled) {
                this.timepickerVariables[side].selectedMinute = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledMinutes.push(i);
            }
        }
        // generate seconds
        if (this.timePickerSeconds) {
            for (let i = 0; i < 60; i++) {
                const padded = i < 10 ? '0' + i : i;
                const time = selected.clone().second(i);
                let disabled = false;
                if (minDate && time.isBefore(minDate)) {
                    disabled = true;
                }
                if (maxDate && time.isAfter(maxDate)) {
                    disabled = true;
                }
                this.timepickerVariables[side].seconds.push(i);
                this.timepickerVariables[side].secondsLabel.push(padded);
                if (selected.second() === i && !disabled) {
                    this.timepickerVariables[side].selectedSecond = i;
                }
                else if (disabled) {
                    this.timepickerVariables[side].disabledSeconds.push(i);
                }
            }
        }
        // generate AM/PM
        if (!this.timePicker24Hour) {
            const am_html = '';
            const pm_html = '';
            if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
                this.timepickerVariables[side].amDisabled = true;
            }
            if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
                this.timepickerVariables[side].pmDisabled = true;
            }
            if (selected.hour() >= 12) {
                this.timepickerVariables[side].ampmModel = 'PM';
            }
            else {
                this.timepickerVariables[side].ampmModel = 'AM';
            }
        }
        this.timepickerVariables[side].selected = selected;
    }
    renderCalendar(side) {
        const mainCalendar = (side === SideEnum.left) ? this.leftCalendar : this.rightCalendar;
        const month = mainCalendar.month.month();
        const year = mainCalendar.month.year();
        const hour = mainCalendar.month.hour();
        const minute = mainCalendar.month.minute();
        const second = mainCalendar.month.second();
        const daysInMonth = moment([year, month]).daysInMonth();
        const firstDay = moment([year, month, 1]);
        const lastDay = moment([year, month, daysInMonth]);
        const lastMonth = moment(firstDay).subtract(1, 'month').month();
        const lastYear = moment(firstDay).subtract(1, 'month').year();
        const daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        const dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        const calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (let i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        // populate the calendar with date objects
        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);
            if (this.getMinDate() && calendar[row][col].format('YYYY-MM-DD') === this.getMinDate().format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.getMinDate()) && side === 'left') {
                calendar[row][col] = this.getMinDate().clone();
            }
            if (this.getMaxDate() && calendar[row][col].format('YYYY-MM-DD') === this.getMaxDate().format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.getMaxDate()) && side === 'right') {
                calendar[row][col] = this.getMaxDate().clone();
            }
        }
        // make the calendar object available to hoverDate/clickDate
        if (side === SideEnum.left) {
            this.leftCalendar.calendar = calendar;
        }
        else {
            this.rightCalendar.calendar = calendar;
        }
        //
        // Display the calendar
        //
        const minDate = side === 'left' ? this.getMinDate() : this.startDate;
        let maxDate = this.getMaxDate();
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            const maxLimit = this.startDate.clone().add(this.dateLimit, 'day').endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };
        if (this.showDropdowns) {
            const currentMonth = calendar[1][1].month();
            const currentYear = calendar[1][1].year();
            const realCurrentYear = moment().year();
            const maxYear = (maxDate && maxDate.year()) || (realCurrentYear + 5);
            const minYear = (minDate && minDate.year()) || (realCurrentYear - 50);
            const inMinYear = currentYear === minYear;
            const inMaxYear = currentYear === maxYear;
            const years = [];
            for (let y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }
        this._buildCells(calendar, side);
    }
    setStartDate(startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.pickingDate = true;
            this.startDate = moment(startDate);
        }
        if (!this.timePicker) {
            this.pickingDate = true;
            this.startDate = this.startDate.startOf('day');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.getMinDate() && this.startDate.isBefore(this.getMinDate())) {
            this.startDate = this.getMinDate().clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (this.getMaxDate() && this.startDate.isAfter(this.getMaxDate())) {
            this.startDate = this.getMaxDate().clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (!this.isShown) {
            this.updateElement();
        }
        this.startDateChanged.emit({ startDate: this.startDate });
        this.updateMonthsInView();
    }
    setEndDate(endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.pickingDate = false;
            this.endDate = moment(endDate);
        }
        if (!this.timePicker) {
            this.pickingDate = false;
            this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }
        if (this.getMaxDate() && this.endDate.isAfter(this.getMaxDate())) {
            this.endDate = this.getMaxDate().clone();
        }
        if (this.dateLimit && this.startDate.clone().add(this.dateLimit, 'day').isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit, 'day');
        }
        if (!this.isShown) {
            // this.updateElement();
        }
        this.endDateChanged.emit({ endDate: this.endDate });
        this.updateMonthsInView();
    }
    isInvalidDate(date) {
        return false;
    }
    isCustomDate(date) {
        return false;
    }
    isTooltipDate(date) {
        return null;
    }
    updateView() {
        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    }
    updateMonthsInView() {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                    (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM')))
                &&
                    (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                        this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() ||
                    this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                }
                else {
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }
        }
        else {
            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
            }
        }
        if (this.getMaxDate() && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.getMaxDate()) {
            this.rightCalendar.month = this.getMaxDate().clone().date(2);
            this.leftCalendar.month = this.getMaxDate().clone().date(2).subtract(1, 'month');
        }
    }
    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars() {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    }
    updateElement() {
        const format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on input
                if (this.rangesArray.length && this.showRangeLabelOnInput === true && this.chosenRange &&
                    this.locale.customRangeLabel !== this.chosenRange) {
                    this.chosenLabel = this.chosenRange;
                }
                else {
                    this.chosenLabel = this.startDate.format(format) +
                        this.locale.separator + this.endDate.format(format);
                }
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(format);
        }
    }
    remove() {
        this.isShown = false;
    }
    /**
     * this should calculate the label
     */
    calculateChosenLabel() {
        if (!this.locale || !this.locale.separator) {
            this._buildLocale();
        }
        let customRange = true;
        let i = 0;
        if (this.rangesArray.length > 0) {
            for (const range in this.ranges) {
                if (this.ranges[range]) {
                    if (this.timePicker) {
                        const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                        // ignore times when comparing dates if time picker seconds is not enabled
                        if (this.startDate.format(format) === this.ranges[range][0].format(format)
                            && this.endDate.format(format) === this.ranges[range][1].format(format)) {
                            customRange = false;
                            this.chosenRange = this.rangesArray[i];
                            break;
                        }
                    }
                    else {
                        // ignore times when comparing dates if time picker is not enabled
                        if (this.startDate.format('YYYY-MM-DD') === this.ranges[range][0].format('YYYY-MM-DD')
                            && this.endDate.format('YYYY-MM-DD') === this.ranges[range][1].format('YYYY-MM-DD')) {
                            customRange = false;
                            this.chosenRange = this.rangesArray[i];
                            break;
                        }
                    }
                    i++;
                }
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenRange = this.locale.customRangeLabel;
                }
                else {
                    this.chosenRange = null;
                }
                // if custom label: show calendar
                this.showCalInRanges = true;
            }
        }
        this.updateElement();
    }
    clickApply(e) {
        console.log("xxx");
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this._getDateWithTime(this.startDate, SideEnum.right);
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            const d = this.startDate.clone();
            while (d.isBefore(this.endDate)) {
                if (this.isInvalidDate(d)) {
                    this.endDate = d.subtract(1, 'days');
                    this.calculateChosenLabel();
                    break;
                }
                d.add(1, 'days');
            }
        }
        if (this.chosenLabel) {
            this.choosedDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate });
        }
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
        if (e || (this.closeOnAutoApply && !e)) {
            this.hide();
        }
    }
    clickCancel(e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.cancelClicked.emit();
        this.hide();
    }
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    monthChanged(monthEvent, side) {
        const year = this.calendarVariables[side].dropdowns.currentYear;
        const month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    yearChanged(yearEvent, side) {
        const month = this.calendarVariables[side].dropdowns.currentMonth;
        const year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side left or right
     */
    timeChanged(timeEvent, side) {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        if (side === SideEnum.left) {
            const start = this.startDate.clone();
            start.hour(hour);
            start.minute(minute);
            start.second(second);
            this.setStartDate(start);
            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone();
            }
            else if (this.endDate && this.endDate.format('YYYY-MM-DD') === start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }
            else if (!this.endDate && this.timePicker) {
                const startClone = this._getDateWithTime(start, SideEnum.right);
                if (startClone.isBefore(start)) {
                    this.timepickerVariables[SideEnum.right].selectedHour = hour;
                    this.timepickerVariables[SideEnum.right].selectedMinute = minute;
                    this.timepickerVariables[SideEnum.right].selectedSecond = second;
                }
            }
        }
        else if (this.endDate) {
            const end = this.endDate.clone();
            end.hour(hour);
            end.minute(minute);
            end.second(second);
            this.setEndDate(end);
        }
        // update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();
        // re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker(SideEnum.left);
        this.renderTimePicker(SideEnum.right);
        if (this.autoApply) {
            this.clickApply();
        }
    }
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    monthOrYearChanged(month, year, side) {
        const isLeft = side === SideEnum.left;
        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }
        if (this.getMinDate()) {
            if (year < this.getMinDate().year() || (year === this.getMinDate().year() && month < this.getMinDate().month())) {
                month = this.getMinDate().month();
                year = this.getMinDate().year();
            }
        }
        if (this.getMaxDate()) {
            if (year > this.getMaxDate().year() || (year === this.getMaxDate().year() && month > this.getMaxDate().month())) {
                month = this.getMaxDate().month();
                year = this.getMaxDate().year();
            }
        }
        this.calendarVariables[side].dropdowns.currentYear = year;
        this.calendarVariables[side].dropdowns.currentMonth = month;
        if (isLeft) {
            this.leftCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    clickPrev(side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    }
    /**
     * Click on next month
     * @param side left or right calendar
     */
    clickNext(side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.add(1, 'month');
        }
        else {
            this.rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * When hovering a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    hoverDate(e, side, row, col) {
        const leftCalDate = this.calendarVariables.left.calendar[row][col];
        const rightCalDate = this.calendarVariables.right.calendar[row][col];
        if (this.pickingDate) {
            this.nowHoveredDate = side === SideEnum.left ? leftCalDate : rightCalDate;
            this.renderCalendar(SideEnum.left);
            this.renderCalendar(SideEnum.right);
        }
        const tooltip = side === SideEnum.left ? this.tooltiptext[leftCalDate] : this.tooltiptext[rightCalDate];
        if (tooltip.length > 0) {
            e.target.setAttribute('title', tooltip);
        }
    }
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e, side, row, col) {
        if (e.target.tagName === 'TD') {
            if (!e.target.classList.contains('available')) {
                return;
            }
        }
        else if (e.target.tagName === 'SPAN') {
            if (!e.target.parentElement.classList.contains('available')) {
                return;
            }
        }
        if (this.rangesArray.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }
        let date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
        if ((this.endDate || (date.isBefore(this.startDate, 'day')
            && this.customRangeDirection === false)) && this.lockStartDate === false) { // picking start
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.left);
            }
            this.endDate = null;
            this.setStartDate(date.clone());
        }
        else if (!this.endDate && date.isBefore(this.startDate) && this.customRangeDirection === false) {
            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
            this.setEndDate(this.startDate.clone());
        }
        else { // picking end
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.right);
            }
            if (date.isBefore(this.startDate, 'day') === true && this.customRangeDirection === true) {
                this.setEndDate(this.startDate);
                this.setStartDate(date.clone());
            }
            else {
                this.setEndDate(date.clone());
            }
            if (this.autoApply) {
                this.calculateChosenLabel();
            }
        }
        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }
        this.updateView();
        if (this.autoApply && this.startDate && this.endDate) {
            this.clickApply();
        }
        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();
    }
    /**
     *  Click on the custom range
     * @param e: Event
     * @param label
     */
    clickRange(e, label) {
        this.chosenRange = label;
        if (label === this.locale.customRangeLabel) {
            this.isShown = true; // show calendars
            this.showCalInRanges = true;
        }
        else {
            const dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();
            if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
                this.chosenLabel = label;
            }
            else {
                this.calculateChosenLabel();
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }
            if (!this.alwaysShowCalendars) {
                this.isShown = false; // hide calendars
            }
            this.rangeClicked.emit({ label: label, dates: dates });
            if (!this.keepCalendarOpeningWithRange || this.autoApply) {
                this.clickApply();
            }
            else {
                if (!this.alwaysShowCalendars) {
                    return this.clickApply();
                }
                if (this.getMaxDate() && this.getMaxDate().isSame(dates[0], 'month')) {
                    this.rightCalendar.month.month(dates[0].month());
                    this.rightCalendar.month.year(dates[0].year());
                    this.leftCalendar.month.month(dates[0].month() - 1);
                    this.leftCalendar.month.year(dates[1].year());
                }
                else {
                    this.leftCalendar.month.month(dates[0].month());
                    this.leftCalendar.month.year(dates[0].year());
                    // get the next year
                    const nextMonth = dates[0].clone().add(1, 'month');
                    this.rightCalendar.month.month(nextMonth.month());
                    this.rightCalendar.month.year(nextMonth.year());
                }
                this.updateCalendars();
                if (this.timePicker) {
                    this.renderTimePicker(SideEnum.left);
                    this.renderTimePicker(SideEnum.right);
                }
            }
        }
    }
    show(e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        this.updateView();
    }
    hide(e) {
        if (!this.isShown) {
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }
        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
            // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }
        // if picker is attached to a text input, update it
        this.updateElement();
        this.isShown = false;
        this._ref.detectChanges();
    }
    /**
     * handle click on all element in the component, useful for outside of click
     * @param e event
     */
    handleInternalClick(e) {
        e.stopPropagation();
    }
    /**
     * update the locale options
     * @param locale
     */
    updateLocale(locale) {
        for (const key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
                if (key === 'customRangeLabel') {
                    this.renderRanges();
                }
            }
        }
    }
    /**
     *  clear the daterange picker
     */
    clear() {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.choosedDate.emit({ chosenLabel: '', startDate: null, endDate: null });
        this.datesUpdated.emit({ startDate: null, endDate: null });
        this.hide();
    }
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(range) {
        if (range === this.locale.customRangeLabel) {
            return false;
        }
        const rangeMarkers = this.ranges[range];
        const areBothBefore = rangeMarkers.every(date => {
            if (!this.getMinDate()) {
                return false;
            }
            return date.isBefore(this.getMinDate());
        });
        const areBothAfter = rangeMarkers.every(date => {
            if (!this.getMaxDate()) {
                return false;
            }
            return date.isAfter(this.getMaxDate());
        });
        return (areBothBefore || areBothAfter);
    }
    /**
     *
     * @param date the date to add time
     * @param side left or right
     */
    _getDateWithTime(date, side) {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date.clone().hour(hour).minute(minute).second(second);
    }
    /**
     *  build the locale config
     */
    _buildLocale() {
        this.locale = Object.assign(Object.assign({}, this._localeService.config), this.locale);
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
    }
    _buildCells(calendar, side) {
        for (let row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            const rowClasses = [];
            if (this.emptyWeekRowClass &&
                Array.from(Array(7).keys()).some(i => calendar[row][i].month() !== this.calendarVariables[side].month)) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (let col = 0; col < 7; col++) {
                const classes = [];
                // empty week row class
                if (this.emptyWeekColumnClass) {
                    if (calendar[row][col].month() !== this.calendarVariables[side].month) {
                        classes.push(this.emptyWeekColumnClass);
                    }
                }
                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }
                // highlight weekends
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }
                // grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() !== calendar[1][1].month()) {
                    classes.push('off');
                    // mark the last day of the previous month in this calendar
                    if (this.lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() ||
                        calendar[1][1].month() === 0) && calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }
                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() ||
                        calendar[row][col].month() === 0) && calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }
                // don't allow selection of dates before the minimum date
                if (this.getMinDate() && calendar[row][col].isBefore(this.getMinDate(), 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of dates after the maximum date
                if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of date if a custom function decides it's invalid
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled', 'invalid');
                }
                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }
                // highlight the currently selected end date
                if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }
                // highlight dates in-between the selected dates
                if (((this.nowHoveredDate != null && this.pickingDate) || this.endDate != null) &&
                    (calendar[row][col] > this.startDate &&
                        (calendar[row][col] < this.endDate || (calendar[row][col] < this.nowHoveredDate && this.pickingDate))) &&
                    (!classes.find(el => el === 'off'))) {
                    classes.push('in-range');
                }
                // apply custom classes for this date
                const isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // apply custom tooltip for this date
                const isTooltip = this.isTooltipDate(calendar[row][col]);
                if (isTooltip) {
                    if (typeof isTooltip === 'string') {
                        this.tooltiptext[calendar[row][col]] = isTooltip; // setting tooltiptext for custom date
                    }
                    else {
                        this.tooltiptext[calendar[row][col]] = 'Put the tooltip as the returned value of isTooltipDate';
                    }
                }
                else {
                    this.tooltiptext[calendar[row][col]] = '';
                }
                // store classes var
                let cname = '', disabled = false;
                for (let i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    }
};
__decorate([
    Input()
], DaterangepickerComponent.prototype, "startDate", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "endDate", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "dateLimit", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "minDate", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "maxDate", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "autoApply", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "singleDatePicker", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showDropdowns", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showWeekNumbers", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showISOWeekNumbers", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "linkedCalendars", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "autoUpdateInput", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "alwaysShowCalendars", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "maxSpan", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "lockStartDate", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timePicker", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timePicker24Hour", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timePickerIncrement", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timePickerSeconds", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showClearButton", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "firstMonthDayClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "lastMonthDayClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "emptyWeekRowClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "emptyWeekColumnClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "firstDayOfNextMonthClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "lastDayOfPreviousMonthClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "locale", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "ranges", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showCustomRangeLabel", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showCancel", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "keepCalendarOpeningWithRange", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showRangeLabelOnInput", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "customRangeDirection", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "drops", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "opens", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "closeOnAutoApply", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "choosedDate", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "rangeClicked", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "datesUpdated", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "startDateChanged", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "endDateChanged", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "cancelClicked", void 0);
__decorate([
    ViewChild('pickerContainer', { static: true })
], DaterangepickerComponent.prototype, "pickerContainer", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "isInvalidDate", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "isCustomDate", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "isTooltipDate", null);
DaterangepickerComponent = DaterangepickerComponent_1 = __decorate([
    Component({
        selector: 'ngx-daterangepicker-material',
        template: "<div class=\"md-drppicker\" #pickerContainer\r\n[ngClass]=\"{\r\n    ltr: locale.direction === 'ltr',\r\n    rtl: this.locale.direction === 'rtl',\r\n    'shown': isShown || inline,\r\n    'hidden': !isShown && !inline,\r\n    'inline': inline,\r\n    'double': !singleDatePicker && showCalInRanges,\r\n    'show-ranges': rangesArray.length\r\n}\" [class]=\"'drops-' + drops + '-' + opens\">\r\n    <div class=\"ranges\">\r\n        <ul>\r\n          <li *ngFor=\"let range of rangesArray\">\r\n            <button type=\"button\"\r\n                    (click)=\"clickRange($event, range)\"\r\n                    [disabled]=\"disableRange(range)\"\r\n                    [ngClass]=\"{'active': range === chosenRange}\">{{range}}</button>\r\n          </li>\r\n        </ul>\r\n    </div>\r\n    <div class=\"calendar\" [ngClass]=\"{right: singleDatePicker, left: !singleDatePicker}\"\r\n        *ngIf=\"showCalInRanges\">\r\n        <div class=\"calendar-table\">\r\n            <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\r\n                <thead>\r\n                    <tr>\r\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\r\n                        <ng-container *ngIf=\"!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true)\">\r\n                            <th (click)=\"clickPrev(sideEnum.left)\" class=\"prev available\" >\r\n                            </th>\r\n                        </ng-container>\r\n                        <ng-container *ngIf=\"!(!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true))\">\r\n                            <th></th>\r\n                        </ng-container>\r\n                        <th colspan=\"5\" class=\"month drp-animate\">\r\n                            <ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\r\n                                <div class=\"dropdowns\">\r\n                                        {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}\r\n                                        <select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.left)\">\r\n                                                <option\r\n                                                [disabled]=\"(calendarVariables.left.dropdowns.inMinYear && m < calendarVariables.left.minDate.month()) || (calendarVariables.left.dropdowns.inMaxYear && m > calendarVariables.left.maxDate.month())\"\r\n                                                *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [value]=\"m\" [selected]=\"calendarVariables.left.dropdowns.currentMonth == m\">\r\n                                                    {{locale.monthNames[m]}}\r\n                                                </option>\r\n                                        </select>\r\n                                </div>\r\n                                <div class=\"dropdowns\">\r\n                                    {{ calendarVariables?.left?.calendar[1][1].format(\" YYYY\")}}\r\n                                    <select class=\"yearselect\"  (change)=\"yearChanged($event, sideEnum.left)\">\r\n                                        <option *ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\" [selected]=\"y === calendarVariables.left.dropdowns.currentYear\">\r\n                                            {{y}}\r\n                                        </option>\r\n                                    </select>\r\n                                </div>\r\n                            </ng-container>\r\n                            <ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\r\n                                    {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}  {{ calendarVariables?.left?.calendar[1][1].format(\" YYYY\")}}\r\n                            </ng-container>\r\n                        </th>\r\n                        <ng-container *ngIf=\"(!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker )\">\r\n                            <th class=\"next available\" (click)=\"clickNext(sideEnum.left)\">\r\n                            </th>\r\n                        </ng-container>\r\n                        <ng-container *ngIf=\"!((!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker ))\">\r\n                            <th></th>\r\n                        </ng-container>\r\n                    </tr>\r\n                    <tr class='week-days'>\r\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\"><span>{{this.locale.weekLabel}}</span></th>\r\n                        <th *ngFor=\"let dayofweek of locale.daysOfWeek\"><span>{{dayofweek}}</span></th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody class=\"drp-animate\">\r\n                    <tr *ngFor=\"let row of calendarVariables.left.calRows\" [class]=\"calendarVariables.left.classes[row].classList\">\r\n                        <!-- add week number -->\r\n                        <td  class=\"week\" *ngIf=\"showWeekNumbers\">\r\n                            <span>{{calendarVariables.left.calendar[row][0].week()}}</span>\r\n                        </td>\r\n                        <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\r\n                            <span>{{calendarVariables.left.calendar[row][0].isoWeek()}}</span>\r\n                        </td>\r\n                        <!-- cal -->\r\n                        <td *ngFor=\"let col of calendarVariables.left.calCols\" [class]=\"calendarVariables.left.classes[row][col]\" (click)=\"clickDate($event, sideEnum.left, row, col)\" (mouseenter)=\"hoverDate($event, sideEnum.left, row, col)\">\r\n                            <span>{{calendarVariables.left.calendar[row][col].date()}}</span>\r\n                        </td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n        <div class=\"calendar-time\" *ngIf=\"timePicker\">\r\n            <div class=\"select\">\r\n                <select class=\"hourselect select-item\" [disabled]=\"!startDate\" [(ngModel)]=\"timepickerVariables.left.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\r\n                    <option *ngFor=\"let i of timepickerVariables.left.hours\"\r\n                    [value]=\"i\"\r\n                    [disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\">{{i}}</option>\r\n                </select>\r\n            </div>\r\n            <div class=\"select\">\r\n                <select class=\"select-item minuteselect\" [disabled]=\"!startDate\" [(ngModel)]=\"timepickerVariables.left.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\r\n                    <option *ngFor=\"let i of timepickerVariables.left.minutes; let index = index;\"\r\n                    [value]=\"i\"\r\n                    [disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\">{{timepickerVariables.left.minutesLabel[index]}}</option>\r\n                </select>\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n            <div class=\"select\">\r\n                <select class=\"select-item secondselect\" *ngIf=\"timePickerSeconds\" [disabled]=\"!startDate\" [(ngModel)]=\"timepickerVariables.left.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\r\n                    <option *ngFor=\"let i of timepickerVariables.left.seconds; let index = index;\"\r\n                    [value]=\"i\"\r\n                    [disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\">{{timepickerVariables.left.secondsLabel[index]}}</option>\r\n                </select>\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n            <div class=\"select\">\r\n                <select class=\"select-item ampmselect\" *ngIf=\"!timePicker24Hour\" [(ngModel)]=\"timepickerVariables.left.ampmModel\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\r\n                    <option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\r\n                    <option value=\"PM\"  [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\r\n                </select>\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"calendar right\"\r\n        *ngIf=\"showCalInRanges && !singleDatePicker\"\r\n        >\r\n        <div class=\"calendar-table\">\r\n            <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\r\n                <thead>\r\n                    <tr>\r\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\r\n                        <ng-container *ngIf=\"(!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars)\">\r\n                            <th (click)=\"clickPrev(sideEnum.right)\" class=\"prev available\" >\r\n                            </th>\r\n                        </ng-container>\r\n                        <ng-container *ngIf=\"!((!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars))\">\r\n                            <th></th>\r\n                        </ng-container>\r\n                        <th colspan=\"5\" class=\"month\">\r\n                            <ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\r\n                                <div class=\"dropdowns\">\r\n                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}\r\n                                    <select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.right)\">\r\n                                            <option\r\n                                            [disabled]=\"(calendarVariables.right.dropdowns.inMinYear && calendarVariables.right.minDate && m < calendarVariables.right.minDate.month()) || (calendarVariables.right.dropdowns.inMaxYear && calendarVariables.right.maxDate && m > calendarVariables.right.maxDate.month())\"\r\n                                            *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\" [selected]=\"calendarVariables.right.dropdowns.currentMonth == m\">\r\n                                                {{locale.monthNames[m]}}\r\n                                            </option>\r\n                                    </select>\r\n                                </div>\r\n                                <div class=\"dropdowns\">\r\n                                        {{ calendarVariables?.right?.calendar[1][1].format(\" YYYY\")}}\r\n                                        <select class=\"yearselect\" (change)=\"yearChanged($event, sideEnum.right)\">\r\n                                        <option *ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\" [selected]=\"y === calendarVariables.right.dropdowns.currentYear\">\r\n                                            {{y}}\r\n                                        </option>\r\n                                    </select>\r\n                                </div>\r\n                            </ng-container>\r\n                            <ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\r\n                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}  {{ calendarVariables?.right?.calendar[1][1].format(\" YYYY\")}}\r\n                            </ng-container>\r\n                        </th>\r\n                            <ng-container *ngIf=\"!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true)\">\r\n                                <th class=\"next available\" (click)=\"clickNext(sideEnum.right)\">\r\n                                </th>\r\n                            </ng-container>\r\n                            <ng-container *ngIf=\"!(!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true))\">\r\n                                <th></th>\r\n                            </ng-container>\r\n                    </tr>\r\n\r\n                    <tr class='week-days'>\r\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\"><span>{{this.locale.weekLabel}}</span></th>\r\n                        <th *ngFor=\"let dayofweek of locale.daysOfWeek\"><span>{{dayofweek}}</span></th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr *ngFor=\"let row of calendarVariables.right.calRows\" [class]=\"calendarVariables.right.classes[row].classList\">\r\n                        <td class=\"week\" *ngIf=\"showWeekNumbers\">\r\n                            <span>{{calendarVariables.right.calendar[row][0].week()}}</span>\r\n                        </td>\r\n                        <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\r\n                            <span>{{calendarVariables.right.calendar[row][0].isoWeek()}}</span>\r\n                        </td>\r\n                        <td *ngFor=\"let col of calendarVariables.right.calCols\" [class]=\"calendarVariables.right.classes[row][col]\" (click)=\"clickDate($event, sideEnum.right, row, col)\" (mouseenter)=\"hoverDate($event, sideEnum.right, row, col)\">\r\n                            <span>{{calendarVariables.right.calendar[row][col].date()}}</span>\r\n                        </td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n        <div class=\"calendar-time\" *ngIf=\"timePicker\">\r\n            <div class=\"select\">\r\n                <select class=\"select-item hourselect\" [disabled]=\"!startDate\" [(ngModel)]=\"timepickerVariables.right.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\r\n                    <option *ngFor=\"let i of timepickerVariables.right.hours\"\r\n                    [value]=\"i\"\r\n                    [disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\">{{i}}</option>\r\n                </select>\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n            <div class=\"select\">\r\n                <select class=\"select-item minuteselect\" [disabled]=\"!startDate\" [(ngModel)]=\"timepickerVariables.right.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\r\n                    <option *ngFor=\"let i of timepickerVariables.right.minutes; let index = index;\"\r\n                    [value]=\"i\"\r\n                    [disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\">{{timepickerVariables.right.minutesLabel[index]}}</option>\r\n                </select>\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n            <div class=\"select\">\r\n                <select *ngIf=\"timePickerSeconds\" class=\"select-item secondselect\" [disabled]=\"!startDate\" [(ngModel)]=\"timepickerVariables.right.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\r\n                    <option *ngFor=\"let i of timepickerVariables.right.seconds; let index = index;\"\r\n                    [value]=\"i\"\r\n                    [disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\">{{timepickerVariables.right.secondsLabel[index]}}</option>\r\n                </select>\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n            <div class=\"select\">\r\n                <select *ngIf=\"!timePicker24Hour\" class=\"select-item ampmselect\" [(ngModel)]=\"timepickerVariables.right.ampmModel\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\r\n                    <option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\r\n                    <option value=\"PM\"  [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\r\n                </select>\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"buttons\" *ngIf=\"!autoApply && ( !rangesArray.length || (showCalInRanges && !singleDatePicker))\">\r\n        <div class=\"buttons_input\">\r\n            <button  *ngIf=\"showClearButton\" class=\"btn btn-default clear\" type=\"button\" (click)=\"clear()\" [title]=\"locale.clearLabel\">\r\n                {{locale.clearLabel}}\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30\" height=\"30\" viewBox=\"0 -5 24 24\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/></svg>\r\n            </button>\r\n            <button class=\"btn btn-default\" *ngIf=\"showCancel\" type=\"button\" (click)=\"clickCancel($event)\">{{locale.cancelLabel}}</button>\r\n            <button class=\"btn\"  [disabled]=\"applyBtn.disabled\" type=\"button\" (click)=\"clickApply($event)\">{{locale.applyLabel}}</button>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
        host: {
            '(click)': 'handleInternalClick($event)',
        },
        encapsulation: ViewEncapsulation.None,
        providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DaterangepickerComponent_1),
                multi: true
            }],
        styles: [".md-drppicker{background-color:#fff;border-radius:4px;box-shadow:0 2px 4px 0 rgba(0,0,0,.16),0 2px 8px 0 rgba(0,0,0,.12);color:inherit;font-family:Roboto,sans-serif;font-size:14px;margin-top:-10px;overflow:hidden;padding:4px;position:absolute;width:278px;z-index:1000}.md-drppicker.double{width:auto}.md-drppicker.inline{display:inline-block;position:relative}.md-drppicker:after,.md-drppicker:before{border-bottom-color:rgba(0,0,0,.2);content:\"\";display:inline-block;position:absolute}.md-drppicker.openscenter:before{left:0;margin-left:auto;margin-right:auto;right:0;width:0}.md-drppicker.openscenter:after{left:0;margin-left:auto;margin-right:auto;right:0;width:0}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{-moz-user-select:none;-ms-user-select:none;-webkit-touch-callout:none;-webkit-user-select:none;transform:scale(1);transform-origin:0 0;transition:all .1s ease-in-out;user-select:none}.md-drppicker.shown.drops-up-left{transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{transform-origin:0 100%}.md-drppicker.shown.drops-down-left{transform-origin:100% 0}.md-drppicker.shown.drops-down-right{transform-origin:0 0}.md-drppicker.shown.drops-down-center{transform-origin:NaN%}.md-drppicker.shown.drops-up-center{transform-origin:50%}.md-drppicker.shown .calendar{display:block}.md-drppicker.hidden{-moz-user-select:none;-ms-user-select:none;-webkit-touch-callout:none;-webkit-user-select:none;cursor:default;transform:scale(0);transform-origin:0 0;transition:all .1s ease;user-select:none}.md-drppicker.hidden.drops-up-left{transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{transform-origin:0 0}.md-drppicker.hidden.drops-down-center{transform-origin:50% 0}.md-drppicker.hidden.drops-up-center{transform-origin:50% 100%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{margin:4px;max-width:270px}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{min-width:32px;padding:0;text-align:center;white-space:nowrap}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{background-color:#fff;border:1px solid #fff;border-radius:4px;padding:4px}.md-drppicker table{margin:0;width:100%}.md-drppicker th{color:#988c8c}.md-drppicker td,.md-drppicker th{border:1px solid transparent;border-radius:4px;cursor:pointer;height:20px;height:2em;text-align:center;white-space:nowrap;width:20px;width:2em}.md-drppicker td.available.prev,.md-drppicker th.available.prev{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K\");background-position:50%;background-repeat:no-repeat;background-size:.5em;border-radius:2em;display:block;opacity:.8;transition:background-color .2s ease}.md-drppicker td.available.prev:hover,.md-drppicker th.available.prev:hover{margin:0}.md-drppicker td.available.next,.md-drppicker th.available.next{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K\");background-position:50%;background-repeat:no-repeat;background-size:.5em;border-radius:2em;display:block;opacity:.8;transform:rotate(180deg);transition:background-color .2s ease}.md-drppicker td.available.next:hover,.md-drppicker th.available.next:hover{margin:0;transform:rotate(180deg)}.md-drppicker td.available:hover,.md-drppicker th.available:hover{background-color:#eee;background-position:50%;background-repeat:no-repeat;background-size:.5em;border-color:transparent;border-radius:2em;color:inherit;margin:.25em 0;opacity:.8;transform:scale(1);transition:all .45s cubic-bezier(.23,1,.32,1) 0ms}.md-drppicker td.week,.md-drppicker th.week{color:#ccc;font-size:80%}.md-drppicker td{border-radius:2em;margin:.25em 0;opacity:.8;transform:scale(1);transition:background-color .2s ease;transition:all .45s cubic-bezier(.23,1,.32,1) 0ms}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:#dde2e4;border-color:transparent;border-radius:0;color:#000}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:4px}.md-drppicker td.active{background:rgba(0,0,0,.1);transition:background .3s ease-out}.md-drppicker td.active,.md-drppicker td.active:hover{background-color:#3f51b5;border-color:transparent;color:#fff}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=);background-position-x:right;background-position-y:center;background-repeat:no-repeat;background-size:10px;width:50px}.md-drppicker .dropdowns select{background-color:hsla(0,0%,100%,.9);border:1px solid #f2f2f2;border-radius:2px;display:inline-block;height:3rem;padding:5px;width:100%}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{cursor:default;font-size:12px;height:auto;padding:1px}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{background:#eee;border:1px solid #eee;font-size:12px;margin:0 auto;outline:0;padding:2px;width:50px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{cursor:pointer;left:0;margin:0;opacity:0;padding:0;position:absolute;top:0}.md-drppicker th.month>div{display:inline-block;position:relative}.md-drppicker .calendar-time{line-height:30px;margin:4px auto 0;position:relative;text-align:center}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{background-color:transparent;border:none;border-bottom:1px solid rgba(0,0,0,.12);border-radius:0;display:inline-block;font-family:inherit;font-size:18px;padding:10px 10px 10px 0;position:relative;width:auto}.md-drppicker .calendar-time .select .select-item:after{border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);content:\"\";height:0;padding:0;pointer-events:none;position:absolute;right:10px;top:18px;width:0}.md-drppicker .calendar-time .select .select-item:focus{outline:none}.md-drppicker .calendar-time .select .select-item .select-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;left:0;pointer-events:none;position:absolute;top:10px;transition:all .2s ease}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .label-input{border:1px solid #ccc;border-radius:4px;color:#555;display:block;height:30px;line-height:30px;margin:0 auto 5px;padding:0 0 0 28px;vertical-align:middle;width:100%}.md-drppicker .label-input.active{border:1px solid #08c;border-radius:4px}.md-drppicker .md-drppicker_input{padding:0 30px 0 0;position:relative}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{left:8px;position:absolute;top:8px}.md-drppicker.rtl .label-input{padding-left:6px;padding-right:28px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;margin:0;text-align:left}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px}.md-drppicker .ranges ul li button{background:none;border:none;cursor:pointer;padding:8px 12px;text-align:left;width:100%}.md-drppicker .ranges ul li button.active{background-color:#3f51b5;color:#fff}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .ranges ul li button:active{background:transparent}.md-drppicker .ranges ul li:hover{background-color:#eee}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{margin:0 5px 5px 0;text-align:right}.md-drppicker .btn{background-color:#3f51b5;border:none;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);color:#ecf0f1;cursor:pointer;height:auto;line-height:36px;outline:none;overflow:hidden;padding:0 6px;position:relative;text-transform:uppercase;transition:background-color .4s}.md-drppicker .btn:focus,.md-drppicker .btn:hover{background-color:#3f51b5}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{background-color:rgba(236,240,241,.3);border-radius:100%;content:\"\";display:block;left:50%;padding-top:0;position:absolute;top:50%;transform:translate(-50%,-50%);width:0}.md-drppicker .btn:active:before{padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out;width:120%}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .btn.btn-default{background-color:#dcdcdc;color:#000}.md-drppicker .clear{background-color:#fff!important;box-shadow:none}.md-drppicker .clear svg{color:#eb3232;fill:currentColor}@media (min-width:564px){.md-drppicker{width:auto}.md-drppicker.single .calendar.left{clear:none}.md-drppicker.ltr{direction:ltr;text-align:left}.md-drppicker.ltr .calendar.left{clear:left}.md-drppicker.ltr .calendar.left .calendar-table{border-bottom-right-radius:0;border-right:none;border-top-right-radius:0}.md-drppicker.ltr .calendar.right{margin-left:0}.md-drppicker.ltr .calendar.right .calendar-table{border-bottom-left-radius:0;border-left:none;border-top-left-radius:0}.md-drppicker.ltr .left .md-drppicker_input,.md-drppicker.ltr .right .md-drppicker_input{padding-right:35px}.md-drppicker.ltr .calendar.left .calendar-table{padding-right:12px}.md-drppicker.ltr .calendar,.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl{direction:rtl;text-align:right}.md-drppicker.rtl .calendar.left{clear:right;margin-left:0}.md-drppicker.rtl .calendar.left .calendar-table{border-bottom-left-radius:0;border-left:none;border-top-left-radius:0}.md-drppicker.rtl .calendar.right{margin-right:0}.md-drppicker.rtl .calendar.right .calendar-table{border-bottom-right-radius:0;border-right:none;border-top-right-radius:0}.md-drppicker.rtl .calendar.left .calendar-table,.md-drppicker.rtl .left .md-drppicker_input{padding-left:12px}.md-drppicker.rtl .calendar,.md-drppicker.rtl .ranges{float:right;text-align:right}.drp-animate{transform:translate(0);transition:transform .2s ease,opacity .2s ease}.drp-animate.drp-picker-site-this{transition-timing-function:linear}.drp-animate.drp-animate-right{opacity:0;transform:translateX(10%)}.drp-animate.drp-animate-left{opacity:0;transform:translateX(-10%)}}@media (min-width:730px){.md-drppicker .ranges{width:auto}.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl .ranges{float:right}.md-drppicker .calendar.left{clear:none!important}}"]
    })
], DaterangepickerComponent);
export { DaterangepickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJGOi9QUk9KRUNUL1RFTVAvbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC9zcmMvZGF0ZXJhbmdlcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sRUFBcUIsU0FBUyxFQUFjLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEosT0FBTyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sS0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBSWxDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUV2QixNQUFNLENBQU4sSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ2hCLHlCQUFhLENBQUE7SUFDYiwyQkFBZSxDQUFBO0FBQ25CLENBQUMsRUFIVyxRQUFRLEtBQVIsUUFBUSxRQUduQjtBQWdCRCxJQUFhLHdCQUF3QixnQ0FBckMsTUFBYSx3QkFBd0I7SUFrSmpDLFlBQ1ksRUFBYyxFQUNkLElBQXVCLEVBQ3ZCLGNBQTZCO1FBRjdCLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUN2QixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQXBKakMsU0FBSSxHQUEyQixFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDO1FBRWhFLHNCQUFpQixHQUE0QixFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBQyxDQUFDO1FBQ25FLGdCQUFXLEdBQUcsRUFBRSxDQUFDLENBQUUsMEJBQTBCO1FBQzdDLHdCQUFtQixHQUE0QixFQUFDLElBQUksRUFB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QUFDZDtJQUFSLEtBQUssRUFBRTt1REFBZTtBQUNkO0lBQVIsS0FBSyxFQUFFO2tFQUF5QjtBQUN2QjtJQUFULE1BQU0sRUFBRTs2REFBbUM7QUFDbEM7SUFBVCxNQUFNLEVBQUU7OERBQW9DO0FBQ25DO0lBQVQsTUFBTSxFQUFFOzhEQUFvQztBQUNuQztJQUFULE1BQU0sRUFBRTtrRUFBd0M7QUFDdkM7SUFBVCxNQUFNLEVBQUU7Z0VBQXNDO0FBQ3JDO0lBQVQsTUFBTSxFQUFFOytEQUFxQztBQUNFO0lBQS9DLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztpRUFBNkI7QUF5YTVFO0lBREMsS0FBSyxFQUFFOzZEQUdQO0FBRUQ7SUFEQyxLQUFLLEVBQUU7NERBR1A7QUFFRDtJQURDLEtBQUssRUFBRTs2REFHUDtBQW5rQlEsd0JBQXdCO0lBZHBDLFNBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSw4QkFBOEI7UUFFeEMsODRqQkFBK0M7UUFDL0MsSUFBSSxFQUFFO1lBQ04sU0FBUyxFQUFFLDZCQUE2QjtTQUN2QztRQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1FBQ3JDLFNBQVMsRUFBRSxDQUFDO2dCQUNSLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQXdCLENBQUM7Z0JBQ3ZELEtBQUssRUFBRSxJQUFJO2FBQ2QsQ0FBQzs7S0FDTCxDQUFDO0dBQ1csd0JBQXdCLENBbXhDcEM7U0FueENZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1Db250cm9sLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgeyBMb2NhbGVDb25maWcgfSBmcm9tICcuL2RhdGVyYW5nZXBpY2tlci5jb25maWcnO1xyXG5pbXBvcnQgeyBMb2NhbGVTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGUuc2VydmljZSc7XHJcblxyXG5jb25zdCBtb21lbnQgPSBfbW9tZW50O1xyXG5cclxuZXhwb3J0IGVudW0gU2lkZUVudW0ge1xyXG4gICAgbGVmdCA9ICdsZWZ0JyxcclxuICAgIHJpZ2h0ID0gJ3JpZ2h0J1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50LnNjc3MnXSxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgaG9zdDoge1xyXG4gICAgJyhjbGljayknOiAnaGFuZGxlSW50ZXJuYWxDbGljaygkZXZlbnQpJyxcclxuICAgIH0sXHJcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gICAgcHJvdmlkZXJzOiBbe1xyXG4gICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCksXHJcbiAgICAgICAgbXVsdGk6IHRydWVcclxuICAgIH1dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gICAgcHJpdmF0ZSBfb2xkOiB7c3RhcnQ6IGFueSwgZW5kOiBhbnl9ID0ge3N0YXJ0OiBudWxsLCBlbmQ6IG51bGx9O1xyXG4gICAgY2hvc2VuTGFiZWw6IHN0cmluZztcclxuICAgIGNhbGVuZGFyVmFyaWFibGVzOiB7bGVmdDogYW55LCByaWdodDogYW55fSA9IHtsZWZ0OiB7fSwgcmlnaHQ6IHt9fTtcclxuICAgIHRvb2x0aXB0ZXh0ID0gW107ICAvLyBmb3Igc3RvcmluZyB0b29sdGlwdGV4dFxyXG4gICAgdGltZXBpY2tlclZhcmlhYmxlczoge2xlZnQ6IGFueSwgcmlnaHQ6IGFueX0gPSB7bGVmdDoge30sIHJpZ2h0OiB7fX07XHJcbiAgICBkYXRlcmFuZ2VwaWNrZXI6IHtzdGFydDogRm9ybUNvbnRyb2wsIGVuZDogRm9ybUNvbnRyb2x9ID0ge3N0YXJ0OiBuZXcgRm9ybUNvbnRyb2woKSwgZW5kOiBuZXcgRm9ybUNvbnRyb2woKX07XHJcbiAgICBhcHBseUJ0bjoge2Rpc2FibGVkOiBib29sZWFufSA9IHtkaXNhYmxlZDogZmFsc2V9O1xyXG4gICAgQElucHV0KClcclxuICAgIHN0YXJ0RGF0ZSA9IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgQElucHV0KClcclxuICAgIGVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIGRhdGVMaW1pdDogbnVtYmVyID0gbnVsbDtcclxuICAgIC8vIHVzZWQgaW4gdGVtcGxhdGUgZm9yIGNvbXBpbGUgdGltZSBzdXBwb3J0IG9mIGVudW0gdmFsdWVzLlxyXG4gICAgc2lkZUVudW0gPSBTaWRlRW51bTtcclxuXHJcbiAgICBfbWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IG1pbkRhdGUodmFsdWU6IF9tb21lbnQuTW9tZW50IHwgc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKF9tb21lbnQuaXNNb21lbnQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21pbkRhdGUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aGlzLl9taW5EYXRlID0gbW9tZW50KHZhbHVlKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21pbkRhdGUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBnZXRNaW5EYXRlKCk6IF9tb21lbnQuTW9tZW50IHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pbkRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgX21heERhdGU6IF9tb21lbnQuTW9tZW50O1xyXG4gICAgQElucHV0KClcclxuICAgIHNldCBtYXhEYXRlKHZhbHVlOiBfbW9tZW50Lk1vbWVudCB8IHN0cmluZykge1xyXG4gICAgICAgIGlmIChfbW9tZW50LmlzTW9tZW50KHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhEYXRlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWF4RGF0ZSA9IG1vbWVudCh2YWx1ZSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhEYXRlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRNYXhEYXRlKCk6IF9tb21lbnQuTW9tZW50IHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heERhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIGF1dG9BcHBseTogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHNpbmdsZURhdGVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93RHJvcGRvd25zOiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd1dlZWtOdW1iZXJzOiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd0lTT1dlZWtOdW1iZXJzOiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgbGlua2VkQ2FsZW5kYXJzOiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgYXV0b1VwZGF0ZUlucHV0OiBCb29sZWFuID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBhbHdheXNTaG93Q2FsZW5kYXJzOiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgbWF4U3BhbjogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIGxvY2tTdGFydERhdGU6IEJvb2xlYW4gPSBmYWxzZTtcclxuICAgIC8vIHRpbWVwaWNrZXIgdmFyaWFibGVzXHJcbiAgICBASW5wdXQoKVxyXG4gICAgdGltZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICB0aW1lUGlja2VySW5jcmVtZW50ID0gMTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICB0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLy8gZW5kIG9mIHRpbWVwaWNrZXIgdmFyaWFibGVzXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd0NsZWFyQnV0dG9uOiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgZmlyc3RNb250aERheUNsYXNzOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgQElucHV0KClcclxuICAgIGxhc3RNb250aERheUNsYXNzOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgQElucHV0KClcclxuICAgIGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgQElucHV0KClcclxuICAgIGVtcHR5V2Vla0NvbHVtbkNsYXNzOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgQElucHV0KClcclxuICAgIGZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzczogc3RyaW5nID0gbnVsbDtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBsYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgX2xvY2FsZTogTG9jYWxlQ29uZmlnID0ge307XHJcbiAgICBASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX2xvY2FsZSA9IHsuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWV9O1xyXG4gICAgfVxyXG4gICAgZ2V0IGxvY2FsZSgpOiBhbnkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gICAgfVxyXG4gICAgLy8gY3VzdG9tIHJhbmdlc1xyXG4gICAgX3JhbmdlczogYW55ID0ge307XHJcblxyXG4gICAgQElucHV0KCkgc2V0IHJhbmdlcyh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlcyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyUmFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgcmFuZ2VzKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlcztcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd0NhbmNlbCA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2UgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93UmFuZ2VMYWJlbE9uSW5wdXQgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBjdXN0b21SYW5nZURpcmVjdGlvbiA9IGZhbHNlO1xyXG4gICAgY2hvc2VuUmFuZ2U6IHN0cmluZztcclxuICAgIHJhbmdlc0FycmF5OiBBcnJheTxhbnk+ID0gW107XHJcblxyXG4gICAgLy8gc29tZSBzdGF0ZSBpbmZvcm1hdGlvblxyXG4gICAgaXNTaG93bjogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgaW5saW5lID0gdHJ1ZTtcclxuICAgIGxlZnRDYWxlbmRhcjogYW55ID0ge307XHJcbiAgICByaWdodENhbGVuZGFyOiBhbnkgPSB7fTtcclxuICAgIHNob3dDYWxJblJhbmdlczogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgbm93SG92ZXJlZERhdGUgPSBudWxsO1xyXG4gICAgcGlja2luZ0RhdGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIG9wdGlvbnM6IGFueSA9IHt9IDsgLy8gc2hvdWxkIGdldCBzb21lIG9wdCBmcm9tIHVzZXJcclxuICAgIEBJbnB1dCgpIGRyb3BzOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBvcGVuczogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XHJcbiAgICBAT3V0cHV0KCkgY2hvb3NlZERhdGU6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xyXG4gICAgQE91dHB1dCgpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XHJcbiAgICBAT3V0cHV0KCkgZGF0ZXNVcGRhdGVkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcclxuICAgIEBPdXRwdXQoKSBzdGFydERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcclxuICAgIEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XHJcbiAgICBAT3V0cHV0KCkgY2FuY2VsQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XHJcbiAgICBAVmlld0NoaWxkKCdwaWNrZXJDb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBwaWNrZXJDb250YWluZXI6IEVsZW1lbnRSZWY7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIF9yZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgICAgIHByaXZhdGUgX2xvY2FsZVNlcnZpY2U6IExvY2FsZVNlcnZpY2VcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuY2hvb3NlZERhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5yYW5nZUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5kYXRlc1VwZGF0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydERhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgICAgIHRoaXMuZW5kRGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5jYW5jZWxDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMuX2J1aWxkTG9jYWxlKCk7XHJcbiAgICAgICAgY29uc3QgZGF5c09mV2VlayA9IFsuLi50aGlzLmxvY2FsZS5kYXlzT2ZXZWVrXTtcclxuICAgICAgICB0aGlzLmxvY2FsZS5maXJzdERheSA9IHRoaXMubG9jYWxlLmZpcnN0RGF5ICUgNztcclxuICAgICAgICBpZiAodGhpcy5sb2NhbGUuZmlyc3REYXkgIT09IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZXJhdG9yID0gdGhpcy5sb2NhbGUuZmlyc3REYXk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoaXRlcmF0b3IgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBkYXlzT2ZXZWVrLnB1c2goZGF5c09mV2Vlay5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2NhbGUuZGF5c09mV2VlayA9IGRheXNPZldlZWs7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5saW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX29sZC5lbmQgPSB0aGlzLmVuZERhdGUuY2xvbmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLnRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgIHRoaXMuc2V0U3RhcnREYXRlKHRoaXMuc3RhcnREYXRlKTtcclxuICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUgJiYgdGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICB0aGlzLnNldEVuZERhdGUodGhpcy5lbmREYXRlKTtcclxuICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5yaWdodCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJSYW5nZXMoKTtcclxuICAgIH1cclxuICAgIHJlbmRlclJhbmdlcygpIHtcclxuICAgICAgICB0aGlzLnJhbmdlc0FycmF5ID0gW107XHJcbiAgICAgICAgbGV0IHN0YXJ0LCBlbmQ7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnJhbmdlcyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCByYW5nZSBpbiB0aGlzLnJhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VzW3JhbmdlXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZXNbcmFuZ2VdWzBdID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IG1vbWVudCh0aGlzLnJhbmdlc1tyYW5nZV1bMF0sIHRoaXMubG9jYWxlLmZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnJhbmdlc1tyYW5nZV1bMV0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCA9IG1vbWVudCh0aGlzLnJhbmdlc1tyYW5nZV1bMV0sIHRoaXMubG9jYWxlLmZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gbW9tZW50KHRoaXMucmFuZ2VzW3JhbmdlXVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzdGFydCBvciBlbmQgZGF0ZSBleGNlZWQgdGhvc2UgYWxsb3dlZCBieSB0aGUgbWluRGF0ZSBvciBtYXhTcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb3B0aW9ucywgc2hvcnRlbiB0aGUgcmFuZ2UgdG8gdGhlIGFsbG93YWJsZSBwZXJpb2QuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0TWluRGF0ZSgpICYmIHN0YXJ0LmlzQmVmb3JlKHRoaXMuZ2V0TWluRGF0ZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHRoaXMuZ2V0TWluRGF0ZSgpLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXhEYXRlID0gdGhpcy5nZXRNYXhEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4U3BhbiAmJiBtYXhEYXRlICYmIHN0YXJ0LmNsb25lKCkuYWRkKHRoaXMubWF4U3BhbikuaXNBZnRlcihtYXhEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhEYXRlID0gc3RhcnQuY2xvbmUoKS5hZGQodGhpcy5tYXhTcGFuKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1heERhdGUgJiYgZW5kLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gbWF4RGF0ZS5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgZW5kIG9mIHRoZSByYW5nZSBpcyBiZWZvcmUgdGhlIG1pbmltdW0gb3IgdGhlIHN0YXJ0IG9mIHRoZSByYW5nZSBpc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRoZSBtYXhpbXVtLCBkb24ndCBkaXNwbGF5IHRoaXMgcmFuZ2Ugb3B0aW9uIGF0IGFsbC5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMuZ2V0TWluRGF0ZSgpICYmIGVuZC5pc0JlZm9yZSh0aGlzLmdldE1pbkRhdGUoKSwgdGhpcy50aW1lUGlja2VyID8gJ21pbnV0ZScgOiAnZGF5JykpXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgKG1heERhdGUgJiYgc3RhcnQuaXNBZnRlcihtYXhEYXRlLCB0aGlzLnRpbWVQaWNrZXIgPyAnbWludXRlJyA6ICdkYXknKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN1cHBvcnQgdW5pY29kZSBjaGFycyBpbiB0aGUgcmFuZ2UgbmFtZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSByYW5nZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZUh0bWwgPSBlbGVtLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzW3JhbmdlSHRtbF0gPSBbc3RhcnQsIGVuZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChjb25zdCByYW5nZSBpbiB0aGlzLnJhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VzW3JhbmdlXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzQXJyYXkucHVzaChyYW5nZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd0N1c3RvbVJhbmdlTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzQXJyYXkucHVzaCh0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9ICghdGhpcy5yYW5nZXNBcnJheS5sZW5ndGgpIHx8IHRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycztcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLmVuZERhdGUuZW5kT2YoJ2RheScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHJlbmRlclRpbWVQaWNrZXIoc2lkZTogU2lkZUVudW0pIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWQsIG1pbkRhdGU7XHJcbiAgICAgICAgY29uc3QgbWF4RGF0ZSA9IHRoaXMuZ2V0TWF4RGF0ZSgpO1xyXG4gICAgICAgIGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKSxcclxuICAgICAgICAgICAgbWluRGF0ZSA9IHRoaXMuZ2V0TWluRGF0ZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQgJiYgdGhpcy5lbmREYXRlKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkID0gdGhpcy5lbmREYXRlLmNsb25lKCksXHJcbiAgICAgICAgICAgIG1pbkRhdGUgPSB0aGlzLnN0YXJ0RGF0ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHNpZGUgPT09IFNpZGVFbnVtLnJpZ2h0ICYmICF0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgLy8gZG9uJ3QgaGF2ZSBhbiBlbmQgZGF0ZSwgdXNlIHRoZSBzdGFydCBkYXRlIHRoZW4gcHV0IHRoZSBzZWxlY3RlZCB0aW1lIGZvciB0aGUgcmlnaHQgc2lkZSBhcyB0aGUgdGltZVxyXG4gICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuX2dldERhdGVXaXRoVGltZSh0aGlzLnN0YXJ0RGF0ZSwgU2lkZUVudW0ucmlnaHQpO1xyXG4gICAgICAgICAgICBpZihzZWxlY3RlZC5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkpe1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpOyAgLy9zZXQgaXQgYmFjayB0byB0aGUgc3RhcnQgZGF0ZSB0aGUgdGltZSB3YXMgYmFja3dhcmRzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWluRGF0ZSA9IHRoaXMuc3RhcnREYXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMudGltZVBpY2tlcjI0SG91ciA/IDAgOiAxO1xyXG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMudGltZVBpY2tlcjI0SG91ciA/IDIzIDogMTI7XHJcbiAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdID0ge1xyXG4gICAgICAgICAgICBob3VyczogW10sXHJcbiAgICAgICAgICAgIG1pbnV0ZXM6IFtdLFxyXG4gICAgICAgICAgICBtaW51dGVzTGFiZWw6IFtdLFxyXG4gICAgICAgICAgICBzZWNvbmRzOiBbXSxcclxuICAgICAgICAgICAgc2Vjb25kc0xhYmVsOiBbXSxcclxuICAgICAgICAgICAgZGlzYWJsZWRIb3VyczogW10sXHJcbiAgICAgICAgICAgIGRpc2FibGVkTWludXRlczogW10sXHJcbiAgICAgICAgICAgIGRpc2FibGVkU2Vjb25kczogW10sXHJcbiAgICAgICAgICAgIHNlbGVjdGVkSG91cjogMCxcclxuICAgICAgICAgICAgc2VsZWN0ZWRNaW51dGU6IDAsXHJcbiAgICAgICAgICAgIHNlbGVjdGVkU2Vjb25kOiAwLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgaG91cnNcclxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGlfaW5fMjQgPSBpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xyXG4gICAgICAgICAgICAgICAgaV9pbl8yNCA9IHNlbGVjdGVkLmhvdXIoKSA+PSAxMiA/IChpID09PSAxMiA/IDEyIDogaSArIDEyKSA6IChpID09PSAxMiA/IDAgOiBpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkuaG91cihpX2luXzI0KTtcclxuICAgICAgICAgICAgbGV0IGRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChtaW5EYXRlICYmIHRpbWUubWludXRlKDU5KS5pc0JlZm9yZShtaW5EYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtYXhEYXRlICYmIHRpbWUubWludXRlKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmhvdXJzLnB1c2goaSk7XHJcbiAgICAgICAgICAgIGlmIChpX2luXzI0ID09PSBzZWxlY3RlZC5ob3VyKCkgJiYgIWRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyID0gaTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmRpc2FibGVkSG91cnMucHVzaChpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgbWludXRlc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkgKz0gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZGRlZCA9IGkgPCAxMCA/ICcwJyArIGkgOiBpO1xyXG4gICAgICAgICAgICBjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5taW51dGUoaSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKG1pbkRhdGUgJiYgdGltZS5zZWNvbmQoNTkpLmlzQmVmb3JlKG1pbkRhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1heERhdGUgJiYgdGltZS5zZWNvbmQoMCkuaXNBZnRlcihtYXhEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzLnB1c2goaSk7XHJcbiAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzTGFiZWwucHVzaChwYWRkZWQpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQubWludXRlKCkgPT09IGkgJiYgIWRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUgPSBpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uZGlzYWJsZWRNaW51dGVzLnB1c2goaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgc2Vjb25kc1xyXG4gICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXJTZWNvbmRzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFkZGVkID0gaSA8IDEwID8gJzAnICsgaSA6IGk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5zZWNvbmQoaSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAobWluRGF0ZSAmJiB0aW1lLmlzQmVmb3JlKG1pbkRhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG1heERhdGUgJiYgdGltZS5pc0FmdGVyKG1heERhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWNvbmRzLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2Vjb25kc0xhYmVsLnB1c2gocGFkZGVkKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZC5zZWNvbmQoKSA9PT0gaSAmJiAhZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQgPSBpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZFNlY29uZHMucHVzaChpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZW5lcmF0ZSBBTS9QTVxyXG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhbV9odG1sID0gJyc7XHJcbiAgICAgICAgICAgIGNvbnN0IHBtX2h0bWwgPSAnJztcclxuXHJcbiAgICAgICAgICAgIGlmIChtaW5EYXRlICYmIHNlbGVjdGVkLmNsb25lKCkuaG91cigxMikubWludXRlKDApLnNlY29uZCgwKS5pc0JlZm9yZShtaW5EYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtRGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWF4RGF0ZSAmJiBzZWxlY3RlZC5jbG9uZSgpLmhvdXIoMCkubWludXRlKDApLnNlY29uZCgwKS5pc0FmdGVyKG1heERhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0ucG1EaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkLmhvdXIoKSA+PSAxMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbCA9ICdQTSc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsID0gJ0FNJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgIH1cclxuICAgIHJlbmRlckNhbGVuZGFyKHNpZGU6IFNpZGVFbnVtKSB7IC8vIHNpZGUgZW51bVxyXG4gICAgICAgIGNvbnN0IG1haW5DYWxlbmRhcjogYW55ID0gKCBzaWRlID09PSBTaWRlRW51bS5sZWZ0ICkgPyB0aGlzLmxlZnRDYWxlbmRhciA6IHRoaXMucmlnaHRDYWxlbmRhcjtcclxuICAgICAgICBjb25zdCBtb250aCA9IG1haW5DYWxlbmRhci5tb250aC5tb250aCgpO1xyXG4gICAgICAgIGNvbnN0IHllYXIgPSBtYWluQ2FsZW5kYXIubW9udGgueWVhcigpO1xyXG4gICAgICAgIGNvbnN0IGhvdXIgPSBtYWluQ2FsZW5kYXIubW9udGguaG91cigpO1xyXG4gICAgICAgIGNvbnN0IG1pbnV0ZSA9IG1haW5DYWxlbmRhci5tb250aC5taW51dGUoKTtcclxuICAgICAgICBjb25zdCBzZWNvbmQgPSBtYWluQ2FsZW5kYXIubW9udGguc2Vjb25kKCk7XHJcbiAgICAgICAgY29uc3QgZGF5c0luTW9udGggPSBtb21lbnQoW3llYXIsIG1vbnRoXSkuZGF5c0luTW9udGgoKTtcclxuICAgICAgICBjb25zdCBmaXJzdERheSA9IG1vbWVudChbeWVhciwgbW9udGgsIDFdKTtcclxuICAgICAgICBjb25zdCBsYXN0RGF5ID0gbW9tZW50KFt5ZWFyLCBtb250aCwgZGF5c0luTW9udGhdKTtcclxuICAgICAgICBjb25zdCBsYXN0TW9udGggPSBtb21lbnQoZmlyc3REYXkpLnN1YnRyYWN0KDEsICdtb250aCcpLm1vbnRoKCk7XHJcbiAgICAgICAgY29uc3QgbGFzdFllYXIgPSBtb21lbnQoZmlyc3REYXkpLnN1YnRyYWN0KDEsICdtb250aCcpLnllYXIoKTtcclxuICAgICAgICBjb25zdCBkYXlzSW5MYXN0TW9udGggPSBtb21lbnQoW2xhc3RZZWFyLCBsYXN0TW9udGhdKS5kYXlzSW5Nb250aCgpO1xyXG4gICAgICAgIGNvbnN0IGRheU9mV2VlayA9IGZpcnN0RGF5LmRheSgpO1xyXG4gICAgICAgIC8vIGluaXRpYWxpemUgYSA2IHJvd3MgeCA3IGNvbHVtbnMgYXJyYXkgZm9yIHRoZSBjYWxlbmRhclxyXG4gICAgICAgIGNvbnN0IGNhbGVuZGFyOiBhbnkgPSBbXTtcclxuICAgICAgICBjYWxlbmRhci5maXJzdERheSA9IGZpcnN0RGF5O1xyXG4gICAgICAgIGNhbGVuZGFyLmxhc3REYXkgPSBsYXN0RGF5O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICAgICBjYWxlbmRhcltpXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcG9wdWxhdGUgdGhlIGNhbGVuZGFyIHdpdGggZGF0ZSBvYmplY3RzXHJcbiAgICAgICAgbGV0IHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gZGF5T2ZXZWVrICsgdGhpcy5sb2NhbGUuZmlyc3REYXkgKyAxO1xyXG4gICAgICAgIGlmIChzdGFydERheSA+IGRheXNJbkxhc3RNb250aCkge1xyXG4gICAgICAgICAgICBzdGFydERheSAtPSA3O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheU9mV2VlayA9PT0gdGhpcy5sb2NhbGUuZmlyc3REYXkpIHtcclxuICAgICAgICAgICAgc3RhcnREYXkgPSBkYXlzSW5MYXN0TW9udGggLSA2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGN1ckRhdGUgPSBtb21lbnQoW2xhc3RZZWFyLCBsYXN0TW9udGgsIHN0YXJ0RGF5LCAxMiwgbWludXRlLCBzZWNvbmRdKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGNvbCA9IDAsIHJvdyA9IDA7IGkgPCA0MjsgaSsrLCBjb2wrKywgY3VyRGF0ZSA9IG1vbWVudChjdXJEYXRlKS5hZGQoMjQsICdob3VyJykpIHtcclxuICAgICAgICAgICAgaWYgKGkgPiAwICYmIGNvbCAlIDcgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbCA9IDA7XHJcbiAgICAgICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0gPSBjdXJEYXRlLmNsb25lKCkuaG91cihob3VyKS5taW51dGUobWludXRlKS5zZWNvbmQoc2Vjb25kKTtcclxuICAgICAgICAgICAgY3VyRGF0ZS5ob3VyKDEyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldE1pbkRhdGUoKSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuZ2V0TWluRGF0ZSgpLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXHJcbiAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5pc0JlZm9yZSh0aGlzLmdldE1pbkRhdGUoKSkgJiYgc2lkZSA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0gPSB0aGlzLmdldE1pbkRhdGUoKS5jbG9uZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRNYXhEYXRlKCkgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLmdldE1heERhdGUoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSAmJlxyXG4gICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0uaXNBZnRlcih0aGlzLmdldE1heERhdGUoKSkgJiYgc2lkZSA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdID0gdGhpcy5nZXRNYXhEYXRlKCkuY2xvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgY2FsZW5kYXIgb2JqZWN0IGF2YWlsYWJsZSB0byBob3ZlckRhdGUvY2xpY2tEYXRlXHJcbiAgICAgICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBEaXNwbGF5IHRoZSBjYWxlbmRhclxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgY29uc3QgbWluRGF0ZSA9IHNpZGUgPT09ICdsZWZ0JyA/IHRoaXMuZ2V0TWluRGF0ZSgpIDogdGhpcy5zdGFydERhdGU7XHJcbiAgICAgICAgbGV0IG1heERhdGUgPSB0aGlzLmdldE1heERhdGUoKTtcclxuICAgICAgICAvLyBhZGp1c3QgbWF4RGF0ZSB0byByZWZsZWN0IHRoZSBkYXRlTGltaXQgc2V0dGluZyBpbiBvcmRlciB0b1xyXG4gICAgICAgIC8vIGdyZXkgb3V0IGVuZCBkYXRlcyBiZXlvbmQgdGhlIGRhdGVMaW1pdFxyXG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUgPT09IG51bGwgJiYgdGhpcy5kYXRlTGltaXQpIHtcclxuICAgICAgICAgICAgY29uc3QgbWF4TGltaXQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmFkZCh0aGlzLmRhdGVMaW1pdCwgJ2RheScpLmVuZE9mKCdkYXknKTtcclxuICAgICAgICAgICAgICAgIGlmICghbWF4RGF0ZSB8fCBtYXhMaW1pdC5pc0JlZm9yZShtYXhEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9IG1heExpbWl0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0gPSB7XHJcbiAgICAgICAgICAgIG1vbnRoOiBtb250aCxcclxuICAgICAgICAgICAgeWVhcjogeWVhcixcclxuICAgICAgICAgICAgaG91cjogaG91cixcclxuICAgICAgICAgICAgbWludXRlOiBtaW51dGUsXHJcbiAgICAgICAgICAgIHNlY29uZDogc2Vjb25kLFxyXG4gICAgICAgICAgICBkYXlzSW5Nb250aDogZGF5c0luTW9udGgsXHJcbiAgICAgICAgICAgIGZpcnN0RGF5OiBmaXJzdERheSxcclxuICAgICAgICAgICAgbGFzdERheTogbGFzdERheSxcclxuICAgICAgICAgICAgbGFzdE1vbnRoOiBsYXN0TW9udGgsXHJcbiAgICAgICAgICAgIGxhc3RZZWFyOiBsYXN0WWVhcixcclxuICAgICAgICAgICAgZGF5c0luTGFzdE1vbnRoOiBkYXlzSW5MYXN0TW9udGgsXHJcbiAgICAgICAgICAgIGRheU9mV2VlazogZGF5T2ZXZWVrLFxyXG4gICAgICAgICAgICAvLyBvdGhlciB2YXJzXHJcbiAgICAgICAgICAgIGNhbFJvd3M6IEFycmF5LmZyb20oQXJyYXkoNikua2V5cygpKSxcclxuICAgICAgICAgICAgY2FsQ29sczogQXJyYXkuZnJvbShBcnJheSg3KS5rZXlzKCkpLFxyXG4gICAgICAgICAgICBjbGFzc2VzOiB7fSxcclxuICAgICAgICAgICAgbWluRGF0ZTogbWluRGF0ZSxcclxuICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSxcclxuICAgICAgICAgICAgY2FsZW5kYXI6IGNhbGVuZGFyXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAodGhpcy5zaG93RHJvcGRvd25zKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gY2FsZW5kYXJbMV1bMV0ueWVhcigpO1xyXG4gICAgICAgICAgICBjb25zdCByZWFsQ3VycmVudFllYXIgPSBtb21lbnQoKS55ZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1heFllYXIgPSAobWF4RGF0ZSAmJiBtYXhEYXRlLnllYXIoKSkgfHwgKHJlYWxDdXJyZW50WWVhciArIDUpO1xyXG4gICAgICAgICAgICBjb25zdCBtaW5ZZWFyID0gKG1pbkRhdGUgJiYgbWluRGF0ZS55ZWFyKCkpIHx8IChyZWFsQ3VycmVudFllYXIgLSA1MCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGluTWluWWVhciA9IGN1cnJlbnRZZWFyID09PSBtaW5ZZWFyO1xyXG4gICAgICAgICAgICBjb25zdCBpbk1heFllYXIgPSBjdXJyZW50WWVhciA9PT0gbWF4WWVhcjtcclxuICAgICAgICAgICAgY29uc3QgeWVhcnMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IG1pblllYXI7IHkgPD0gbWF4WWVhcjsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICB5ZWFycy5wdXNoKHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zID0ge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudE1vbnRoOiBjdXJyZW50TW9udGgsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50WWVhcjogY3VycmVudFllYXIsXHJcbiAgICAgICAgICAgICAgICBtYXhZZWFyOiBtYXhZZWFyLFxyXG4gICAgICAgICAgICAgICAgbWluWWVhcjogbWluWWVhcixcclxuICAgICAgICAgICAgICAgIGluTWluWWVhcjogaW5NaW5ZZWFyLFxyXG4gICAgICAgICAgICAgICAgaW5NYXhZZWFyOiBpbk1heFllYXIsXHJcbiAgICAgICAgICAgICAgICBtb250aEFycmF5czogQXJyYXkuZnJvbShBcnJheSgxMikua2V5cygpKSxcclxuICAgICAgICAgICAgICAgIHllYXJBcnJheXM6IHllYXJzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9idWlsZENlbGxzKGNhbGVuZGFyLCBzaWRlKTtcclxuICAgIH1cclxuICAgIHNldFN0YXJ0RGF0ZShzdGFydERhdGUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHN0YXJ0RGF0ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2luZ0RhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudChzdGFydERhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tpbmdEYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlLm1pbnV0ZShNYXRoLnJvdW5kKHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0TWluRGF0ZSgpICYmIHRoaXMuc3RhcnREYXRlLmlzQmVmb3JlKHRoaXMuZ2V0TWluRGF0ZSgpKSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZ2V0TWluRGF0ZSgpLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoTWF0aC5yb3VuZCh0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0TWF4RGF0ZSgpICYmIHRoaXMuc3RhcnREYXRlLmlzQWZ0ZXIodGhpcy5nZXRNYXhEYXRlKCkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5nZXRNYXhEYXRlKCkuY2xvbmUoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlLm1pbnV0ZShNYXRoLmZsb29yKHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc1Nob3duKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZUNoYW5nZWQuZW1pdCh7c3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZX0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RW5kRGF0ZShlbmREYXRlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlbmREYXRlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQoZW5kRGF0ZSwgdGhpcy5sb2NhbGUuZm9ybWF0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZW5kRGF0ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5waWNraW5nRGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQoZW5kRGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2luZ0RhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlLmFkZCgxLCAnZCcpLnN0YXJ0T2YoJ2RheScpLnN1YnRyYWN0KDEsICdzZWNvbmQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZS5taW51dGUoTWF0aC5yb3VuZCh0aGlzLmVuZERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbmREYXRlLmlzQmVmb3JlKHRoaXMuc3RhcnREYXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0TWF4RGF0ZSgpICYmIHRoaXMuZW5kRGF0ZS5pc0FmdGVyKHRoaXMuZ2V0TWF4RGF0ZSgpKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLmdldE1heERhdGUoKS5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0ZUxpbWl0ICYmIHRoaXMuc3RhcnREYXRlLmNsb25lKCkuYWRkKHRoaXMuZGF0ZUxpbWl0LCAnZGF5JykuaXNCZWZvcmUodGhpcy5lbmREYXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmFkZCh0aGlzLmRhdGVMaW1pdCwgJ2RheScpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc1Nob3duKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMudXBkYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVuZERhdGVDaGFuZ2VkLmVtaXQoe2VuZERhdGU6IHRoaXMuZW5kRGF0ZX0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XHJcbiAgICB9XHJcbiAgICBASW5wdXQoKVxyXG4gICAgaXNJbnZhbGlkRGF0ZShkYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgQElucHV0KClcclxuICAgIGlzQ3VzdG9tRGF0ZShkYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgQElucHV0KClcclxuICAgIGlzVG9vbHRpcERhdGUoZGF0ZSk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmlldygpIHtcclxuICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU1vbnRoc0luVmlldygpIHtcclxuICAgICAgICBpZiAodGhpcy5lbmREYXRlKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIGJvdGggZGF0ZXMgYXJlIHZpc2libGUgYWxyZWFkeSwgZG8gbm90aGluZ1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLmxlZnRDYWxlbmRhci5tb250aCAmJiB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggJiZcclxuICAgICAgICAgICAgICAgICgodGhpcy5zdGFydERhdGUgJiYgdGhpcy5sZWZ0Q2FsZW5kYXIgJiYgdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMucmlnaHRDYWxlbmRhciAmJiB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKSlcclxuICAgICAgICAgICAgICAgICYmXHJcbiAgICAgICAgICAgICAgICAodGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydERhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5kYXRlKDIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtlZENhbGVuZGFycyAmJiAodGhpcy5lbmREYXRlLm1vbnRoKCkgIT09IHRoaXMuc3RhcnREYXRlLm1vbnRoKCkgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUueWVhcigpICE9PSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5lbmREYXRlLmNsb25lKCkuZGF0ZSgyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpICE9PSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSAmJlxyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgIT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0TWF4RGF0ZSgpICYmIHRoaXMubGlua2VkQ2FsZW5kYXJzICYmICF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID4gdGhpcy5nZXRNYXhEYXRlKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5nZXRNYXhEYXRlKCkuY2xvbmUoKS5kYXRlKDIpO1xyXG4gICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMuZ2V0TWF4RGF0ZSgpLmNsb25lKCkuZGF0ZSgyKS5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqICBUaGlzIGlzIHJlc3BvbnNpYmxlIGZvciB1cGRhdGluZyB0aGUgY2FsZW5kYXJzXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUNhbGVuZGFycygpIHtcclxuICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLmxlZnQpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ucmlnaHQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5lbmREYXRlID09PSBudWxsKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gdGhpcy5sb2NhbGUuZGlzcGxheUZvcm1hdCA/IHRoaXMubG9jYWxlLmRpc3BsYXlGb3JtYXQgOiB0aGlzLmxvY2FsZS5mb3JtYXQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5hdXRvVXBkYXRlSW5wdXQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgd2UgdXNlIHJhbmdlcyBhbmQgc2hvdWxkIHNob3cgcmFuZ2UgbGFiZWwgb24gaW5wdXRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCAmJiB0aGlzLnNob3dSYW5nZUxhYmVsT25JbnB1dCA9PT0gdHJ1ZSAmJiB0aGlzLmNob3NlblJhbmdlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCAhPT0gdGhpcy5jaG9zZW5SYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLmNob3NlblJhbmdlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNob3NlbkxhYmVsID0gdGhpcy5zdGFydERhdGUuZm9ybWF0KGZvcm1hdCkgK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLnNlcGFyYXRvciArIHRoaXMuZW5kRGF0ZS5mb3JtYXQoZm9ybWF0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoZm9ybWF0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiB0aGlzIHNob3VsZCBjYWxjdWxhdGUgdGhlIGxhYmVsXHJcbiAgICAgKi9cclxuICAgIGNhbGN1bGF0ZUNob3NlbkxhYmVsICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMubG9jYWxlIHx8ICF0aGlzLmxvY2FsZS5zZXBhcmF0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fYnVpbGRMb2NhbGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGN1c3RvbVJhbmdlID0gdHJ1ZTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJhbmdlIGluIHRoaXMucmFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yYW5nZXNbcmFuZ2VdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gJ1lZWVktTU0tREQgSEg6bW06c3MnIDogJ1lZWVktTU0tREQgSEg6bW0nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgdGltZXMgd2hlbiBjb21wYXJpbmcgZGF0ZXMgaWYgdGltZSBwaWNrZXIgc2Vjb25kcyBpcyBub3QgZW5hYmxlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnREYXRlLmZvcm1hdChmb3JtYXQpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMF0uZm9ybWF0KGZvcm1hdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5lbmREYXRlLmZvcm1hdChmb3JtYXQpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMV0uZm9ybWF0KGZvcm1hdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVJhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5yYW5nZXNBcnJheVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIHRpbWVzIHdoZW4gY29tcGFyaW5nIGRhdGVzIGlmIHRpbWUgcGlja2VyIGlzIG5vdCBlbmFibGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5yYW5nZXNbcmFuZ2VdWzBdLmZvcm1hdCgnWVlZWS1NTS1ERCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMV0uZm9ybWF0KCdZWVlZLU1NLUREJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVJhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5yYW5nZXNBcnJheVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY3VzdG9tUmFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNob3dDdXN0b21SYW5nZUxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5SYW5nZSA9IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gaWYgY3VzdG9tIGxhYmVsOiBzaG93IGNhbGVuZGFyXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrQXBwbHkoZT8pIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInh4eFwiKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5zdGFydERhdGUgJiYgIXRoaXMuZW5kRGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUodGhpcy5zdGFydERhdGUsIFNpZGVFbnVtLnJpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbnZhbGlkRGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgLy8gZ2V0IGlmIHRoZXJlIGFyZSBpbnZhbGlkIGRhdGUgYmV0d2VlbiByYW5nZVxyXG4gICAgICAgICAgICBjb25zdCBkID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcclxuICAgICAgICAgICAgd2hpbGUgKGQuaXNCZWZvcmUodGhpcy5lbmREYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnZhbGlkRGF0ZShkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IGQuc3VidHJhY3QoMSwgJ2RheXMnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkLmFkZCgxLCAnZGF5cycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNob3NlbkxhYmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvb3NlZERhdGUuZW1pdCh7Y2hvc2VuTGFiZWw6IHRoaXMuY2hvc2VuTGFiZWwsIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsIGVuZERhdGU6IHRoaXMuZW5kRGF0ZX0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kYXRlc1VwZGF0ZWQuZW1pdCh7c3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSwgZW5kRGF0ZTogdGhpcy5lbmREYXRlfSk7XHJcbiAgICAgICAgaWYgKGUgfHwgKHRoaXMuY2xvc2VPbkF1dG9BcHBseSAmJiAhZSkpIHtcclxuICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGlja0NhbmNlbChlKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLl9vbGQuc3RhcnQ7XHJcbiAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5fb2xkLmVuZDtcclxuICAgICAgICBpZiAodGhpcy5pbmxpbmUpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FuY2VsQ2xpY2tlZC5lbWl0KCk7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNhbGxlZCB3aGVuIG1vbnRoIGlzIGNoYW5nZWRcclxuICAgICAqIEBwYXJhbSBtb250aEV2ZW50IGdldCB2YWx1ZSBpbiBldmVudC50YXJnZXQudmFsdWVcclxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcclxuICAgICAqL1xyXG4gICAgbW9udGhDaGFuZ2VkKG1vbnRoRXZlbnQ6IGFueSwgc2lkZTogU2lkZUVudW0pIHtcclxuICAgICAgICBjb25zdCB5ZWFyID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudFllYXI7XHJcbiAgICAgICAgY29uc3QgbW9udGggPSBwYXJzZUludChtb250aEV2ZW50LnRhcmdldC52YWx1ZSwgMTApO1xyXG4gICAgICAgIHRoaXMubW9udGhPclllYXJDaGFuZ2VkKG1vbnRoLCB5ZWFyLCBzaWRlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY2FsbGVkIHdoZW4geWVhciBpcyBjaGFuZ2VkXHJcbiAgICAgKiBAcGFyYW0geWVhckV2ZW50IGdldCB2YWx1ZSBpbiBldmVudC50YXJnZXQudmFsdWVcclxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcclxuICAgICAqL1xyXG4gICAgeWVhckNoYW5nZWQoeWVhckV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XHJcbiAgICAgICAgY29uc3QgbW9udGggPSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50TW9udGg7XHJcbiAgICAgICAgY29uc3QgeWVhciA9IHBhcnNlSW50KHllYXJFdmVudC50YXJnZXQudmFsdWUsIDEwKTtcclxuICAgICAgICB0aGlzLm1vbnRoT3JZZWFyQ2hhbmdlZChtb250aCwgeWVhciwgc2lkZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNhbGxlZCB3aGVuIHRpbWUgaXMgY2hhbmdlZFxyXG4gICAgICogQHBhcmFtIHRpbWVFdmVudCAgYW4gZXZlbnRcclxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcclxuICAgICAqL1xyXG4gICAgdGltZUNoYW5nZWQodGltZUV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XHJcbiAgICAgICAgbGV0IGhvdXIgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyLCAxMCk7XHJcbiAgICAgICAgY29uc3QgbWludXRlID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlLCAxMCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kID0gdGhpcy50aW1lUGlja2VyU2Vjb25kcyA/IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZFNlY29uZCwgMTApIDogMDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcclxuICAgICAgICAgICAgY29uc3QgYW1wbSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWw7XHJcbiAgICAgICAgICAgIGlmIChhbXBtID09PSAnUE0nICYmIGhvdXIgPCAxMikge1xyXG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYW1wbSA9PT0gJ0FNJyAmJiBob3VyID09PSAxMikge1xyXG4gICAgICAgICAgICAgICAgaG91ciA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcclxuICAgICAgICAgICAgc3RhcnQuaG91cihob3VyKTtcclxuICAgICAgICAgICAgc3RhcnQubWludXRlKG1pbnV0ZSk7XHJcbiAgICAgICAgICAgIHN0YXJ0LnNlY29uZChzZWNvbmQpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXJ0RGF0ZShzdGFydCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbmREYXRlICYmIHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLUREJykgJiYgdGhpcy5lbmREYXRlLmlzQmVmb3JlKHN0YXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKHN0YXJ0LmNsb25lKCkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIXRoaXMuZW5kRGF0ZSAmJiB0aGlzLnRpbWVQaWNrZXIpe1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRDbG9uZSA9IHRoaXMuX2dldERhdGVXaXRoVGltZShzdGFydCwgU2lkZUVudW0ucmlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHN0YXJ0Q2xvbmUuaXNCZWZvcmUoc3RhcnQpKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbU2lkZUVudW0ucmlnaHRdLnNlbGVjdGVkSG91ciA9IGhvdXI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW1NpZGVFbnVtLnJpZ2h0XS5zZWxlY3RlZE1pbnV0ZSA9IG1pbnV0ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbU2lkZUVudW0ucmlnaHRdLnNlbGVjdGVkU2Vjb25kID0gc2Vjb25kO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGVuZC5ob3VyKGhvdXIpO1xyXG4gICAgICAgICAgICBlbmQubWludXRlKG1pbnV0ZSk7XHJcbiAgICAgICAgICAgIGVuZC5zZWNvbmQoc2Vjb25kKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKGVuZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIGNhbGVuZGFycyBzbyBhbGwgY2xpY2thYmxlIGRhdGVzIHJlZmxlY3QgdGhlIG5ldyB0aW1lIGNvbXBvbmVudFxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XHJcblxyXG4gICAgICAgIC8vIHJlLXJlbmRlciB0aGUgdGltZSBwaWNrZXJzIGJlY2F1c2UgY2hhbmdpbmcgb25lIHNlbGVjdGlvbiBjYW4gYWZmZWN0IHdoYXQncyBlbmFibGVkIGluIGFub3RoZXJcclxuICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ubGVmdCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XHJcbiAgICAgICAgICB0aGlzLmNsaWNrQXBwbHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqICBjYWxsIHdoZW4gbW9udGggb3IgeWVhciBjaGFuZ2VkXHJcbiAgICAgKiBAcGFyYW0gbW9udGggbW9udGggbnVtYmVyIDAgLTExXHJcbiAgICAgKiBAcGFyYW0geWVhciB5ZWFyIGVnOiAxOTk1XHJcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XHJcbiAgICAgKi9cclxuICAgIG1vbnRoT3JZZWFyQ2hhbmdlZChtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIsIHNpZGU6IFNpZGVFbnVtKSB7XHJcbiAgICAgICAgY29uc3QgaXNMZWZ0ID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdDtcclxuXHJcbiAgICAgICAgaWYgKCFpc0xlZnQpIHtcclxuICAgICAgICAgICAgaWYgKHllYXIgPCB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMuc3RhcnREYXRlLnllYXIoKSAmJiBtb250aCA8IHRoaXMuc3RhcnREYXRlLm1vbnRoKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMuc3RhcnREYXRlLm1vbnRoKCk7XHJcbiAgICAgICAgICAgICAgICB5ZWFyID0gdGhpcy5zdGFydERhdGUueWVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRNaW5EYXRlKCkpIHtcclxuICAgICAgICAgICAgaWYgKHllYXIgPCB0aGlzLmdldE1pbkRhdGUoKS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMuZ2V0TWluRGF0ZSgpLnllYXIoKSAmJiBtb250aCA8IHRoaXMuZ2V0TWluRGF0ZSgpLm1vbnRoKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMuZ2V0TWluRGF0ZSgpLm1vbnRoKCk7XHJcbiAgICAgICAgICAgICAgICB5ZWFyID0gdGhpcy5nZXRNaW5EYXRlKCkueWVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRNYXhEYXRlKCkpIHtcclxuICAgICAgICAgICAgaWYgKHllYXIgPiB0aGlzLmdldE1heERhdGUoKS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMuZ2V0TWF4RGF0ZSgpLnllYXIoKSAmJiBtb250aCA+IHRoaXMuZ2V0TWF4RGF0ZSgpLm1vbnRoKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMuZ2V0TWF4RGF0ZSgpLm1vbnRoKCk7XHJcbiAgICAgICAgICAgICAgICB5ZWFyID0gdGhpcy5nZXRNYXhEYXRlKCkueWVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRZZWFyID0geWVhcjtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50TW9udGggPSBtb250aDtcclxuICAgICAgICBpZiAoaXNMZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmNsb25lKCkuYWRkKDEsICdtb250aCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmNsb25lKCkuc3VidHJhY3QoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsaWNrIG9uIHByZXZpb3VzIG1vbnRoXHJcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0IGNhbGVuZGFyXHJcbiAgICAgKi9cclxuICAgIGNsaWNrUHJldihzaWRlOiBTaWRlRW51bSkge1xyXG4gICAgICAgIGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2xpY2sgb24gbmV4dCBtb250aFxyXG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodCBjYWxlbmRhclxyXG4gICAgICovXHJcbiAgICBjbGlja05leHQoc2lkZTogU2lkZUVudW0pIHtcclxuICAgICAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gaG92ZXJpbmcgYSBkYXRlXHJcbiAgICAgKiBAcGFyYW0gZSBldmVudDogZ2V0IHZhbHVlIGJ5IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XHJcbiAgICAgKiBAcGFyYW0gcm93IHJvdyBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBkYXRlIGNsaWNrZWRcclxuICAgICAqIEBwYXJhbSBjb2wgY29sIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxyXG4gICAgICovXHJcbiAgICBob3ZlckRhdGUoZSwgc2lkZTogU2lkZUVudW0sIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcikge1xyXG4gICAgICBjb25zdCBsZWZ0Q2FsRGF0ZSA9IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXMubGVmdC5jYWxlbmRhcltyb3ddW2NvbF07XHJcbiAgICAgIGNvbnN0IHJpZ2h0Q2FsRGF0ZSA9IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXMucmlnaHQuY2FsZW5kYXJbcm93XVtjb2xdO1xyXG4gICAgICBpZiAodGhpcy5waWNraW5nRGF0ZSkge1xyXG4gICAgICAgIHRoaXMubm93SG92ZXJlZERhdGUgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0ID8gbGVmdENhbERhdGUgOiByaWdodENhbERhdGU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5sZWZ0KTtcclxuICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLnJpZ2h0KTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCB0b29sdGlwID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdCA/IHRoaXMudG9vbHRpcHRleHRbbGVmdENhbERhdGVdIDogdGhpcy50b29sdGlwdGV4dFtyaWdodENhbERhdGVdO1xyXG4gICAgICAgICAgaWYgKHRvb2x0aXAubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgdG9vbHRpcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gc2VsZWN0aW5nIGEgZGF0ZVxyXG4gICAgICogQHBhcmFtIGUgZXZlbnQ6IGdldCB2YWx1ZSBieSBlLnRhcmdldC52YWx1ZVxyXG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxyXG4gICAgICogQHBhcmFtIHJvdyByb3cgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgZGF0ZSBjbGlja2VkXHJcbiAgICAgKiBAcGFyYW0gY29sIGNvbCBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBkYXRlIGNsaWNrZWRcclxuICAgICAqL1xyXG4gICAgY2xpY2tEYXRlKGUsIHNpZGU6IFNpZGVFbnVtLCByb3c6IG51bWJlciwgY29sOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ1REJykge1xyXG4gICAgICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYXZhaWxhYmxlJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ1NQQU4nKSB7XHJcbiAgICAgICAgICAgIGlmICghZS50YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2F2YWlsYWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRhdGUgPSBzaWRlID09PSAgU2lkZUVudW0ubGVmdCA/IHRoaXMubGVmdENhbGVuZGFyLmNhbGVuZGFyW3Jvd11bY29sXSA6IHRoaXMucmlnaHRDYWxlbmRhci5jYWxlbmRhcltyb3ddW2NvbF07XHJcblxyXG4gICAgICAgIGlmICgodGhpcy5lbmREYXRlIHx8IChkYXRlLmlzQmVmb3JlKHRoaXMuc3RhcnREYXRlLCAnZGF5JylcclxuICAgICAgICAgICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IGZhbHNlKSApICYmIHRoaXMubG9ja1N0YXJ0RGF0ZSA9PT0gZmFsc2UpIHsgLy8gcGlja2luZyBzdGFydFxyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gdGhpcy5fZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIFNpZGVFbnVtLmxlZnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhcnREYXRlKGRhdGUuY2xvbmUoKSk7XHJcbiAgICAgICAgfSAgZWxzZSBpZiAoIXRoaXMuZW5kRGF0ZSAmJiBkYXRlLmlzQmVmb3JlKHRoaXMuc3RhcnREYXRlKSAmJiB0aGlzLmN1c3RvbVJhbmdlRGlyZWN0aW9uID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IGNsaWNraW5nIHRoZSBzYW1lIGRhdGUgZm9yIHN0YXJ0L2VuZCxcclxuICAgICAgICAgICAgLy8gYnV0IHRoZSB0aW1lIG9mIHRoZSBlbmQgZGF0ZSBpcyBiZWZvcmUgdGhlIHN0YXJ0IGRhdGVcclxuICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlLmNsb25lKCkpO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vIHBpY2tpbmcgZW5kXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgICAgIGRhdGUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgU2lkZUVudW0ucmlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRlLmlzQmVmb3JlKHRoaXMuc3RhcnREYXRlLCAnZGF5JykgPT09IHRydWUgJiYgdGhpcy5jdXN0b21SYW5nZURpcmVjdGlvbiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhcnREYXRlKGRhdGUuY2xvbmUoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVuZERhdGUoZGF0ZS5jbG9uZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9BcHBseSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGlja0FwcGx5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hdXRvQXBwbHkgJiYgdGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XHJcbiAgICAgICAgICB0aGlzLmNsaWNrQXBwbHkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoaXMgaXMgdG8gY2FuY2VsIHRoZSBibHVyIGV2ZW50IGhhbmRsZXIgaWYgdGhlIG1vdXNlIHdhcyBpbiBvbmUgb2YgdGhlIGlucHV0c1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAgQ2xpY2sgb24gdGhlIGN1c3RvbSByYW5nZVxyXG4gICAgICogQHBhcmFtIGU6IEV2ZW50XHJcbiAgICAgKiBAcGFyYW0gbGFiZWxcclxuICAgICAqL1xyXG4gICAgY2xpY2tSYW5nZShlLCBsYWJlbCkge1xyXG4gICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSBsYWJlbDtcclxuICAgICAgICBpZiAobGFiZWwgPT09IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3duICA9IHRydWU7IC8vIHNob3cgY2FsZW5kYXJzXHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlcyA9IHRoaXMucmFuZ2VzW2xhYmVsXTtcclxuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSBkYXRlc1swXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBkYXRlc1sxXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaG93UmFuZ2VMYWJlbE9uSW5wdXQgJiYgbGFiZWwgIT09IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSBsYWJlbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9ICghdGhpcy5yYW5nZXNBcnJheS5sZW5ndGgpIHx8IHRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycztcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZS5lbmRPZignZGF5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2hvd24gID0gZmFsc2U7IC8vIGhpZGUgY2FsZW5kYXJzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yYW5nZUNsaWNrZWQuZW1pdCh7bGFiZWw6IGxhYmVsLCBkYXRlczogZGF0ZXN9KTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2UgfHwgdGhpcy5hdXRvQXBwbHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tBcHBseSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIHRoaXMuY2xpY2tBcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0TWF4RGF0ZSgpICYmIHRoaXMuZ2V0TWF4RGF0ZSgpLmlzU2FtZShkYXRlc1swXSwgJ21vbnRoJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgubW9udGgoZGF0ZXNbMF0ubW9udGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnllYXIoZGF0ZXNbMF0ueWVhcigpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChkYXRlc1swXS5tb250aCgpIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgueWVhcihkYXRlc1sxXS55ZWFyKCkgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgubW9udGgoZGF0ZXNbMF0ubW9udGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgueWVhcihkYXRlc1swXS55ZWFyKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgbmV4dCB5ZWFyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dE1vbnRoID0gZGF0ZXNbMF0uY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKG5leHRNb250aC5tb250aCgpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgueWVhcihuZXh0TW9udGgueWVhcigpICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNob3coZT8pIHtcclxuICAgICAgICBpZiAodGhpcy5pc1Nob3duKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XHJcbiAgICAgICAgdGhpcy5fb2xkLmVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xyXG4gICAgICAgIHRoaXMuaXNTaG93biA9IHRydWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZShlPykge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1Nob3duKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaW5jb21wbGV0ZSBkYXRlIHNlbGVjdGlvbiwgcmV2ZXJ0IHRvIGxhc3QgdmFsdWVzXHJcbiAgICAgICAgaWYgKCF0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29sZC5zdGFydCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLl9vbGQuc3RhcnQuY2xvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fb2xkLmVuZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5fb2xkLmVuZC5jbG9uZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiBhIG5ldyBkYXRlIHJhbmdlIHdhcyBzZWxlY3RlZCwgaW52b2tlIHRoZSB1c2VyIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0RGF0ZS5pc1NhbWUodGhpcy5fb2xkLnN0YXJ0KSB8fCAhdGhpcy5lbmREYXRlLmlzU2FtZSh0aGlzLl9vbGQuZW5kKSkge1xyXG4gICAgICAgICAgIC8vIHRoaXMuY2FsbGJhY2sodGhpcy5zdGFydERhdGUsIHRoaXMuZW5kRGF0ZSwgdGhpcy5jaG9zZW5MYWJlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiBwaWNrZXIgaXMgYXR0YWNoZWQgdG8gYSB0ZXh0IGlucHV0LCB1cGRhdGUgaXRcclxuICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLmlzU2hvd24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBjbGljayBvbiBhbGwgZWxlbWVudCBpbiB0aGUgY29tcG9uZW50LCB1c2VmdWwgZm9yIG91dHNpZGUgb2YgY2xpY2tcclxuICAgICAqIEBwYXJhbSBlIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIGhhbmRsZUludGVybmFsQ2xpY2soZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZSB0aGUgbG9jYWxlIG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSBsb2NhbGVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlTG9jYWxlKGxvY2FsZSkge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGxvY2FsZSkge1xyXG4gICAgICAgICAgaWYgKGxvY2FsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxlW2tleV0gPSBsb2NhbGVba2V5XTtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2N1c3RvbVJhbmdlTGFiZWwnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclJhbmdlcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAgY2xlYXIgdGhlIGRhdGVyYW5nZSBwaWNrZXJcclxuICAgICAqL1xyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKTtcclxuICAgICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XHJcbiAgICAgICAgdGhpcy5jaG9vc2VkRGF0ZS5lbWl0KHtjaG9zZW5MYWJlbDogJycsIHN0YXJ0RGF0ZTogbnVsbCwgZW5kRGF0ZTogbnVsbH0pO1xyXG4gICAgICAgIHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQoe3N0YXJ0RGF0ZTogbnVsbCwgZW5kRGF0ZTogbnVsbH0pO1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBvdXQgaWYgdGhlIHNlbGVjdGVkIHJhbmdlIHNob3VsZCBiZSBkaXNhYmxlZCBpZiBpdCBkb2Vzbid0XHJcbiAgICAgKiBmaXQgaW50byBtaW5EYXRlIGFuZCBtYXhEYXRlIGxpbWl0YXRpb25zLlxyXG4gICAgICovXHJcbiAgICBkaXNhYmxlUmFuZ2UocmFuZ2UpIHtcclxuICAgICAgaWYgKHJhbmdlID09PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHJhbmdlTWFya2VycyA9IHRoaXMucmFuZ2VzW3JhbmdlXTtcclxuICAgICAgY29uc3QgYXJlQm90aEJlZm9yZSA9IHJhbmdlTWFya2Vycy5ldmVyeSggZGF0ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdldE1pbkRhdGUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRlLmlzQmVmb3JlKHRoaXMuZ2V0TWluRGF0ZSgpKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBhcmVCb3RoQWZ0ZXIgPSByYW5nZU1hcmtlcnMuZXZlcnkoIGRhdGUgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5nZXRNYXhEYXRlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0ZS5pc0FmdGVyKHRoaXMuZ2V0TWF4RGF0ZSgpKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiAoYXJlQm90aEJlZm9yZSB8fCBhcmVCb3RoQWZ0ZXIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRhdGUgdGhlIGRhdGUgdG8gYWRkIHRpbWVcclxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIHNpZGU6IFNpZGVFbnVtKTogX21vbWVudC5Nb21lbnQge1xyXG4gICAgICAgIGxldCBob3VyID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciwgMTApO1xyXG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFtcG0gPSB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsO1xyXG4gICAgICAgICAgICBpZiAoYW1wbSA9PT0gJ1BNJyAmJiBob3VyIDwgMTIpIHtcclxuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFtcG0gPT09ICdBTScgJiYgaG91ciA9PT0gMTIpIHtcclxuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1pbnV0ZSA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZE1pbnV0ZSwgMTApO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZCA9IHRoaXMudGltZVBpY2tlclNlY29uZHMgPyBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQsIDEwKSA6IDA7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUuY2xvbmUoKS5ob3VyKGhvdXIpLm1pbnV0ZShtaW51dGUpLnNlY29uZChzZWNvbmQpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAgYnVpbGQgdGhlIGxvY2FsZSBjb25maWdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfYnVpbGRMb2NhbGUoKSB7XHJcbiAgICAgICAgdGhpcy5sb2NhbGUgPSB7Li4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnRoaXMubG9jYWxlfTtcclxuICAgICAgICAgaWYgKCF0aGlzLmxvY2FsZS5mb3JtYXQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUuZm9ybWF0ID0gbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnbGxsJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5mb3JtYXQgPSBtb21lbnQubG9jYWxlRGF0YSgpLmxvbmdEYXRlRm9ybWF0KCdMJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9idWlsZENlbGxzKGNhbGVuZGFyLCBzaWRlOiBTaWRlRW51bSkge1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDY7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0NsYXNzZXMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbXB0eVdlZWtSb3dDbGFzcyAmJlxyXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShBcnJheSg3KS5rZXlzKCkpLnNvbWUoaSA9PiBjYWxlbmRhcltyb3ddW2ldLm1vbnRoKCkgIT09IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0ubW9udGgpXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcm93Q2xhc3Nlcy5wdXNoKHRoaXMuZW1wdHlXZWVrUm93Q2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDc7IGNvbCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gW107XHJcbiAgICAgICAgICAgICAgICAvLyBlbXB0eSB3ZWVrIHJvdyBjbGFzc1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW1wdHlXZWVrQ29sdW1uQ2xhc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgIT09IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0ubW9udGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMuZW1wdHlXZWVrQ29sdW1uQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodCB0b2RheSdzIGRhdGVcclxuICAgICAgICAgICAgICAgIGlmIChjYWxlbmRhcltyb3ddW2NvbF0uaXNTYW1lKG5ldyBEYXRlKCksICdkYXknKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgndG9kYXknKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodCB3ZWVrZW5kc1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGVuZGFyW3Jvd11bY29sXS5pc29XZWVrZGF5KCkgPiA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCd3ZWVrZW5kJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBncmV5IG91dCB0aGUgZGF0ZXMgaW4gb3RoZXIgbW9udGhzIGRpc3BsYXllZCBhdCBiZWdpbm5pbmcgYW5kIGVuZCBvZiB0aGlzIGNhbGVuZGFyXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgIT09IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ29mZicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtYXJrIHRoZSBsYXN0IGRheSBvZiB0aGUgcHJldmlvdXMgbW9udGggaW4gdGhpcyBjYWxlbmRhclxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgJiYgKGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpIDwgY2FsZW5kYXJbMV1bMV0ubW9udGgoKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxlbmRhclsxXVsxXS5tb250aCgpID09PSAwKSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRheXNJbkxhc3RNb250aFxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgZmlyc3QgZGF5IG9mIHRoZSBuZXh0IG1vbnRoIGluIHRoaXMgY2FsZW5kYXJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzICYmIChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA+IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IDApICYmIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IDFcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBtYXJrIHRoZSBmaXJzdCBkYXkgb2YgdGhlIGN1cnJlbnQgbW9udGggd2l0aCBhIGN1c3RvbSBjbGFzc1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RNb250aERheUNsYXNzICYmIGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSBjYWxlbmRhclsxXVsxXS5tb250aCgpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gY2FsZW5kYXIuZmlyc3REYXkuZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgbGFzdCBkYXkgb2YgdGhlIGN1cnJlbnQgbW9udGggd2l0aCBhIGN1c3RvbSBjbGFzc1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vbnRoRGF5Q2xhc3MgJiYgY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgJiZcclxuICAgICAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmxhc3REYXkuZGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMubGFzdE1vbnRoRGF5Q2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGVzIGJlZm9yZSB0aGUgbWluaW11bSBkYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRNaW5EYXRlKCkgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMuZ2V0TWluRGF0ZSgpLCAnZGF5JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGVzIGFmdGVyIHRoZSBtYXhpbXVtIGRhdGVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1heERhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmlzQWZ0ZXIodGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tYXhEYXRlLCAnZGF5JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGUgaWYgYSBjdXN0b20gZnVuY3Rpb24gZGVjaWRlcyBpdCdzIGludmFsaWRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW52YWxpZERhdGUoY2FsZW5kYXJbcm93XVtjb2xdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnb2ZmJywgJ2Rpc2FibGVkJywgJ2ludmFsaWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHN0YXJ0IGRhdGVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdhY3RpdmUnLCAnc3RhcnQtZGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZW5kIGRhdGVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuZERhdGUgIT0gbnVsbCAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnYWN0aXZlJywgJ2VuZC1kYXRlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgZGF0ZXMgaW4tYmV0d2VlbiB0aGUgc2VsZWN0ZWQgZGF0ZXNcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMubm93SG92ZXJlZERhdGUgIT0gbnVsbCAmJiB0aGlzLnBpY2tpbmdEYXRlKSB8fCB0aGlzLmVuZERhdGUgIT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0gPiB0aGlzLnN0YXJ0RGF0ZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdIDwgdGhpcy5lbmREYXRlIHx8IChjYWxlbmRhcltyb3ddW2NvbF0gPCB0aGlzLm5vd0hvdmVyZWREYXRlICYmIHRoaXMucGlja2luZ0RhdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgIWNsYXNzZXMuZmluZChlbCA9PiBlbCA9PT0gJ29mZicpXHJcbiAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ2luLXJhbmdlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBhcHBseSBjdXN0b20gY2xhc3NlcyBmb3IgdGhpcyBkYXRlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0N1c3RvbSA9IHRoaXMuaXNDdXN0b21EYXRlKGNhbGVuZGFyW3Jvd11bY29sXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNDdXN0b20gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpc0N1c3RvbSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKGlzQ3VzdG9tKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShjbGFzc2VzLCBpc0N1c3RvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gYXBwbHkgY3VzdG9tIHRvb2x0aXAgZm9yIHRoaXMgZGF0ZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNUb29sdGlwID0gdGhpcy5pc1Rvb2x0aXBEYXRlKGNhbGVuZGFyW3Jvd11bY29sXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNUb29sdGlwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpc1Rvb2x0aXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbHRpcHRleHRbY2FsZW5kYXJbcm93XVtjb2xdXSA9IGlzVG9vbHRpcDsgLy8gc2V0dGluZyB0b29sdGlwdGV4dCBmb3IgY3VzdG9tIGRhdGVcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvb2x0aXB0ZXh0W2NhbGVuZGFyW3Jvd11bY29sXV0gPSAnUHV0IHRoZSB0b29sdGlwIGFzIHRoZSByZXR1cm5lZCB2YWx1ZSBvZiBpc1Rvb2x0aXBEYXRlJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnRvb2x0aXB0ZXh0W2NhbGVuZGFyW3Jvd11bY29sXV0gPSAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHN0b3JlIGNsYXNzZXMgdmFyXHJcbiAgICAgICAgICAgICAgICBsZXQgY25hbWUgPSAnJywgZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNuYW1lICs9IGNsYXNzZXNbaV0gKyAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzZXNbaV0gPT09ICdkaXNhYmxlZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbmFtZSArPSAnYXZhaWxhYmxlJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddW2NvbF0gPSBjbmFtZS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5jbGFzc2VzW3Jvd10uY2xhc3NMaXN0ID0gcm93Q2xhc3Nlcy5qb2luKCcgJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==