using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using ToDoWebApi.GraphQL.ToDos;

namespace ToDoWebApi.Services.Validators
{
    public class ToDoNoteInputValidator : AbstractValidator<ToDoNoteInput>
    {
        public ToDoNoteInputValidator()
        {
            RuleFor(input => input.Name)
                .NotEmpty()
                .WithMessage(ErrorMessages.NoteNameEmpty);

            RuleFor(input => input.Name)
                .MaximumLength(128)
                .WithMessage(ErrorMessages.NoteNameSize);
        }
    }
}
