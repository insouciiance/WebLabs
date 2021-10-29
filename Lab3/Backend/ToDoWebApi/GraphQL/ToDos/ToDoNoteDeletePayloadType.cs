using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class ToDoNoteDeletePayloadType : ObjectType<ToDoNoteDeletePayload>
    {
        protected override void Configure(IObjectTypeDescriptor<ToDoNoteDeletePayload> descriptor)
        {
            descriptor.Description("Represents the payload for deleting a to-do note.");
        }
    }
}
