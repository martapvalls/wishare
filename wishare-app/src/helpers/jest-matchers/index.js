 
expect.extend({
    toBeOfType(received, argument) {
        return {
            message: () => `expected ${received} to be of type ${argument}`,
            pass: typeof received === argument
        }
    }
})

expect.extend({
    toBeOneOf(received, argument) {
        return {
            message: () => `expected ${received} to be one of ${argument}`,
            pass: argument.includes(received)
        }
    }
})

expect.extend({
    toHaveLengthGreaterThan(received, argument) {
        return {
            message: () => `expected ${received} to have length greater than ${argument}`,
            pass: received.length > argument
        }
    }
})