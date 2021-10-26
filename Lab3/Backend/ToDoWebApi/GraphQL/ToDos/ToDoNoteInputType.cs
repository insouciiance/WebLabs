using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoNoteInputType : InputObjectType<ToDoNoteInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<ToDoNoteInput> descriptor)
        {
            descriptor.Description("Represents the input to add a new to-do note.");
        }
    }
}
