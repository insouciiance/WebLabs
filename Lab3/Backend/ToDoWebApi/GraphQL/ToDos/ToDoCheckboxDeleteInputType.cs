using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoCheckboxDeleteInputType : InputObjectType<ToDoCheckboxDeleteInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<ToDoCheckboxDeleteInput> descriptor)
        {
            descriptor.Description("Represents the input for deleting a to-do checkbox.");
        }
    }
}
