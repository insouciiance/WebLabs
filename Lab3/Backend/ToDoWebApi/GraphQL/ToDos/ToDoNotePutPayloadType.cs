using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoNotePutPayloadType : ObjectType<ToDoNotePutPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<ToDoNotePutPayload> descriptor)
        {
            descriptor.Description("Represents the payload for changing a to-do note.");
        }
    }
}
