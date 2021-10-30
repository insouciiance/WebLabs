using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoCheckboxPutInputType : InputObjectType<ToDoCheckboxPutInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<ToDoCheckboxPutInput> descriptor)
        {
            descriptor.Description("Represents the input for changing a to-do checkbox.");
        }
    }
}
