define('datepicker/datepicker', ['moment', 'angular'], function (moment) {
    moment.defineLocale('zh-cn', {
        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort: '日_一_二_三_四_五_六'.split('_'),
        weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
        longDateFormat: {
            LT: 'Ah点mm分',
            LTS: 'Ah点m分s秒',
            L: 'YYYY-MM-DD',
            LL: 'YYYY年MMMD日',
            LLL: 'YYYY年MMMD日Ah点mm分',
            LLLL: 'YYYY年MMMD日ddddAh点mm分',
            l: 'YYYY-MM-DD',
            ll: 'YYYY年MMMD日',
            lll: 'YYYY年MMMD日Ah点mm分',
            llll: 'YYYY年MMMD日ddddAh点mm分'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' ||
                meridiem === '上午') {
                return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            } else {
                // '中午'
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem: function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar: {
            sameDay: function () {
                return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
            },
            nextDay: function () {
                return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
            },
            lastDay: function () {
                return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
            },
            nextWeek: function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            lastWeek: function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            sameElse: 'LL'
        },
        ordinalParse: /\d{1,2}(日|月|周)/,
        ordinal: function (number, period) {
            switch (period) {
                case 'd':
                case 'D':
                case 'DDD':
                    return number + '日';
                case 'M':
                    return number + '月';
                case 'w':
                case 'W':
                    return number + '周';
                default:
                    return number;
            }
        },
        relativeTime: {
            future: '%s内',
            past: '%s前',
            s: '几秒',
            m: '1 分钟',
            mm: '%d 分钟',
            h: '1 小时',
            hh: '%d 小时',
            d: '1 天',
            dd: '%d 天',
            M: '1 个月',
            MM: '%d 个月',
            y: '1 年',
            yy: '%d 年'
        },
        week: {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow: 1, // Monday is the first day of the week.
            doy: 4  // The week that contains Jan 4th is the first week of the year.
        }
    });


    /* global moment */
    var Module = angular.module('datePicker', []);

    Module.constant('datePickerConfig', {
        template: Config.tplPath + 'tpl/datepicker.html',
        view: 'month',
        views: ['year', 'month', 'date', 'hours', 'minutes'],
        momentNames: {
            year: 'year',
            month: 'month',
            date: 'day',
            hours: 'hours',
            minutes: 'minutes',
        },
        viewConfig: {
            year: ['years', 'isSameYear'],
            month: ['months', 'isSameMonth'],
            hours: ['hours', 'isSameHour'],
            minutes: ['minutes', 'isSameMinutes'],
        },
        step: 5
    });

    //Moment format filter.
    Module.filter('mFormat', function () {
        return function (m, format, tz) {
            if (!(moment.isMoment(m))) {
                return moment(m).format(format);
            }
            return tz ? moment.tz(m, tz).format(format) : m.format(format);
        };
    });

    Module.directive('datePicker', ['datePickerConfig', 'datePickerUtils', function datePickerDirective(datePickerConfig, datePickerUtils) {

        //noinspection JSUnusedLocalSymbols
        return {
            // this is a bug ?
            require: '?ngModel',
            template: '<div ng-include="template"></div>',
            scope: {
                model: '=datePicker',
                after: '=?',
                before: '=?',
                dateSelect: '=?',
                dateMonth: '=?',
                statusList: '=?'
            },
            link: function (scope, element, attrs, ngModel) {
                function prepareViews() {
                    scope.views = datePickerConfig.views.concat();
                    scope.view = attrs.view || datePickerConfig.view;

                    scope.views = scope.views.slice(
                        scope.views.indexOf(attrs.maxView || 'year'),
                        scope.views.indexOf(attrs.minView || 'minutes') + 1
                    );

                    if (scope.views.length === 1 || scope.views.indexOf(scope.view) === -1) {
                        scope.view = scope.views[0];
                    }
                }

                function getDate(name) {
                    return datePickerUtils.getDate(scope, attrs, name);
                }

                datePickerUtils.setParams(attrs.timezone);

                var arrowClick = false,
                    tz = scope.tz = attrs.timezone,
                    createMoment = datePickerUtils.createMoment,
                    eventIsForPicker = datePickerUtils.eventIsForPicker,
                    step = parseInt(attrs.step || datePickerConfig.step, 10),
                    partial = !!attrs.partial,
                    minDate = getDate('minDate'),
                    maxDate = getDate('maxDate'),
                    pickerID = element[0].id,
                    now = scope.now = createMoment(),
                    selected = scope.date = createMoment(scope.model || now),
                    autoclose = attrs.autoClose === 'true';

                if (!scope.model) {
                    selected.minute(Math.ceil(selected.minute() / step) * step).second(0);
                }

                scope.template = attrs.template || datePickerConfig.template;

                scope.watchDirectChanges = attrs.watchDirectChanges !== undefined;
                scope.callbackOnSetDate = attrs.dateChange ? datePickerUtils.findFunction(scope, attrs.dateChange) : undefined;

                prepareViews();

                scope.setView = function (nextView) {
                    if (scope.views.indexOf(nextView) !== -1) {
                        scope.view = nextView;
                    }
                };

                scope.selectDate = function (date) {

                    if (attrs.disabled) {
                        return false;
                    }
                    if (isSame(scope.date, date)) {
                        date = scope.date;
                    }

                    if (scope.view == 'date') {
                        scope.dateSelect && scope.dateSelect(date);
                    }

                    date = clipDate(date);
                    if (!date) {
                        return false;
                    }
                    scope.date = date;

                    var nextView = scope.views[scope.views.indexOf(scope.view) + 1];
                    if ((!nextView || partial) || scope.model) {
                        setDate(date);
                    }

                    if (nextView) {
                        scope.setView(nextView);
                    } else if (autoclose) {
                        element.addClass('hidden');
                        scope.$emit('hidePicker');
                    } else {
                        prepareViewData();
                    }
                };

                function setDate(date) {
                    if (date) {
                        scope.model = date;
                        if (ngModel) {
                            ngModel.$setViewValue(date.format(attrs.format));
                        }
                    }
                    scope.$emit('setDate', scope.model, scope.view);

                    //This is duplicated in the new functionality.
                    if (scope.callbackOnSetDate) {
                        scope.callbackOnSetDate(attrs.datePicker, scope.date);
                    }
                }

                function update() {
                    var view = scope.view;
                    datePickerUtils.setParams(tz);

                    if (scope.model && !arrowClick) {
                        scope.date = createMoment(scope.model);
                        arrowClick = false;
                    }

                    var date = scope.date;

                    switch (view) {
                        case 'year':
                            scope.years = datePickerUtils.getVisibleYears(date);
                            break;
                        case 'month':
                            scope.months = datePickerUtils.getVisibleMonths(date);
                            break;
                        case 'date':
                            scope.weekdays = scope.weekdays || datePickerUtils.getDaysOfWeek();
                            scope.weeks = datePickerUtils.getVisibleWeeks(date);
                            break;
                        case 'hours':
                            scope.hours = datePickerUtils.getVisibleHours(date);
                            break;
                        case 'minutes':
                            scope.minutes = datePickerUtils.getVisibleMinutes(date, step);
                            break;
                    }

                    prepareViewData();
                }

                function watch() {
                    if (scope.view !== 'date') {
                        return scope.view;
                    }
                    return scope.date ? scope.date.month() : null;
                }

                scope.$watch(watch, update);

                if (scope.watchDirectChanges) {
                    scope.$watch('model', function () {
                        arrowClick = false;
                        update();
                    });
                }

                function prepareViewData() {
                    var view = scope.view,
                        date = scope.date,
                        classes = [], classList = '',
                        i, j;

                    datePickerUtils.setParams(tz);

                    if (view === 'date') {
                        var weeks = scope.weeks, week;
                        for (i = 0; i < weeks.length; i++) {
                            week = weeks[i];
                            classes.push([]);
                            for (j = 0; j < week.length; j++) {
                                classList = '';
                                if (datePickerUtils.isSameDay(date, week[j])) {
                                    classList += 'active';
                                }
                                if (isNow(week[j], view)) {
                                    classList += ' now';
                                }
                                //if (week[j].month() !== date.month()) classList += ' disabled';
                                if (week[j].month() !== date.month() || !inValidRange(week[j])) {
                                    classList += ' disabled';
                                }
                                classes[i].push(classList);
                            }
                        }
                    } else {
                        var params = datePickerConfig.viewConfig[view],
                            dates = scope[params[0]],
                            compareFunc = params[1];

                        for (i = 0; i < dates.length; i++) {
                            classList = '';
                            if (datePickerUtils[compareFunc](date, dates[i])) {
                                classList += 'active';
                            }
                            if (isNow(dates[i], view)) {
                                classList += ' now';
                            }
                            if (!inValidRange(dates[i])) {
                                classList += ' disabled';
                            }
                            classes.push(classList);
                        }
                    }
                    scope.classes = classes;
                }

                scope.next = function (delta) {
                    var date = moment(scope.date);
                    delta = delta || 1;
                    switch (scope.view) {
                        case 'year':
                        /*falls through*/
                        case 'month':
                            date.year(date.year() + delta);
                            break;
                        case 'date':
                            date.month(date.month() + delta);
                            scope.dateMonth && scope.dateMonth(date);
                            break;
                        case 'hours':
                        /*falls through*/
                        case 'minutes':
                            date.hours(date.hours() + delta);
                            break;
                    }
                    date = clipDate(date);
                    if (date) {
                        scope.date = date;
                        setDate(date);
                        arrowClick = true;
                        update();
                    }
                };

                function inValidRange(date) {
                    var valid = true;
                    if (minDate && minDate.isAfter(date)) {
                        valid = isSame(minDate, date);
                    }
                    if (maxDate && maxDate.isBefore(date)) {
                        valid &= isSame(maxDate, date);
                    }
                    return valid;
                }

                function isSame(date1, date2) {
                    return date1.isSame(date2, datePickerConfig.momentNames[scope.view]) ? true : false;
                }

                function clipDate(date) {
                    if (minDate && minDate.isAfter(date)) {
                        return minDate;
                    } else if (maxDate && maxDate.isBefore(date)) {
                        return maxDate;
                    } else {
                        return date;
                    }
                }

                function isNow(date, view) {
                    var is = true;

                    switch (view) {
                        case 'minutes':
                            is &= ~~(now.minutes() / step) === ~~(date.minutes() / step);
                        /* falls through */
                        case 'hours':
                            is &= now.hours() === date.hours();
                        /* falls through */
                        case 'date':
                            is &= now.date() === date.date();
                        /* falls through */
                        case 'month':
                            is &= now.month() === date.month();
                        /* falls through */
                        case 'year':
                            is &= now.year() === date.year();
                    }
                    return is;
                }

                scope.prev = function (delta) {
                    return scope.next(-delta || -1);
                };

                if (pickerID) {
                    scope.$on('pickerUpdate', function (event, pickerIDs, data) {
                        if (eventIsForPicker(pickerIDs, pickerID)) {
                            var updateViews = false, updateViewData = false;

                            if (angular.isDefined(data.minDate)) {
                                minDate = data.minDate ? data.minDate : false;
                                updateViewData = true;
                            }
                            if (angular.isDefined(data.maxDate)) {
                                maxDate = data.maxDate ? data.maxDate : false;
                                updateViewData = true;
                            }

                            if (angular.isDefined(data.minView)) {
                                attrs.minView = data.minView;
                                updateViews = true;
                            }
                            if (angular.isDefined(data.maxView)) {
                                attrs.maxView = data.maxView;
                                updateViews = true;
                            }
                            attrs.view = data.view || attrs.view;

                            if (updateViews) {
                                prepareViews();
                            }

                            if (updateViewData) {
                                update();
                            }
                        }
                    });
                }
            }
        };
    }]);
    /* global moment */

    angular.module('datePicker').factory('datePickerUtils', function () {
        var tz;
        var createNewDate = function (year, month, day, hour, minute) {
            var utc = Date.UTC(year | 0, month | 0, day | 0, hour | 0, minute | 0);
            return tz ? moment.tz(utc, tz) : moment(utc);
        };

        return {
            getVisibleMinutes: function (m, step) {
                var year = m.year(),
                    month = m.month(),
                    day = m.date(),
                    hour = m.hours(), pushedDate,
                    offset = m.utcOffset() / 60,
                    minutes = [], minute;

                for (minute = 0; minute < 60; minute += step) {
                    pushedDate = createNewDate(year, month, day, hour - offset, minute);
                    minutes.push(pushedDate);
                }
                return minutes;
            },
            getVisibleWeeks: function (m) {
                m = moment(m);
                var startYear = m.year(),
                    startMonth = m.month();

                //Set date to the first day of the month
                m.date(1);

                //Grab day of the week
                var day = m.day();

                if (day === 0) {
                    //If the first day of the month is a sunday, go back one week.
                    m.date(-6);
                } else {
                    //Otherwise, go back the required number of days to arrive at the previous sunday
                    m.date(1 - day);
                }

                var weeks = [];

                while (weeks.length < 6) {
                    if (m.year() === startYear && m.month() > startMonth) {
                        break;
                    }
                    weeks.push(this.getDaysOfWeek(m));
                    m.add(7, 'd');
                }
                return weeks;
            },
            getVisibleYears: function (d) {
                var m = moment(d),
                    year = m.year();

                m.year(year - (year % 10));
                year = m.year();

                var offset = m.utcOffset() / 60,
                    years = [],
                    pushedDate,
                    actualOffset;

                for (var i = 0; i < 12; i++) {
                    pushedDate = createNewDate(year, 0, 1, 0 - offset);
                    actualOffset = pushedDate.utcOffset() / 60;
                    if (actualOffset !== offset) {
                        pushedDate = createNewDate(year, 0, 1, 0 - actualOffset);
                        offset = actualOffset;
                    }
                    years.push(pushedDate);
                    year++;
                }
                return years;
            },
            getDaysOfWeek: function (m) {
                m = m ? m : (tz ? moment.tz(tz).day(0) : moment().day(0));

                var year = m.year(),
                    month = m.month(),
                    day = m.date(),
                    days = [],
                    pushedDate,
                    offset = m.utcOffset() / 60,
                    actualOffset;

                for (var i = 0; i < 7; i++) {
                    pushedDate = createNewDate(year, month, day, 0 - offset, 0, false);
                    actualOffset = pushedDate.utcOffset() / 60;
                    if (actualOffset !== offset) {
                        pushedDate = createNewDate(year, month, day, 0 - actualOffset, 0, false);
                    }
                    days.push(pushedDate);
                    day++;
                }
                return days;
            },
            getVisibleMonths: function (m) {
                var year = m.year(),
                    offset = m.utcOffset() / 60,
                    months = [],
                    pushedDate,
                    actualOffset;

                for (var month = 0; month < 12; month++) {
                    pushedDate = createNewDate(year, month, 1, 0 - offset, 0, false);
                    actualOffset = pushedDate.utcOffset() / 60;
                    if (actualOffset !== offset) {
                        pushedDate = createNewDate(year, month, 1, 0 - actualOffset, 0, false);
                    }
                    months.push(pushedDate);
                }
                return months;
            },
            getVisibleHours: function (m) {
                var year = m.year(),
                    month = m.month(),
                    day = m.date(),
                    hours = [],
                    hour, pushedDate, actualOffset,
                    offset = m.utcOffset() / 60;

                for (hour = 0; hour < 24; hour++) {
                    pushedDate = createNewDate(year, month, day, hour - offset, 0, false);
                    actualOffset = pushedDate.utcOffset() / 60;
                    if (actualOffset !== offset) {
                        pushedDate = createNewDate(year, month, day, hour - actualOffset, 0, false);
                    }
                    hours.push(pushedDate);
                }

                return hours;
            },
            isAfter: function (model, date) {
                return model && model.unix() >= date.unix();
            },
            isBefore: function (model, date) {
                return model.unix() <= date.unix();
            },
            isSameYear: function (model, date) {
                return model && model.year() === date.year();
            },
            isSameMonth: function (model, date) {
                return this.isSameYear(model, date) && model.month() === date.month();
            },
            isSameDay: function (model, date) {
                return this.isSameMonth(model, date) && model.date() === date.date();
            },
            isSameHour: function (model, date) {
                return this.isSameDay(model, date) && model.hours() === date.hours();
            },
            isSameMinutes: function (model, date) {
                return this.isSameHour(model, date) && model.minutes() === date.minutes();
            },
            setParams: function (zone) {
                tz = zone;
            },
            findFunction: function (scope, name) {
                //Search scope ancestors for a matching function.
                //Can probably combine this and the below function
                //into a single search function and two comparison functions
                //Need to add support for lodash style selectors (eg, 'objectA.objectB.function')
                var parentScope = scope;
                do {
                    parentScope = parentScope.$parent;
                    if (angular.isFunction(parentScope[name])) {
                        return parentScope[name];
                    }
                } while (parentScope.$parent);

                return false;
            },
            findParam: function (scope, name) {
                //Search scope ancestors for a matching parameter.
                var parentScope = scope;
                do {
                    parentScope = parentScope.$parent;
                    if (parentScope[name]) {
                        return parentScope[name];
                    }
                } while (parentScope.$parent);

                return false;
            },
            createMoment: function (m) {
                if (tz) {
                    return moment.tz(m, tz);
                } else {
                    //If input is a moment, and we have no TZ info, we need to remove TZ
                    //info from the moment, otherwise the newly created moment will take
                    //the timezone of the input moment. The easiest way to do that is to
                    //take the unix timestamp, and use that to create a new moment.
                    //The new moment will use the local timezone of the user machine.
                    return moment.isMoment(m) ? moment.unix(m.unix()) : moment(m);
                }
            },
            getDate: function (scope, attrs, name) {
                var result = false;
                if (attrs[name]) {
                    result = this.createMoment(attrs[name]);
                    if (!result.isValid()) {
                        result = this.findParam(scope, attrs[name]);
                        if (result) {
                            result = this.createMoment(result);
                        }
                    }
                }

                return result;
            },
            eventIsForPicker: function (targetIDs, pickerID) {
                //Checks if an event targeted at a specific picker, via either a string name, or an array of strings.
                return (angular.isArray(targetIDs) && targetIDs.indexOf(pickerID) > -1 || targetIDs === pickerID);
            }
        };
    });
    /* global moment */
    var Module = angular.module('datePicker');

    Module.directive('dateRange', ['$compile', 'datePickerUtils', 'dateTimeConfig', function ($compile, datePickerUtils, dateTimeConfig) {
        function getTemplate(attrs, id, model, min, max) {
            return dateTimeConfig.template(angular.extend(attrs, {
                ngModel: model,
                minDate: min && moment.isMoment(min) ? min.format() : false,
                maxDate: max && moment.isMoment(max) ? max.format() : false
            }), id);
        }

        function randomName() {
            return 'picker' + Math.random().toString().substr(2);
        }

        return {
            scope: {
                start: '=',
                end: '='
            },
            link: function (scope, element, attrs) {
                var dateChange = null,
                    pickerRangeID = element[0].id,
                    pickerIDs = [randomName(), randomName()],
                    createMoment = datePickerUtils.createMoment,
                    eventIsForPicker = datePickerUtils.eventIsForPicker;

                scope.dateChange = function (modelName, newDate) {
                    //Notify user if callback exists.
                    if (dateChange) {
                        dateChange(modelName, newDate);
                    }
                };

                function setMax(date) {
                    scope.$broadcast('pickerUpdate', pickerIDs[0], {
                        maxDate: date
                    });
                }

                function setMin(date) {
                    scope.$broadcast('pickerUpdate', pickerIDs[1], {
                        minDate: date
                    });
                }

                if (pickerRangeID) {
                    scope.$on('pickerUpdate', function (event, targetIDs, data) {
                        if (eventIsForPicker(targetIDs, pickerRangeID)) {
                            //If we received an update event, dispatch it to the inner pickers using their IDs.
                            scope.$broadcast('pickerUpdate', pickerIDs, data);
                        }
                    });
                }

                datePickerUtils.setParams(attrs.timezone);

                scope.start = createMoment(scope.start);
                scope.end = createMoment(scope.end);

                scope.$watchGroup(['start', 'end'], function (dates) {
                    //Scope data changed, update picker min/max
                    setMin(dates[0]);
                    setMax(dates[1]);
                });

                if (angular.isDefined(attrs.dateChange)) {
                    dateChange = datePickerUtils.findFunction(scope, attrs.dateChange);
                }

                attrs.onSetDate = 'dateChange';

                var template = '<div><table class="date-range"><tr><td valign="top">' +
                    getTemplate(attrs, pickerIDs[0], 'start', false, scope.end) +
                    '</td><td valign="top">' +
                    getTemplate(attrs, pickerIDs[1], 'end', scope.start, false) +
                    '</td></tr></table></div>';

                var picker = $compile(template)(scope);
                element.append(picker);
            }
        };
    }]);
    /* global moment */
    var PRISTINE_CLASS = 'ng-pristine',
        DIRTY_CLASS = 'ng-dirty';

    var Module = angular.module('datePicker');

    Module.constant('dateTimeConfig', {
        template: function (attrs, id) {
            return '' +
                '<div ' +
                (id ? 'id="' + id + '" ' : '') +
                'date-picker="' + attrs.ngModel + '" ' +
                (attrs.view ? 'view="' + attrs.view + '" ' : '') +
                (attrs.format ? 'format="' + attrs.format + '" ' : '') +
                (attrs.maxView ? 'max-view="' + attrs.maxView + '" ' : '') +
                (attrs.maxDate ? 'max-date="' + attrs.maxDate + '" ' : '') +
                (attrs.autoClose ? 'auto-close="' + attrs.autoClose + '" ' : '') +
                (attrs.template ? 'template="' + attrs.template + '" ' : '') +
                (attrs.minView ? 'min-view="' + attrs.minView + '" ' : '') +
                (attrs.minDate ? 'min-date="' + attrs.minDate + '" ' : '') +
                (attrs.partial ? 'partial="' + attrs.partial + '" ' : '') +
                (attrs.step ? 'step="' + attrs.step + '" ' : '') +
                (attrs.onSetDate ? 'date-change="' + attrs.onSetDate + '" ' : '') +
                (attrs.ngModel ? 'ng-model="' + attrs.ngModel + '" ' : '') +
                (attrs.timezone ? 'timezone="' + attrs.timezone + '" ' : '') +
                'class="date-picker-date-time"></div>';
        },
        format: 'YYYY-MM-DD HH:mm',
        views: ['date', 'year', 'month', 'hours', 'minutes'],
        autoClose: false,
        position: 'relative'
    });

    Module.directive('dateTimeAppend', function () {
        return {
            link: function (scope, element) {
                element.bind('click', function () {
                    element.find('input')[0].focus();
                });
            }
        };
    });

    Module.directive('dateTime', ['$compile', '$document', '$filter', 'dateTimeConfig', '$parse', 'datePickerUtils', '$timeout', function ($compile, $document, $filter, dateTimeConfig, $parse, datePickerUtils, $timeout) {
        var body = $document.find('body');
        var dateFilter = $filter('mFormat');

        return {
            require: 'ngModel',
            scope: true,
            link: function (scope, element, attrs, ngModel) {
                var format = attrs.format || dateTimeConfig.format,
                    parentForm = element.inheritedData('$formController'),
                    views = $parse(attrs.views)(scope) || dateTimeConfig.views.concat(),
                    view = attrs.view || views[0],
                    index = views.indexOf(view),
                    dismiss = attrs.autoClose ? $parse(attrs.autoClose)(scope) : dateTimeConfig.autoClose,
                    picker = null,
                    pickerID = element[0].id,
                    position = attrs.position || dateTimeConfig.position,
                    container = null,
                    minDate = null,
                    minValid = null,
                    maxDate = null,
                    maxValid = null,
                    timezone = attrs.timezone || false,
                    eventIsForPicker = datePickerUtils.eventIsForPicker,
                    dateChange = null,
                    shownOnce = false,
                    template;

                if (index === -1) {
                    views.splice(index, 1);
                }

                views.unshift(view);

                function formatter(value) {
                    var _date = dateFilter(value, format, timezone);
                    //默认值
                    if (!value) {
                        ngModel.$setViewValue(_date);
                        element.val(_date);
                    }
                    return _date;
                }

                function parser(viewValue) {
                    if (viewValue.length === format.length) {
                        return viewValue;
                    }
                    return undefined;
                }

                function setMin(date) {
                    minDate = date;
                    attrs.minDate = date ? date.format() : date;
                    minValid = moment.isMoment(date);
                }

                function setMax(date) {
                    maxDate = date;
                    attrs.maxDate = date ? date.format() : date;
                    maxValid = moment.isMoment(date);
                }

                ngModel.$formatters.push(formatter);
                // ngModel.$parsers.unshift(parser);



                ngModel.$parsers.push(function(val) {
                    if (!val) return;


                    if (attrs.format) {
                        return dateFilter(val, _format);
                    } else {
                        return val.getTime();

                    }
                });
                //
                // ngModel.$formatters.push(function() {
                //     if (!ngModel.$modelValue) return null;
                //     if (attrs.timestamp) {
                //         return new Date(parseInt(ngModel.$modelValue,10)).getTime();
                //     } else {
                //         return new Date(parseInt(ngModel.$modelValue,10));
                //     }
                // });


                if (angular.isDefined(attrs.minDate)) {
                    setMin(datePickerUtils.findParam(scope, attrs.minDate));

                    ngModel.$validators.min = function (value) {
                        //If we don't have a min / max value, then any value is valid.
                        return minValid ? moment.isMoment(value) && (minDate.isSame(value) || minDate.isBefore(value)) : true;
                    };
                }

                if (angular.isDefined(attrs.maxDate)) {
                    setMax(datePickerUtils.findParam(scope, attrs.maxDate));

                    ngModel.$validators.max = function (value) {
                        return maxValid ? moment.isMoment(value) && (maxDate.isSame(value) || maxDate.isAfter(value)) : true;
                    };
                }

                if (angular.isDefined(attrs.dateChange)) {
                    dateChange = datePickerUtils.findFunction(scope, attrs.dateChange);
                }

                function getTemplate() {
                    template = dateTimeConfig.template(attrs);
                }


                function updateInput(event) {
                    event.stopPropagation();
                    if (ngModel.$pristine) {
                        ngModel.$dirty = true;
                        ngModel.$pristine = false;
                        element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
                        if (parentForm) {
                            parentForm.$setDirty();
                        }
                        ngModel.$render();
                    }
                }

                function clear() {
                    if (picker) {
                        picker.remove();
                        picker = null;
                    }
                    if (container) {
                        container.remove();
                        container = null;
                    }
                }

                if (pickerID) {
                    scope.$on('pickerUpdate', function (event, pickerIDs, data) {
                        if (eventIsForPicker(pickerIDs, pickerID)) {
                            if (picker) {
                                //Need to handle situation where the data changed but the picker is currently open.
                                //To handle this, we can create the inner picker with a random ID, then forward
                                //any events received to it.
                            } else {
                                var validateRequired = false;
                                if (angular.isDefined(data.minDate)) {
                                    setMin(data.minDate);
                                    validateRequired = true;
                                }
                                if (angular.isDefined(data.maxDate)) {
                                    setMax(data.maxDate);
                                    validateRequired = true;
                                }

                                if (angular.isDefined(data.minView)) {
                                    attrs.minView = data.minView;
                                }
                                if (angular.isDefined(data.maxView)) {
                                    attrs.maxView = data.maxView;
                                }
                                attrs.view = data.view || attrs.view;

                                if (validateRequired) {
                                    ngModel.$validate();
                                }
                                if (angular.isDefined(data.format)) {
                                    format = attrs.format = data.format || dateTimeConfig.format;
                                    ngModel.$modelValue = -1; //Triggers formatters. This value will be discarded.
                                }
                                getTemplate();
                            }
                        }
                    });
                }

                function showPicker() {
                    if (picker) {
                        return;
                    }
                    // create picker element
                    picker = $compile(template)(scope);
                    scope.$digest();

                    //If the picker has already been shown before then we shouldn't be binding to events, as these events are already bound to in this scope.
                    if (!shownOnce) {
                        scope.$on('setDate', function (event, date, view) {
                            updateInput(event);
                            if (dateChange) {
                                dateChange(attrs.ngModel, date);
                            }
                            if (dismiss && views[views.length - 1] === view) {
                                clear();
                            }
                        });

                        scope.$on('hidePicker', function () {
                            element.triggerHandler('blur');
                        });

                        scope.$on('$destroy', clear);

                        shownOnce = true;
                    }


                    // move picker below input element

                    if (position === 'absolute') {
                        var pos = angular.extend(element.offset(), {height: element[0].offsetHeight});
                        picker.css({top: pos.top + pos.height, left: pos.left, display: 'block', position: position});
                        body.append(picker);
                    } else {
                        // relative
                        container = angular.element('<div date-picker-wrapper></div>');
                        element[0].parentElement.insertBefore(container[0], element[0]);
                        container.append(picker);
                        //          this approach doesn't work
                        //          element.before(picker);
                        picker.css({top: element[0].offsetHeight + 'px', display: 'block'});
                    }
                    picker.bind('mousedown', function (evt) {
                        evt.preventDefault();
                    });
                }

                element.bind('focus', showPicker);
                element.bind('blur', clear);
                getTemplate();
            }
        };
    }]);

});
