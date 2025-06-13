describe("Mock Function Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should call the mock function", () => {
        const mockFunction = jest.fn();

        mockFunction(); // call it
        expect(mockFunction).toHaveBeenCalled(); // passes
    })

    it("should call the mock function two times", () => {
        const mockFunction = jest.fn();

        mockFunction(); // call it
        mockFunction(); // call it
        expect(mockFunction).toHaveBeenCalledTimes(2); // passes
    })

    it("should be called with specific arguements", () => {
        const mockFunction = jest.fn();

        mockFunction('hello', 123); // call it with arguments
        expect(mockFunction).toHaveBeenCalledWith('hello', 123); // passes
    })

    it("should be return a specific value", () => {
        const mockReturn = jest.fn().mockReturnValue('Test Value');
        const result = mockReturn()
        expect(result).toBe('Test Value')
    })

    it("should be return a resolved promise with specific data", async () => {
        const fetchData = jest.fn().mockResolvedValue({ name: 'Alice' });

        const result = await fetchData();
       
        expect(result).toEqual({ name: 'Alice' });
    })
})
