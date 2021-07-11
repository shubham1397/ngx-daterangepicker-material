var NgxDaterangepickerMd_1;
import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DaterangepickerComponent } from './daterangepicker.component';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { LOCALE_CONFIG } from './daterangepicker.config';
import { LocaleService } from './locale.service';
let NgxDaterangepickerMd = NgxDaterangepickerMd_1 = class NgxDaterangepickerMd {
    constructor() {
    }
    static forRoot(config = {}) {
        return {
            ngModule: NgxDaterangepickerMd_1,
            providers: [
                { provide: LOCALE_CONFIG, useValue: config },
                { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
            ]
        };
    }
};
NgxDaterangepickerMd = NgxDaterangepickerMd_1 = __decorate([
    NgModule({
        declarations: [
            DaterangepickerComponent,
            DaterangepickerDirective
        ],
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule
        ],
        providers: [],
        exports: [
            DaterangepickerComponent,
            DaterangepickerDirective
        ],
        entryComponents: [
            DaterangepickerComponent
        ]
    })
], NgxDaterangepickerMd);
export { NgxDaterangepickerMd };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJGOi9QUk9KRUNUL1RFTVAvbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC9zcmMvZGF0ZXJhbmdlcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZXJhbmdlcGlja2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQXdCLFFBQVEsRUFBc0IsTUFBTSxlQUFlLENBQUM7QUFDbkYsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWpFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3ZFLE9BQU8sRUFBZ0IsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBcUJqRCxJQUFhLG9CQUFvQiw0QkFBakMsTUFBYSxvQkFBb0I7SUFDL0I7SUFDQSxDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUF1QixFQUFFO1FBQ3RDLE9BQU87WUFDTCxRQUFRLEVBQUUsc0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQztnQkFDM0MsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUM7YUFDMUU7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUE7QUFaWSxvQkFBb0I7SUFuQmhDLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLHdCQUF3QjtZQUN4Qix3QkFBd0I7U0FDekI7UUFDRCxPQUFPLEVBQUU7WUFDUCxZQUFZO1lBQ1osV0FBVztZQUNYLG1CQUFtQjtTQUNwQjtRQUNELFNBQVMsRUFBRSxFQUFFO1FBQ2IsT0FBTyxFQUFFO1lBQ1Asd0JBQXdCO1lBQ3hCLHdCQUF3QjtTQUN6QjtRQUNELGVBQWUsRUFBRTtZQUNmLHdCQUF3QjtTQUN6QjtLQUNGLENBQUM7R0FDVyxvQkFBb0IsQ0FZaEM7U0FaWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyAgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIE9wdGlvbmFsLCBTa2lwU2VsZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTG9jYWxlQ29uZmlnLCBMT0NBTEVfQ09ORklHIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcclxuaW1wb3J0IHsgTG9jYWxlU2VydmljZSB9IGZyb20gJy4vbG9jYWxlLnNlcnZpY2UnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCxcclxuICAgIERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZVxyXG4gIF0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGUsXHJcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCxcclxuICAgIERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZVxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgICBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnRcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hEYXRlcmFuZ2VwaWNrZXJNZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogTG9jYWxlQ29uZmlnID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE5neERhdGVyYW5nZXBpY2tlck1kPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogTmd4RGF0ZXJhbmdlcGlja2VyTWQsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHsgcHJvdmlkZTogTE9DQUxFX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZ30sXHJcbiAgICAgICAgeyBwcm92aWRlOiBMb2NhbGVTZXJ2aWNlLCB1c2VDbGFzczogTG9jYWxlU2VydmljZSwgZGVwczogW0xPQ0FMRV9DT05GSUddfVxyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=