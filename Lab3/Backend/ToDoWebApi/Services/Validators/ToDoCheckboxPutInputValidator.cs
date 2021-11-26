using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using ToDoWebApi.GraphQL.ToDos;

namespace ToDoWebApi.Services.Validators
{
    public class ToDoCheckboxPutInputValidator : AbstractValidator<ToDoCheckboxPutInput>
    {
        public ToDoCheckboxPutInputValidator()
        {
            RuleFor(input => input.Id)
                .NotEmpty()
                .WithMessage(ErrorMessages.CheckboxIdEmpty);

            RuleFor(input => input.Text)
                .NotEmpty()
                .WithMessage(ErrorMessages.CheckboxTextEmpty);

            RuleFor(input => input.Text)
                .MaximumLength(128)
                .WithMessage(ErrorMessages.CheckboxTextSize);
        }
    }
}
