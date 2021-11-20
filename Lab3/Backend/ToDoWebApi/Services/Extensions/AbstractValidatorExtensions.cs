using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using HotChocolate;

namespace ToDoWebApi.Services.Extensions
{
    public static class AbstractValidatorExtensions
    {
        public static async Task ValidateAndThrowGraphQLExceptionAsync<T>(this AbstractValidator<T> validator, T input)
        {
            ValidationResult validationResult = await validator.ValidateAsync(input);

            if (validationResult.IsValid)
            {
                return;
            }

            List<ValidationFailure> validationFailures = validationResult.Errors;

            List<IError> errors = new();

            foreach (ValidationFailure failure in validationFailures)
            {
                errors.Add(new Error(failure.ErrorMessage));
            }

            throw new GraphQLException(errors);
        }

        public static async Task<IEnumerable<string>> ValidateAndGetStringsAsync<T>(this AbstractValidator<T> validator, T input)
        {
            List<string> errors = new();

            ValidationResult validationResult = await validator.ValidateAsync(input);

            if (validationResult.IsValid)
            {
                return null;
            }

            List<ValidationFailure> validationFailures = validationResult.Errors;

            foreach (ValidationFailure failure in validationFailures)
            {
                errors.Add(failure.ErrorMessage);
            }

            return errors;
        }
    }
}
