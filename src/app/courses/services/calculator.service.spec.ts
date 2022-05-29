import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe('CalculatorService', () => {
    let calculator: CalculatorService;
    let loggerSpy: any;

    beforeEach(() => {
        loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CalculatorService,
                { provide: LoggerService, useValue: loggerSpy }
            ],
        });
        calculator = TestBed.inject(CalculatorService);
    });

    it('it should add 2 numbers', () => {
        const result = calculator.add(2, 3);
        expect(result).toBe(5, "Supposed to be 5 cause 2 + 3 = 5");
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });

    it('it should subtract 2 numbers', () => {
        const result = calculator.subtract(2, 2);
        expect(result).toBe(0);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });
});