using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoCheckboxInputType : InputObjectType<ToDoCheckboxInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<ToDoCheckboxInput> descriptor)
        {
            descriptor.Description("Represents the input for a new checkbox.");
        }
    }
}
