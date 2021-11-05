using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using HotChocolate;
using ToDoWebApi.GraphQL.Users;

namespace ToDoWebApi.Services.Validators
{
    public class RegisterUserInputValidator : AbstractValidator<RegisterUserInput>
    {
        public RegisterUserInputValidator()
        {
            RuleFor(input => input.UserName)
                .NotEmpty()
                .WithMessage(ErrorMessages.EmptyUsername);

            RuleFor(input => input.Email)
                .EmailAddress()
                .WithMessage(ErrorMessages.EmailNotValid);

            RuleFor(input => input.Password)
                .NotEmpty()
                .WithMessage(ErrorMessages.EmptyPassword);

            RuleFor(input => input.Password)
                .Matches("[A-Z]")
                .Unless(input => string.IsNullOrWhiteSpace(input.Password))
                .WithMessage(ErrorMessages.PasswordUppercaseLetter);

            RuleFor(input => input.Password)
                .Matches("[a-z]")
                .Unless(input => string.IsNullOrWhiteSpace(input.Password))
                .WithMessage(ErrorMessages.PasswordLowercaseLetter);

            RuleFor(input => input.Password)
                .Matches("[0-9]")
                .Unless(input => string.IsNullOrWhiteSpace(input.Password))
                .WithMessage(ErrorMessages.PasswordDigit);

            RuleFor(input => input.Password)
                .MinimumLength(6)
                .Unless(input => string.IsNullOrWhiteSpace(input.Password))
                .WithMessage(ErrorMessages.PasswordLength);

            RuleFor(input => new {input.Password, input.PasswordConfirm})
                .Must(passwords => passwords.Password.Equals(passwords.PasswordConfirm))
                .Unless(input => string.IsNullOrWhiteSpace(input.PasswordConfirm))
                .WithMessage(ErrorMessages.PasswordsMatch);
        }
    }
}
