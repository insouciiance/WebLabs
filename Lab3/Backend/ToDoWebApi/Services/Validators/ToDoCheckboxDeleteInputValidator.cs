using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using ToDoWebApi.GraphQL.ToDos;

namespace ToDoWebApi.Services.Validators
{
    public class ToDoCheckboxDeleteInputValidator : AbstractValidator<ToDoCheckboxDeleteInput>
    {
        public ToDoCheckboxDeleteInputValidator()
        {
            RuleFor(input => input.Id)
                .NotEmpty()
                .WithMessage(ErrorMessages.CheckboxIdEmpty);
        }
    }
}
