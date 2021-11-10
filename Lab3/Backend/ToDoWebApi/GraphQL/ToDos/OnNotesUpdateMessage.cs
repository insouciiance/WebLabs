using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoWebApi.Models;

namespace ToDoWebApi.GraphQL.ToDos
{
    public record OnNotesUpdateMessage(IEnumerable<ToDoNote> Notes);
}
