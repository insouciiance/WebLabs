using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using ToDoWebApi.GraphQL.ToDos;

namespace ToDoWebApi.Services.Validators
{
    public class ToDoCheckboxInputValidator : AbstractValidator<ToDoCheckboxInput>
    {
        public ToDoCheckboxInputValidator()
        {
            RuleFor(input => input.NoteId)
                .NotEmpty()
                .WithMessage(ErrorMessages.NoteIdEmpty);
        }
    }
}
