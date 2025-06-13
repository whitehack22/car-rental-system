import { product, authenticateUser, UserNameToLowerCase } from "../src/BasicUtils"


//😁😁 A better way but not yet

describe("BasicUtils test suite ", () => {
    it("should return the product of 3 and 2 ", () => {
        const actual = product(3, 2)
        expect(actual).toBe(6)
    })

    // TODO - Add a describe here - added only for testing
    describe('User authentication test', () => {

        it("Return the lowercase username of a valid user", () => {
            // Arrange
            const sut = authenticateUser // System Under Test
            // Act
            const actual = sut("deveLOPER", "dev") // System Under Test
            // Assert
            expect(actual.usernameToLower).toBe("developer")
        });

        it("Return the username characters of a valid user", () => {
            // Arrange
            const sut = authenticateUser // System Under Test
            // Act
            const actual = sut("deveLOPER", "dev") // System Under Test
            // Assert
            expect(actual.usernameCharacters).toEqual(['d', 'e', 'v', 'e', 'L', 'O', 'P', 'E', 'R'])
        });

        // what is a user enters -   'L', 'O', 'P', 'E', 'R', 'd', 'e', 'v', 'e',,
        it("Return username characters contsains a valid user", () => {
            // Arrange
            const sut = authenticateUser // System Under Test
            // Act
            const actual = sut("deveLOPER", "dev") // System Under Test
            // Assert
            expect(actual.usernameCharacters).toEqual(
                expect.arrayContaining(['L', 'O', 'P', 'E', 'R', 'd', 'e', 'v', 'e']));
        });

        // more matchers
        it("Return userDetails as empty object for a valid user", () => {
            // Arrange
            const sut = authenticateUser // System Under Test
            // Act
            const actual = sut("deveLOPER", "dev") // System Under Test
            // Assert
            expect(actual.userDetails).toEqual({}) // This is a positive test case
            expect(actual.isAuthenticated).toBeDefined()
            expect(actual.isAuthenticated).not.toBeUndefined()
            expect(actual.isAuthenticated).toBeTruthy() // This is a positive test case
            expect(actual.isAuthenticated).not.toBeFalsy() // This is a positive test case
        });
        // Truthy and Falsy
        it("Return isAuthenticated as true for a valid user", () => {
            // Arrange
            const sut = authenticateUser // System Under Test
            // Act
            const actual = sut("deveLOPER", "dev") // System Under Test
            // Assert
            expect(actual.isAuthenticated).toBeTruthy() // This is a positive test case
            expect(actual.isAuthenticated).not.toBeFalsy() // This is a positive test case
        });
    })
})

// Jest Hooks
// simulating a user name error
    describe("UsernameToLowerCase test suite ", () => {
        // setup 
        let sut: UserNameToLowerCase
        beforeEach(() => {
            console.log("Setup is here");
            sut = new UserNameToLowerCase()
        })

        it("should return the lowercase username of a valid user", () => {
            const actual = sut.toLower("Bob");
            console.log("I am here");
            expect(actual).toBe("bob")
        })

        it('should throw an error when username is empty', () => {
            expect(() => {
                sut.toLower("")
            }).toThrow("Username cannot be empty")

            // or
            expect(() => sut.toLower("")).toThrow()
        })

        it.each([
            { input: 'BriaN', expected: 'brian' },
            { input: 'Bob', expected: 'bob' },
            { input: 'Alice', expected: 'alice' },
        ])('$input to lowercase should be $expected', ({ input, expected }) => {
            const actual = sut.toLower(input)
            expect(actual).toBe(expected)
        })

         it.each([
            [3, 2, 6],
            [4, 2, 8],
            [5, 2, 10],
            [6, 2, 12],
        ])("should return the product of %i and %i", (a: number, b: number, expected: number) => {
            const actual = product(a, b)
            expect(actual).toBe(expected)
        })
    })