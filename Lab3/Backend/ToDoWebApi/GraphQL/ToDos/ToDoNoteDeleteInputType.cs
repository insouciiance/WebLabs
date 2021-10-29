using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoNoteDeleteInputType : InputObjectType<ToDoNoteDeleteInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<ToDoNoteDeleteInput> descriptor)
        {
            descriptor.Description("Represents the input for deleting a to-do note.");
        }
    }
}
