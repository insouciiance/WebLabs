using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoNotePutInputType : InputObjectType<ToDoNotePutInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<ToDoNotePutInput> descriptor)
        {
            descriptor.Description("Represents the input for changing a to-do note.");
        }
    }
}
