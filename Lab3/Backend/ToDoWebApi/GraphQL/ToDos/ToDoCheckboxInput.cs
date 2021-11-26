using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoWebApi.GraphQL.ToDos
{
    public record ToDoCheckboxInput(string Text, string NoteId);
}
