import { __decorate, __param } from "tslib";
import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig } from './daterangepicker.config';
let LocaleService = class LocaleService {
    constructor(_config) {
        this._config = _config;
    }
    get config() {
        if (!this._config) {
            return DefaultLocaleConfig;
        }
        return Object.assign(Object.assign({}, DefaultLocaleConfig), this._config);
    }
};
LocaleService = __decorate([
    Injectable(),
    __param(0, Inject(LOCALE_CONFIG))
], LocaleService);
export { LocaleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiRjovUFJPSkVDVC9URU1QL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvc3JjL2RhdGVyYW5nZXBpY2tlci8iLCJzb3VyY2VzIjpbImxvY2FsZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFnQixNQUFNLDBCQUEwQixDQUFDO0FBRzVGLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7SUFDeEIsWUFBMkMsT0FBcUI7UUFBckIsWUFBTyxHQUFQLE9BQU8sQ0FBYztJQUFHLENBQUM7SUFFcEUsSUFBSSxNQUFNO1FBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTyxtQkFBbUIsQ0FBQztTQUM1QjtRQUVELHVDQUFZLG1CQUFtQixHQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDcEQsQ0FBQztDQUNGLENBQUE7QUFWWSxhQUFhO0lBRHpCLFVBQVUsRUFBRTtJQUVFLFdBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0dBRHZCLGFBQWEsQ0FVekI7U0FWWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExPQ0FMRV9DT05GSUcsIERlZmF1bHRMb2NhbGVDb25maWcsIExvY2FsZUNvbmZpZyB9IGZyb20gJy4vZGF0ZXJhbmdlcGlja2VyLmNvbmZpZyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMb2NhbGVTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihASW5qZWN0KExPQ0FMRV9DT05GSUcpIHByaXZhdGUgX2NvbmZpZzogTG9jYWxlQ29uZmlnKSB7fVxyXG5cclxuICBnZXQgY29uZmlnKCkge1xyXG4gICAgaWYgKCF0aGlzLl9jb25maWcpIHtcclxuICAgICAgcmV0dXJuIERlZmF1bHRMb2NhbGVDb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsuLi4gRGVmYXVsdExvY2FsZUNvbmZpZywgLi4udGhpcy5fY29uZmlnfTtcclxuICB9XHJcbn1cclxuIl19