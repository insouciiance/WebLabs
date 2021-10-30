using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoWebApi.GraphQL.ToDos
{
    public record ToDoNotePutInput(string Id, string Name);
}
