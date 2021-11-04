using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using ToDoWebApi.GraphQL.ToDos;

namespace ToDoWebApi.Services.Validators
{
    public class ToDoNotePutInputValidator : AbstractValidator<ToDoNotePutInput>
    {
        public ToDoNotePutInputValidator()
        {
            RuleFor(input => input.Id)
                .NotEmpty()
                .WithMessage(ErrorMessages.NoteIdEmpty);

            RuleFor(input => input.Name)
                .NotEmpty()
                .WithMessage(ErrorMessages.NoteNameEmpty);
        }
    }
}
