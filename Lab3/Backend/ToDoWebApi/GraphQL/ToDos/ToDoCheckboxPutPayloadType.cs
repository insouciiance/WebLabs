using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoCheckboxPutPayloadType : ObjectType<ToDoCheckboxPutPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<ToDoCheckboxPutPayload> descriptor)
        {
            descriptor.Description("Represents the payload for changing a to-do checkbox.");
        }
    }
}
