
import {isContainer, isNumber} from './app/base/base';

describe('base', () => {
	it('base', () => {
		expect(isNumber(1)).toBe(true);
		expect(isContainer({})).toBe(true);
		expect(isContainer({a: 1})).toBe(true);
		expect(isContainer([])).toBe(true);
		expect(isContainer([1])).toBe(true);
	});
});
