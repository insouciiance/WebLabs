using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoNotePayloadType : ObjectType<ToDoNotePayload>
    {
        protected override void Configure(IObjectTypeDescriptor<ToDoNotePayload> descriptor)
        {
            descriptor.Description("Represents the payload for a to-do note.");
        }
    }
}
