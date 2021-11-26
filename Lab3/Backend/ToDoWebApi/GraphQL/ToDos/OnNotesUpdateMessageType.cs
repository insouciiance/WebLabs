using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.ToDos
{
    public class OnNotesUpdateMessageType : ObjectType<OnNotesUpdateMessage>
    {
        protected override void Configure(IObjectTypeDescriptor<OnNotesUpdateMessage> descriptor)
        {
            descriptor.Description("Represents a subscription message when some user's notes change.");
        }
    }
}
