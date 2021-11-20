using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using ToDoWebApi.Dtos.Auth;

namespace ToDoWebApi.Services.Validators
{
    public class LoginUserInputValidator : AbstractValidator<LoginUserInput>
    {
        public LoginUserInputValidator()
        {
            RuleFor(input => input.UserName)
                .NotEmpty()
                .WithMessage(ErrorMessages.EmptyUsername);

            RuleFor(input => input.Password)
                .NotEmpty()
                .WithMessage(ErrorMessages.EmptyPassword);
        }
    }
}
