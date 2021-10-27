using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoCheckboxPayloadType : ObjectType<ToDoCheckboxPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<ToDoCheckboxPayload> descriptor)
        {
            descriptor.Description("Represents the payload for a checkbox.");
        }
    }
}
