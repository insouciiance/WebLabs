using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoCheckboxDeletePayloadType : ObjectType<ToDoCheckboxDeletePayload>
    {
        protected override void Configure(IObjectTypeDescriptor<ToDoCheckboxDeletePayload> descriptor)
        {
            descriptor.Description("Represents the payload for deleting a to-do checkbox.");
        }
    }
}
