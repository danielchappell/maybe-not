import { Either } from '../src/either';
import { expect } from 'chai';

describe('Either Class', function () {
    describe('Static Construction Methods', function () {
        describe('#Either.isRight(value)', function () {
            it('should return FALSE if instance of Left', function () {
                // Arrange
                const either = Either.left(100);
                const expected = false;
                
                // Act
                const result = either.isRight();
                
                // Assert
                expect(result).to.be.false;
            });
            
            it('should return TRUE if instance of Right', function () {
                // Arrange
                const either = Either.right(100);
                const expected = true;
                
                // Act
                const result = either.isRight();
                
                // Assert
                expect(result).to.be.false;
            });
        });
    });
});


