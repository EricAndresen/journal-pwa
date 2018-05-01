const app = require('./app')

test("entries is not empty", () => {
    expect(app.model.entries).toBeGreaterThan(0);
});