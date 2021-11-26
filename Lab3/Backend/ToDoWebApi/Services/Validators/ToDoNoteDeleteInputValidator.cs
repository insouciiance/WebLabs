using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using ToDoWebApi.GraphQL.ToDos;

namespace ToDoWebApi.Services.Validators
{
    public class ToDoNoteDeleteInputValidator : AbstractValidator<ToDoNoteDeleteInput>
    {
        public ToDoNoteDeleteInputValidator()
        {
            RuleFor(input => input.Id)
                .NotEmpty()
                .WithMessage(ErrorMessages.NoteIdEmpty);
        }
    }
}
